'use strict';

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  _ = require("underscore"),
  ChatChannel = require("./chat_channel");

var Env = require("./env"),
  OpentokChannel = require("./opentok_channel");

function Reflector(scene) {
  this.scene = scene;
  this.tick = __bind(this.tick, this);
  this.observers = [];
  this.chatChannel = new ChatChannel(this);

  if(Env.getOpenTokKey()){
    this.opentok = new OpentokChannel(this);
  }
}

Reflector.prototype.getObserverByUUID = function(uuid){
  return _.find(this.observers, function(observer){
    return observer.player.uuid == uuid;
  });
};

Reflector.prototype.broadcast = function(observer, xmlString) {
  var obs, _i, _len, _ref, _results;
  _ref = this.observers;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    obs = _ref[_i];
    if (observer !== obs) {
      _results.push(obs.socket.send("<packet>" + xmlString + "</packet>"));
    }
  }
  return _results;
};

Reflector.prototype.emit = function(xmlString) {
  var observer, _i, _len, _ref, _results;
  _ref = this.observers;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    observer = _ref[_i];
    _results.push(observer.socket.send("<packet>" + xmlString + "</packet>"));
  }
  return _results;
};

Reflector.prototype.addObserver = function(o) {
  this.observers.push(o);

  o.setPlayer(this.scene.ownerDocument.createElement("player"));

  this.scene.appendChild(o.player);

  o.sendMessage("<event name=\"ready\" uuid=\"" + o.player.uuid + "\" />");

  this.sendScene(o);
};

Reflector.prototype.removeObserver = function(o) {
  var e, observer;
  if (o.player) {
    try {
      this.scene.removeChild(o.player);
    } catch (_error) {
      e = _error;
      console.log("[server] Unable to remove child");
    }
  }
  return this.observers = (function() {
    var _i, _len, _ref, _results;
    _ref = this.observers;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      observer = _ref[_i];
      if (observer !== o) {
        _results.push(observer);
      }
    }
    return _results;
  }).call(this);
};

Reflector.prototype.start = function() {
  this.scene.ownerDocument.reflector = this;
  this.scene.start(this);
  this.interval = setInterval(this.tick, 1000 / 5);
};

Reflector.prototype.stop = function() {
  var ob, _i, _len, _ref;
  clearInterval(this.interval);
  _ref = this.observers;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    ob = _ref[_i];
    ob.socket.close();
    this.removeObserver(ob);
    ob.player = null;
  }
  return this.observers = [];
};

Reflector.prototype.sendScene = function(o){
  var packets = [];

  this.scene.childNodes.forEach(function(element){
    if (element.reflect) {
      packets.push(element.outerHTML);
    }
  });

  try {
    o.socket.send("<packet>" + packets.join("\n") + "</packet>");
  } catch (e) {
    console.log("[server] Tried to write to dead socket");
  }
}

Reflector.prototype.tick = function() {
  if (this.observers.length === 0) {
    return;
  }

  var packets = [],
    uuid;

  for (uuid in this.scene.ownerDocument.dirtyNodes){
    var element = this.scene.ownerDocument.dirtyNodes[uuid];
    if(element.reflect){
      packets.push(element.outerHTML);
    }
  };

  // Clear the dirtyNodes
  this.scene.ownerDocument.dirtyNodes = {};

  var now = (new Date).valueOf();

  for (uuid in this.scene.ownerDocument.deadNodes) {
    var timestamp = this.scene.ownerDocument.deadNodes[uuid];
    
    packets.push("<dead uuid=\"" + uuid + "\" />");
    
    // query: Why to we keep sending dead packets for 2 seconds?
    if (timestamp < now - 2 * 1000) {
      delete this.scene.ownerDocument.deadNodes[uuid];
    }
  }

  var xml = "<packet>" + packets.join("\n") + "</packet>";

  this.observers.forEach(function(observer){
    try {
      observer.socket.send(xml);
    } catch (e) {
      console.log("[server] Tried to write to dead socket");
    }
  });
};

module.exports = Reflector;
