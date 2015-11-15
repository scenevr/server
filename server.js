#!/usr/bin/env node

var WebsocketServer = require('./lib/websocket-server');
var path = require('path');
var express = require('express');
var http = require('http');
var cors = require('cors');
var Env = require('./lib/env');
var fs = require('fs');

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
    res.redirect('http://www.scenevr.com/ws/' + req.get('host') + '/index.xml');
  });

  var httpServer = http.createServer(this.webServer);
  httpServer.listen(this.port);

  this.websocketServer = new WebsocketServer(httpServer, this.folder);
  this.websocketServer.listen();
  this.websocketServer.folder = this.folder;

  if (Env.supportsAutoReload()) {
    fs.watch(this.folder, function (event, filename) {
      if (event === 'change') {
        self.websocketServer.restartReflectorsByFilename(path.resolve(self.folder, filename));
      }
    });
  }

  // this.loadAllScenes();

  if (Env.isDevelopment()) {
    require('dns').lookup(require('os').hostname(), function (err, addr, fam) {
      var url = err ? 'localhost:' + self.port : addr + ':' + self.port;
      console.log('\n\thttp://' + url + '/\n');
    });
  }
};

var scenePath = process.argv[2];

if (!scenePath) {
  console.log('Usage: scenevr [scenedirectory]');
  process.exit(-1);
}

var server = new Server(scenePath, Env.getPort());
server.start();
