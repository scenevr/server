#!/usr/bin/env node

var IndexScene, PORT, Reflector, Scene, Server, WebsocketServer, cors, express, fs, glob, http, path, scenePath,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

var _ = require('underscore');

Reflector = require('./lib/reflector');
WebsocketServer = require('./lib/websocket_server');
Scene = require('./elements/scene');
IndexScene = require('./lib/index_scene');
path = require('path');
fs = require('fs');
glob = require('glob');
express = require('express');
http = require("http");
cors = require('cors');
PORT = process.env.PORT || 8080;

function Server(folder, port) {
  var httpServer;
  this.folder = folder;
  this.port = port;
  this.restartServer = __bind(this.restartServer, this);
  this.onLoaded = __bind(this.onLoaded, this);
  console.log("[server] Serving scenes in '" + this.folder + "' on port " + this.port + "...");
  this.webServer = express();
  this.webServer.use(cors());
  this.webServer.use(express["static"](this.folder));
  httpServer = http.createServer(this.webServer);
  httpServer.listen(port);
  this.websocketServer = new WebsocketServer(httpServer);
  this.websocketServer.listen();
  this.restart = _.throttle(this.restartServer, 1000, {trailing: false});
  this.loadAllScenes();

  require('dns').lookup(require('os').hostname(), function (err, add, fam) { 
    console.log('\nOpen the following url to view your scenes:\n\thttp://client.scenevr.com/?connect=' + add + ':8080/index.xml\n'); 
  })
}

Server.prototype.loadAllScenes = function() {
  var _this = this;

  glob(this.folder + "/*.xml", {}, function(er, files){

    if(files.length == 0){
      console.log("[server] Error. No scene files found in " + _this.folder);
      process.exit(-1);
    }

    var indexXml = new IndexScene(files).toXml();

    Scene.load(indexXml, function(scene) {
      _this.onLoaded(scene, '/index.xml');
    });

    files.forEach(function(filename) {
      Scene.load(filename, function(scene){
        _this.onLoaded(scene, '/' + path.basename(filename));
        fs.watch(filename, _this.restart);
      });
    });
  });
};

Server.prototype.onLoaded = function(scene, filename) {
  console.log("[server]  * Loaded '" + filename + "'");

  var reflector = new Reflector(scene, filename);
  this.websocketServer.reflectors[filename] = reflector;
  reflector.start();
};

Server.prototype.restartServer = function() {
  var filename, reflector, _ref;
  console.log("[server] Restarting server on file change.");
  _ref = this.websocketServer.reflectors;
  for (filename in _ref) {
    reflector = _ref[filename];
    reflector.emit('<event name="restart" />');
    reflector.stop();
    reflector.scene.stop();
    delete reflector.scene;
  }
  return setTimeout((function(_this) {
    return function() {
      _this.websocketServer.clearReflectors();
      return _this.loadAllScenes();
    };
  })(this), 250);
};

scenePath = process.argv[2] || process.env.SCENE_PATH;

if (!scenePath) {
  console.log("Usage: scenevr [scenedirectory]");
  process.exit(-1);
}

new Server(scenePath, PORT);
