var Observer = require('./observer');
var WSServer = require('ws').Server;
var Env = require('./env');
var Reflector = require('./reflector');

function WebsocketServer (httpServer) {
  this.httpServer = httpServer;
  this.reflectors = {};
  this.clients = [];
}

WebsocketServer.prototype.addClient = function (client) {
  return this.clients.push(client);
};

WebsocketServer.prototype.removeClient = function (client) {
  if (this.clients.indexOf(client) >= 0) {
    this.clients.splice(this.clients.indexOf(client), 1);
  }
};

WebsocketServer.prototype.serverFull = function () {
  return this.clients.length >= Env.getMaxClients();
};

/**
 * Start listening for new websocket connections
 */
WebsocketServer.prototype.listen = function () {
  this.wsServer = new WSServer({
    server: this.httpServer
  });

  this.wsServer.on('connection', this.onConnection.bind(this));
};

/**
 * Handle a new connection, starting to serve a document or dropping due to conjection as appropriate
 */
WebsocketServer.prototype.onConnection = function (connection) {
  var self = this;

  console.log('[server] new request');

  this.addClient(connection);

  connection.on('close', function (reasonCode, description) {
    console.log('[server] Peer disconnected.');
    self.removeClient(connection);
  });

  if (this.serverFull()) {
    this.dropConnectionCongestion(connection);
  } else {
    this.serveConnection(connection);
  }
};

/**
 * Reject a connection due to congestion
 */
WebsocketServer.prototype.dropConnectionCongestion = function (connection) {
  console.log('[server] Dropped client due to congestion');
  connection.send('<packet><error message="Server too congested" maxclients="' + Env.getMaxClients() + '" /></packet>');
  connection.close();
};

/**
 * Serve to a client on a new websocket connection
 * The requested document will be gleaned from the upgradeReq information
 */
WebsocketServer.prototype.serveConnection = function (connection) {
  var reflector = this.reflectors[connection.upgradeReq.url];

  if (!reflector) {
    console.log('[server] 404 scene not found \'' + connection.upgradeReq.url + '\'');
    connection.close();
    return;
  }

  console.log("[server] client requested '" + connection.upgradeReq.url + "'");
  connection.observer = new Observer(connection, reflector);
  reflector.addObserver(connection.observer);

  connection.on('message', function (data, flags) {
    if (!flags.binary) {
      connection.observer.recieveMessage(data);
    }
  });

  connection.on('close', function (reasonCode, description) {
    reflector.removeObserver(connection.observer);
  });
};

/**
 * Add a SceneDOM document to be hosted from the given websocket url
 */
WebsocketServer.prototype.addDocument = function (document, url) {
  var reflector = new Reflector(document.scene, url);
  this.reflectors[url] = reflector;
  document.filename = url;
  reflector.start();
};

/**
 * Remove the document being served at the given URL, sending a "restart" event
 */
WebsocketServer.prototype.removeDocument = function (url) {
  var reflector = this.reflectors[url];
  // @todo are there other shutdown events that might be used here?
  reflector.emit('<event name="restart" />');
  reflector.stop();
  reflector.scene.stop();
  delete reflector.scene;
  delete this.reflectors[url];
};

/**
 * Return a list of all the URLs of the documents being served
 */
WebsocketServer.getDocumentURLs = function () {
  return this.reflectors.keys();
};

module.exports = WebsocketServer;
