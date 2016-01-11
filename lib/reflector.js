var _ = require('underscore');
var Env = require('./env');
var ChatChannel = require('./chat-channel');
var Scene = require('scene-dom').Scene;

/**
 * Reflector pushes out world changes to a number of observers.
 * Each observer should have the following methods:
 *  .sendMessage()
 *  .socket.send()
 * It is expected that this is an instance of Observer.
 */
function Reflector (document) {
  this.document = document;

  var scene = this.document.scene;

  if (!scene instanceof Scene) {
    throw new Error('Scene is not an instance of scene');
  }

  this.scene = scene;
  this.observers = [];
  this.chatChannel = new ChatChannel(this);
}

Reflector.prototype.getObserverByUUID = function (uuid) {
  return _.find(this.observers, function (observer) {
    return observer.player.uuid === uuid;
  });
};

Reflector.prototype.getElementByUUID = function (uuid) {
  return this.scene.ownerDocument.getElementByUUID(uuid);
};

Reflector.prototype.broadcast = function (observer, xmlString) {
  this.observers.forEach(function (obs) {
    if (observer !== obs) {
      obs.socket.send('<packet>' + xmlString + '</packet>');
    }
  });
};

Reflector.prototype.hasNoObservers = function () {
  return this.observers.length === 0;
};

/* Tell all clients to disconnect and reconnect in 1000ms */
Reflector.prototype.emitRestartEvent = function () {
  this.emit('<event name="restart" />');
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

  packets.push('<version scene="' + (this.scene.getAttribute('version') || '1.0') + '" />');

  this.scene.childNodes.forEach(function (element) {
    if (element.reflect) {
      packets.push(element.outerHTML);
    }
  });

  if (o.socket) {
    o.socket.send('<packet>' + packets.join('\n') + '</packet>', function (err) {
      if (err) {
        console.log('[server] Tried to write to dead socket');
      }
    });
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
  }

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
    if (observer.socket) {
      observer.socket.send(xml, function (err) {
        if (err) {
          console.log('[server] Tried to write to dead socket');
        }
      });
    }
  });
};

module.exports = Reflector;
