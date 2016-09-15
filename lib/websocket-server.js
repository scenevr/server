'use strict';

const Observer = require('./observer');
const WSServer = require('ws').Server;
const Env = require('./env');
const Reflector = require('./reflector');
const URL = require('url');
const fs = require('fs');
const path = require('path');
const IndexScene = require('./index-scene');

const createGlobals = require('./globals');

class WebsocketServer {
  constructor (httpServer, folder) {
    this.httpServer = httpServer;
    this.reflectors = {};
    this.clients = [];
    this.loadIndexScene(folder);
  }

  addClient (client) {
    return this.clients.push(client);
  }

  removeClient (client) {
    if (this.clients.indexOf(client) >= 0) {
      this.clients.splice(this.clients.indexOf(client), 1);
    }
  }

  serverFull () {
    return this.clients.length >= Env.getMaxClients();
  }

  /**
   * Start listening for new websocket connections
   */
  listen () {
    this.wsServer = new WSServer({
      server: this.httpServer,
      perMessageDeflate: false
    });

    this.wsServer.on('connection', this.onConnection.bind(this));
  }

  /**
   * Handle a new connection, starting to serve a document or dropping due to conjection as appropriate
   */
  onConnection (connection) {
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
  }

  /**
   * Reject a connection due to congestion
   */
  dropConnectionCongestion (connection) {
    console.log('[server] Dropped client due to congestion');
    connection.send('<packet><error message="Server too congested" maxclients="' + Env.getMaxClients() + '" /></packet>');
    connection.close();
  }

  createObserver (connection, reflector) {
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
      } else {
        connection.observer.recieveMessage(data);
      }
    });

    connection.on('close', function (reasonCode, description) {
      reflector.removeObserver(connection.observer);

      if (reflector.empty) {
        // Disconnect reflectors that have no observers after 30 seconds

        if (reflector.isShuttingDownForReload) {
          // do nothing
          return;
        }

        setTimeout(function () {
          if (reflector.empty) {
            self.unloadReflector(reflector);

            if (Env.quitOnUnload()) {
              console.log('No client connected, shutting down server.');
              process.exit(0);
            }
          }
        }, 30 * 1000);
      }
    });
  }

  findReflectorByFilename (filename) {
    var key, reflector;

    for (key in this.reflectors) {
      reflector = this.reflectors[key];

      if (reflector.document.originalFilename === filename) {
        return reflector;
      }
    }
  }

  restartReflectorsByFilename (filename) {
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
  }

  unloadReflector (reflector) {
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
  }

  loadIndexScene (folder) {
    var self = this;

    IndexScene(folder, function (err, document) {
      if (err) {
        throw err;
      }

      console.log('[server] Loaded index scene');

      var reflector = new Reflector(createGlobals(), document, '/index.html');
      self.reflectors['/index.html'] = reflector;
      reflector.start();
    });
  }

  loadReflector (filename, url, callback) {
    var self = this;

    fs.readFile(filename, 'utf8', function (err, html) {
      if (err) {
        callback(err);
      }

      var g = createGlobals();
      var document = new g.Document();
      document.innerHTML = html;
      document.originalFilename = filename;
      document.location = URL.parse(url);
      console.log('[server] Loaded "' + filename + '" to serve "' + url + '"');

      var reflector = new Reflector(g, document, url);
      self.reflectors[url] = reflector;
      document.filename = filename;
      reflector.start();

      callback(null, reflector);
    });
  }

  /**
   * Serve to a client on a new websocket connection
   * The requested document will be gleaned from the upgradeReq information
   */
  serveConnection (connection) {
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
  }

  /**
   * Return a list of all the URLs of the documents being served
   */
  getDocumentURLs () {
    return this.reflectors.keys();
  }
}

module.exports = WebsocketServer;
