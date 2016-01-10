var DOM = require('scene-dom');
var Observer = require('./observer');
var WSServer = require('ws').Server;
var Env = require('./env');
var Reflector = require('./reflector');
var URL = require('url');
var fs = require('fs');
var path = require('path');
var IndexScene = require('./index-scene');

function WebsocketServer (httpServer, folder) {
  this.httpServer = httpServer;
  this.reflectors = {};
  this.clients = [];
  this.loadIndexScene(folder);
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
    server: this.httpServer,
    perMessageDeflate: false
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
  var self = this;

  connection.observer = new Observer(connection, reflector);
  reflector.addObserver(connection.observer);

  connection.on('message', function (data, flags) {
    if (flags.binary) {
      // Forward on voice packets
      reflector.observers.forEach(function (observer) {
        if (connection.observer !== observer) {
          observer.socket.send(data);
        }
      });

      console.log(data.length);
    } else {
      connection.observer.recieveMessage(data);
    }
  });

  connection.on('close', function (reasonCode, description) {
    reflector.removeObserver(connection.observer);

    if (reflector.hasNoObservers()) {
      // Disconnect reflectors that have no observers after 30 seconds

      setTimeout(function () {
        if (reflector.hasNoObservers()) {
          self.unloadReflector(reflector);

          if (Env.quitOnUnload()) {
            console.log('No client connected, shutting down server.');
            process.exit(0);
          }
        }
      }, 30 * 1000);
    }
  });
};

WebsocketServer.prototype.findReflectorByFilename = function (filename) {
  var key, reflector;

  for (key in this.reflectors) {
    reflector = this.reflectors[key];

    if (reflector.document.originalFilename === filename) {
      return reflector;
    }
  }
};

WebsocketServer.prototype.restartReflectorsByFilename = function (filename) {
  var key, reflector, restart;

  for (key in this.reflectors) {
    restart = false;
    reflector = this.reflectors[key];

    // Restart if any linked script tags are modified
    reflector.scene.getElementsByTagName('script').forEach(function (scriptElement) {
      var base = path.dirname(reflector.document.originalFilename);
      var fullPath = path.resolve(base, './' + scriptElement.src);

      if (fullPath === filename) {
        restart = true;
      }
    });

    if (reflector.document.originalFilename === filename) {
      restart = true;
    }

    if (restart) {
      reflector.emitRestartEvent();
      this.unloadReflector(reflector);
    }
  }
};

WebsocketServer.prototype.unloadReflector = function (reflector) {
  console.log('[server] Unloaded reflector ' + reflector.document.originalFilename);

  reflector.stop();

  if (reflector.scene) {
    reflector.scene.stop();
    delete reflector.scene;
  }

  for (var key in this.reflectors) {
    if (this.reflectors[key] === reflector) {
      delete this.reflectors[key];
    }
  }
};

WebsocketServer.prototype.loadIndexScene = function (folder) {
  var self = this;

  IndexScene(folder, function (err, xml) {
    if (err) {
      throw err;
    }

    var document = DOM.createDocument().loadXML(xml);
    console.log('[server] Loaded index scene');

    var reflector = new Reflector(document, '/index.xml');
    self.reflectors['/index.xml'] = reflector;
    reflector.start();
  });
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
