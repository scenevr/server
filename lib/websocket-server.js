var Observer = require('./observer');
var WSServer = require('ws').Server;
var Env = require('./env');

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

WebsocketServer.prototype.clearReflectors = function () {
  this.reflectors = {};
};

WebsocketServer.prototype.listen = function () {
  this.wsServer = new WSServer({
    server: this.httpServer
  });

  this.wsServer.on('connection', this.onConnection.bind(this));
};

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

WebsocketServer.prototype.dropConnectionCongestion = function (connection) {
  console.log('[server] Dropped client due to congestion');
  connection.send('<packet><error message="Server too congested" maxclients="' + Env.getMaxClients() + '" /></packet>');
  connection.close();
};

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

module.exports = WebsocketServer;
