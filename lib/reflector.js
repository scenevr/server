'use strict';

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  _ = require("underscore"),
  ChatChannel = require("./chat_channel");

var Reflector = (function() {
  function Reflector(scene) {
    this.scene = scene;
    this.tick = __bind(this.tick, this);
    this.observers = [];
    this.chatChannel = new ChatChannel(this);
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
    return o.sendMessage("<event name=\"ready\" uuid=\"" + o.player.uuid + "\" />");
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

  Reflector.prototype.tick = function() {
    var e, element, now, observer, packets, timestamp, uuid, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    if (this.observers.length === 0) {
      return;
    }
    packets = [];
    _ref = this.scene.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      if (element.reflect) {
        packets.push(element.outerHTML);
      }
    }
    now = (new Date).valueOf();
    _ref1 = this.scene.ownerDocument.deadNodes;
    for (uuid in _ref1) {
      timestamp = _ref1[uuid];
      packets.push("<dead uuid=\"" + uuid + "\" />");
      if (timestamp < now - 2 * 1000) {
        delete this.scene.ownerDocument.deadNodes[uuid];
      }
    }
    _ref2 = this.observers;
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      observer = _ref2[_j];
      try {
        observer.socket.send("<packet>" + packets.join("\n") + "</packet>");
      } catch (_error) {
        e = _error;
        console.log("[server] Tried to write to dead socket");
      }
    }
    return null;
  };

  return Reflector;

})();

module.exports = Reflector;
