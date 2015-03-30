var Node = require('./node');
var Vector = require('./vector.js');
var Key = require('../publickey.js');
var JWT = require('json-web-token');

function Observer (socket, reflector) {
  this.socket = socket;
  this.reflector = reflector;

  if (this.reflector) {
    this.document = this.reflector.scene.ownerDocument;
  }
}

Observer.prototype.destroy = function () {
  this.reflector = undefined;
  this.awareList = undefined;

  this.socket.close();

  delete this.player;
  delete this.socket;
};

Observer.prototype.isModerator = function () {
  return false;
};

Observer.prototype.setPlayer = function (p) {
  this.player = p;
};

Observer.prototype.drop = function (reason) {
  console.log('[server] Dropped client for: ' + reason);
  this.socket.close();
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

  Node.packetParser(xml).childNodes.forEach(function (element) {
    if (element.nodeName === 'player') {
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
    } else if (element.nodeName === 'event') {
      var el = element.getAttribute('uuid') && self.document.getElementByUUID(element.getAttribute('uuid'));

      try {
        if (el && (element.getAttribute('name') === 'click')) {
          el.dispatchEvent('click', {
            player: self.player,
            point: Vector.fromString(element.getAttribute('point'))
          });
        } else if (el && (element.getAttribute('name') === 'collide')) {
          el.dispatchEvent('collide', {
            player: self.player,
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
        } else {
          console.log('Unrecognized event element or element not found\n  ' + element.toString());
        }
      } catch(e) {
        console.log('[server] ' + self.document.filename + ':\n  ' + (e.toString()));
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
