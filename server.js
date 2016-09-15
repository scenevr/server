#!/usr/bin/env node

const WebsocketServer = require('./lib/websocket-server');
const path = require('path');
const express = require('express');
const browserify = require('browserify-middleware');
const http = require('http');
const cors = require('cors');
const Env = require('./lib/env');
const fs = require('fs');

function Server (folder, port) {
  this.folder = path.join(process.cwd(), folder);
  this.port = parseInt(port, 10);
}

/**
 * Start the express server and the websocket server
 */
Server.prototype.start = function () {
  console.log('[server] Serving scenes in \'' + this.folder + '\' on port ' + this.port + '...');

  this.webServer = express();
  this.webServer.use(cors());

  this.webServer.set('view engine', 'ejs');

  this.webServer.use('/client.js', browserify(__dirname + '/client/index.js', {
    transform: [
      ['babelify', {presets: ['es2015']}]
    ],
    fullPaths: true
  }));

  this.webServer.get('/*.html', (req, res) => {
    res.render('show');
  });

  this.webServer.use(express.static(this.folder));

  var httpServer = http.createServer(this.webServer);
  httpServer.listen(this.port);

  this.websocketServer = new WebsocketServer(httpServer, this.folder);
  this.websocketServer.listen();
  this.websocketServer.folder = this.folder;

  if (Env.supportsAutoReload()) {
    fs.watch(this.folder, (event, filename) => {
      if (event === 'change') {
        this.websocketServer.restartReflectorsByFilename(path.resolve(this.folder, filename));
      }
    });
  }

  // this.loadAllScenes();

  if (Env.isDevelopment()) {
    require('dns').lookup(require('os').hostname(), (err, addr, fam) => {
      var url = err ? 'localhost:' + this.port : addr + ':' + this.port;
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
