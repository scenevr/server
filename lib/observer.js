var PacketParser = require('./packet-parser');
var Vector = require('scene-dom').Vector;
var Key = require('../publickey.js');
var JWT = require('json-web-token');
var WebSocket = require('ws');
var builder = require('xmlbuilder');

/**
 * An Observer represents one client listening on a socket, being fed world updates by a Reflector
 */
function Observer (socket, reflector) {
  this.socket = socket;
  this.reflector = reflector;

  if (this.reflector) {
    this.document = this.reflector.scene.ownerDocument;
  }
}

Observer.prototype.closeSocket = function () {
  if (this.socket && (this.socket.readyState !== WebSocket.CLOSED)) {
    this.socket.close();
  }
};

Observer.prototype.destroy = function () {
  this.closeSocket();

  delete this.reflector;
  delete this.awareList;
  delete this.player;
  delete this.socket;
};

Observer.prototype.respawn = function (reason) {
  var xml = builder.create('root').ele('event', {
    name: 'respawn',
    reason: reason.toString()
  }).toString({ pretty: false });

  this.sendMessage(xml);
};

Observer.prototype.inspectElement = function (el) {
  var xml = builder.create('root').ele('event', {
    name: 'inspect',
    uuid: el.uuid,
    startindex: el.getPrivateAttribute('startIndex')
  }).toString({ pretty: false });

  this.sendMessage(xml);
};

Observer.prototype.isModerator = function () {
  return false;
};

Observer.prototype.setPlayer = function (p) {
  this.player = p;
};

Observer.prototype.drop = function (reason) {
  console.log('[server] Dropped client for: ' + reason);
  this.closeSocket();
};

Observer.prototype.broadcast = function (xmlMessage) {
  this.reflector.broadcast(this, xmlMessage);
};

// Voice chat
Observer.prototype.createOpentokToken = function () {
  if (this.reflector.opentok) {
    if (!this.opentokToken) {
      this.opentokToken = this.reflector.opentok.createToken(this);
    }
  }
};

Observer.prototype.tryAuthenticate = function (token) {
  var payload = JWT.decode(Key, token);

  if (payload.value) {
    console.log('Player authenticated as ' + payload.value.name);
    this.player.setAttribute('name', payload.value.name);
    this.createOpentokToken();
  } else {
    console.log("Invalid token, couldn't authenticate player");
  }
};

Observer.prototype.makeAnonymous = function () {
  this.createOpentokToken();
};

Observer.prototype.recieveMessage = function (xml) {
  var self = this;

  PacketParser(xml).childNodes.forEach(function (element) {
    if ((element.localName === 'player') && (self.player)) {
      try {
        self.player.position = element.getAttribute('position');
      } catch (e) {
        self.drop('Invalid position ' + element.getAttribute('position'));
      }

      try {
        self.player.rotation = element.getAttribute('rotation');
      } catch (e) {
        self.drop('Invalid rotation ' + element.getAttribute('rotation'));
      }

      self.player.hmd = element.getAttribute('hmd');
    } else if (element.localName === 'event') {
      var el = element.getAttribute('uuid') && self.document.getElementByUUID(element.getAttribute('uuid'));
      
      try {
        if (el && (element.getAttribute('name') === 'click')) {
          el.dispatchEvent('click', {
            player: self.player,
            currentTarget: el,
            button: parseInt(element.getAttribute('button'), 10),
            point: Vector.fromString(element.getAttribute('point')),
            direction: Vector.fromString(element.getAttribute('direction')),
            normal: Vector.fromString(element.getAttribute('normal')),
            selectedColor: element.getAttribute('selectedColor')
          });
        } else if (el && (element.getAttribute('name') === 'collide')) {
          el.dispatchEvent('collide', {
            player: self.player,
            currentTarget: el,
            normal: Vector.fromString(element.getAttribute('normal'))
          });
        } else if (element.getAttribute('name') === 'chat') {
          self.reflector.chatChannel.sendMessage(self, element.getAttribute('message'));
        } else if (element.getAttribute('name') === 'authenticate') {
          if (element.getAttribute('anonymous')) {
            self.makeAnonymous();
          } else {
            self.tryAuthenticate(element.getAttribute('token'));
          }
        } else if (element.getAttribute('name') === 'inspect') {
          self.inspectElement(el);
        } else {
          console.log('Unrecognized event element or element not found\n  ' + element.toString());
        }
      } catch(e) {
        console.log('[server] ' + self.document.filename + ':\n  ' + (e.toString()));
        console.log(e.stack);
      }
    } else {
      console.log('Unrecognized packet element\n  ' + element.toString());
    }
  });
};

Observer.prototype.sendMessage = function (xml) {
  this.socket.send('<packet>' + xml + '</packet>');
};

module.exports = Observer;
