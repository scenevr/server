#!/usr/bin/env node

var _ = require('underscore');
var WebsocketServer = require('./lib/websocket-server');
var SceneDOM = require('scene-dom');
var IndexScene = require('./lib/index-scene');
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var express = require('express');
var http = require('http');
var cors = require('cors');
var Env = require('./lib/env');

function Server (folder, port) {
  this.folder = path.join(process.cwd(), folder);
  this.port = parseInt(port, 10);
}

/**
 * Start the express server and the websocket server
 */
Server.prototype.start = function () {
  var self = this;

  console.log('[server] Serving scenes in \'' + this.folder + '\' on port ' + this.port + '...');

  this.webServer = express();
  this.webServer.use(cors());
  this.webServer.use(express.static(this.folder));

  this.webServer.get('/', function (req, res) {
    res.redirect('http://client.scenevr.com/?connect=' + req.get('host'));
  });

  var httpServer = http.createServer(this.webServer);
  httpServer.listen(this.port);

  this.websocketServer = new WebsocketServer(httpServer);
  this.websocketServer.listen();

  if (Env.supportsAutoReload()) {
    this.restart = _.throttle(this.restartServer.bind(this), 1000, {trailing: false});
  }

  this.loadAllScenes();

  if (Env.isDevelopment()) {
    require('dns').lookup(require('os').hostname(), function (err, addr, fam) {
      var url = err ? 'localhost:' + self.port : addr + ':' + self.port;
      console.log('\n\thttp://' + url + '/\n');
    });
  }
};

/**
 * Load all the scenes to host from disk and into the websocket server
 */
Server.prototype.loadAllScenes = function () {
  var self = this;

  glob(this.folder + '/*.xml', {}, function (err, files) {
    if (err || (files.length === 0)) {
      console.log('[server] Error. No scene files found in ' + self.folder);
      if (Env.isDevelopment()) {
        process.exit(-1);
      }
    }

    var indexXml = new IndexScene(files).toXml();
    var document = SceneDOM.createDocument().loadXML(indexXml);

    self.websocketServer.addDocument(document, '/index.xml');

    files.forEach(function (match) {
      var filename = path.resolve(__dirname, match);

      try {
        fs.readFile(filename, 'utf8', function (err, xml) {
          if (err) throw new Error(err);

          var document = SceneDOM.createDocument().loadXML(xml);
          document.originalFilename = filename;
          self.websocketServer.addDocument(document, '/' + path.basename(filename));
          console.log('[server]  * Loaded \'' + filename + '\'');

          if (Env.supportsAutoReload()) {
            fs.watch(filename, self.restart);
          }
        });
      } catch(e) {
        console.log('[server] Could not load filename: ' + e);
      }
    });
  });
};

/**
 * Restart all documents in the server
 */
Server.prototype.restartServer = function () {
  var self = this;

  console.log('[server] Restarting server on file change.');

  this.websocketServer.getDocumentURLs().forEach(function (url) {
    self.websocketServer.removeDocument(url);
  });

  setTimeout(function () {
    self.loadAllScenes();
  }, 250);
};

var scenePath = process.argv[2];

if (!scenePath) {
  console.log('Usage: scenevr [scenedirectory]');
  process.exit(-1);
}

var server = new Server(scenePath, Env.getPort());
server.start();
