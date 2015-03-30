var _ = require('underscore');
var Env = require('./env');
var ChatChannel = require('./chat_channel');
var OpentokChannel = require('./opentok_channel');
var Scene = require('../elements/scene');

function Reflector (scene) {
  if (!scene instanceof Scene) {
    throw new Error('Scene is not an instance of scene');
  }

  this.scene = scene;
  this.observers = [];
  this.chatChannel = new ChatChannel(this);

  if (Env.getOpenTokKey()) {
    this.opentok = new OpentokChannel(this);
  }
}

Reflector.prototype.getObserverByUUID = function (uuid) {
  return _.find(this.observers, function (observer) {
    return observer.player.uuid === uuid;
  });
};

Reflector.prototype.broadcast = function (observer, xmlString) {
  this.observers.forEach(function (obs) {
    if (observer !== obs) {
      obs.socket.send('<packet>' + xmlString + '</packet>');
    }
  });
};

Reflector.prototype.emit = function (xmlString) {
  this.observers.forEach(function (obs) {
    obs.socket.send('<packet>' + xmlString + '</packet>');
  });
};

Reflector.prototype.hasObserver = function (o) {
  return this.observers.indexOf(o) >= 0;
};

Reflector.prototype.addObserver = function (o) {
  this.observers.push(o);
  o.setPlayer(this.scene.ownerDocument.createElement('player'));
  this.scene.appendChild(o.player);
  o.sendMessage('<event name="ready" uuid="' + o.player.uuid + '" />');
  this.sendScene(o);
};

Reflector.prototype.removeObserver = function (o) {
  if (o.player) {
    try {
      this.scene.removeChild(o.player);
    } catch (e) {
      console.log('[server] Unable to remove child');
    }
  }

  o.destroy();

  this.observers.splice(this.observers.indexOf(o), 1);
};

Reflector.prototype.observerCount = function () {
  return this.observers.length;
};

Reflector.prototype.start = function () {
  this.scene.ownerDocument.reflector = this;
  this.scene.start(this);
  this.interval = setInterval(this.tick.bind(this), 1000 / Env.getTickHertz());
};

Reflector.prototype.stop = function () {
  var self = this;

  clearInterval(this.interval);

  this.observers.forEach(function (o) {
    self.removeObserver(o);
    o.destroy();
  });

  this.observers = [];
};

Reflector.prototype.sendScene = function (o) {
  var packets = [];

  this.scene.childNodes.forEach(function (element) {
    if (element.reflect) {
      packets.push(element.outerHTML);
    }
  });

  try {
    o.socket.send('<packet>' + packets.join('\n') + '</packet>');
  } catch (e) {
    console.log('[server] Tried to write to dead socket');
  }
};

Reflector.prototype.tick = function () {
  if (this.observers.length === 0) {
    return;
  }

  var packets = [],
    uuid;

  for (uuid in this.scene.ownerDocument.dirtyNodes) {
    var element = this.scene.ownerDocument.dirtyNodes[uuid];

    if (element.reflect) {
      packets.push(element.outerHTML);
    }
  };

  // Clear the dirtyNodes
  this.scene.ownerDocument.dirtyNodes = {};

  var now = (new Date()).valueOf();

  for (uuid in this.scene.ownerDocument.deadNodes) {
    var timestamp = this.scene.ownerDocument.deadNodes[uuid];

    packets.push('<dead uuid="' + uuid + '" />');

    // query: Why to we keep sending dead packets for 2 seconds?
    if (timestamp < now - 2 * 1000) {
      delete this.scene.ownerDocument.deadNodes[uuid];
    }
  }

  var xml = '<packet>' + packets.join('\n') + '</packet>';

  this.observers.forEach(function (observer) {
    try {
      observer.socket.send(xml);
    } catch (e) {
      console.log('[server] Tried to write to dead socket');
    }
  });
};

module.exports = Reflector;
