var DOM = require('scene-dom');
var Observer = require('./observer');
var WSServer = require('ws').Server;
var Env = require('./env');
var Reflector = require('./reflector');
var URL = require('url');
var fs = require('fs');
var path = require('path');

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

WebsocketServer.prototype.createObserver = function (connection, reflector) {
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

WebsocketServer.prototype.restartReflectorsByFilename = function (filename) {
  var key, reflector;

  for (key in this.reflectors) {
    reflector = this.reflectors[key];

    if (reflector.document.originalFilename === filename) {
      reflector.emitRestartEvent();
      reflector.stop();
      reflector.scene.stop();
      delete reflector.scene;
      delete this.reflectors[key];
    }
  }
};

WebsocketServer.prototype.loadReflector = function (filename, url, callback) {
  var self = this;

  fs.readFile(filename, 'utf8', function (err, xml) {
    if (err) {
      callback(err);
    }

    var document = DOM.createDocument().loadXML(xml);
    document.originalFilename = filename;
    document.location = URL.parse(url);
    console.log('[server] Loaded "' + filename + '" to serve "' + url + '"');

    var reflector = new Reflector(document, url);
    self.reflectors[url] = reflector;
    document.filename = filename;
    reflector.start();

    callback(null, reflector);
  });
};

/**
 * Serve to a client on a new websocket connection
 * The requested document will be gleaned from the upgradeReq information
 */
WebsocketServer.prototype.serveConnection = function (connection) {
  var self = this;
  var request = connection.upgradeReq;

  var uri = URL.parse(request.url);
  var filename = path.join(this.folder, uri.pathname);
  var reflector = this.reflectors[request.url];

  console.log("[server] client requested '" + request.url + "'");

  if (reflector) {
    self.createObserver(connection, reflector);
  } else {
    fs.exists(filename, function (result) {
      if (result) {
        self.loadReflector(filename, request.url, function (err, reflector) {
          if (err) {
            console.log('Could not load scene');
            return;
          }

          self.createObserver(connection, reflector);
        });
      } else {
        connection.send('<error code="404" message="Scene not found" />');
        connection.close();
        console.log('[server] 404 scene not found \'' + filename + '\'');
      }
    });
  }
};

/**
 * Return a list of all the URLs of the documents being served
 */
WebsocketServer.getDocumentURLs = function () {
  return this.reflectors.keys();
};

module.exports = WebsocketServer;
