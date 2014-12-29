var MAX_CLIENTS, Observer, WSServer, WebsocketServer, debug,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

'use strict';

Observer = require('./observer');

WSServer = require("ws").Server;

MAX_CLIENTS = 16;

debug = function(message) {
  return console.log((new Date()) + " " + message);
};

WebsocketServer = (function() {
  function WebsocketServer(httpServer) {
    this.httpServer = httpServer;
    this.onConnection = __bind(this.onConnection, this);
    this.queueInterval = __bind(this.queueInterval, this);
    this.reflectors = {};
    this.clients = [];
  }

  WebsocketServer.prototype.addClient = function(client) {
    return this.clients.push(client);
  };

  WebsocketServer.prototype.removeClient = function(client) {
    if (this.clients.indexOf(client) >= 0) {
      return this.clients.splice(this.clients.indexOf(client), 1);
    }
  };

  WebsocketServer.prototype.clientsAheadOf = function(client) {
    var index;
    index = this.clients.indexOf(client);
    if (index < MAX_CLIENTS) {
      return -1;
    } else {
      return index - MAX_CLIENTS;
    }
  };

  WebsocketServer.prototype.clearReflectors = function() {
    return this.reflectors = {};
  };

  WebsocketServer.prototype.listen = function() {
    this.wsServer = new WSServer({
      server: this.httpServer
    });
    this.wsServer.on("connection", this.onConnection);
    return setInterval(this.queueInterval, 1000);
  };

  WebsocketServer.prototype.queueInterval = function() {
    var client, index, _i, _len, _ref, _results;
    index = 0;
    _ref = this.clients;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      client = _ref[_i];
      if (index < MAX_CLIENTS && !client.observer) {
        this.serveConnection(client);
      }
      if (index >= MAX_CLIENTS) {
        client.send("<packet><queue limit='" + MAX_CLIENTS + "' position='" + (index - MAX_CLIENTS) + "' /></packet>");
      }
      _results.push(index++);
    }
    return _results;
  };

  WebsocketServer.prototype.onConnection = function(connection) {
    console.log("[server] new request");
    this.addClient(connection);
    connection.on("close", (function(_this) {
      return function(reasonCode, description) {
        console.log("[server] Peer disconnected.");
        return _this.removeClient(connection);
      };
    })(this));
    if (this.clientsAheadOf(connection) >= 0) {
      return this.queueConnection(connection);
    } else {
      return this.serveConnection(connection);
    }
  };

  WebsocketServer.prototype.queueConnection = function(connection) {};

  WebsocketServer.prototype.serveConnection = function(connection) {
    var reflector;
    reflector = this.reflectors[connection.upgradeReq.url];
    if (!reflector) {
      console.log("[server] 404 scene not found '" + connection.upgradeReq.url + "'");
      connection.close();
      return;
    }
    console.log("[server] client requested '" + connection.upgradeReq.url + "'");
    connection.observer = new Observer(connection, reflector);
    reflector.addObserver(connection.observer);
    connection.on("message", (function(_this) {
      return function(data, flags) {
        if (!flags.binary) {
          return connection.observer.recieveMessage(data);
        }
      };
    })(this));
    return connection.on("close", (function(_this) {
      return function(reasonCode, description) {
        return reflector.removeObserver(connection.observer);
      };
    })(this));
  };

  return WebsocketServer;

})();

module.exports = WebsocketServer;
