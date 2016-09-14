'use strict';

const PacketParser = require('./packet-parser');
const Vector = require('scene-dom').Vector;
const Key = require('../publickey.js');
const JWT = require('json-web-token');
const builder = require('xmlbuilder');

/**
 * An Observer represents one client listening on a socket, being fed world updates by a Reflector
 */
class Observer {
  constructor (socket, reflector) {
    this.socket = socket;
    this.reflector = reflector;

    if (this.reflector) {
      this.document = this.reflector.scene.ownerDocument;
    }
  }

  closeSocket () {
    if (this.socket) {
      this.socket.close();
    }
  };

  destroy () {
    this.closeSocket();

    delete this.reflector;
    delete this.awareList;
    delete this.player;
    delete this.socket;
  }

  respawn (reason) {
    var xml = builder.create('root').ele('event', {
      name: 'respawn',
      reason: reason.toString()
    }).toString({ pretty: false });

    this.sendMessage(xml);
  };

  inspectElement (el) {
    var xml = builder.create('root').ele('event', {
      name: 'inspect',
      uuid: el.uuid,
      startindex: el.getPrivateAttribute('startIndex')
    }).toString({ pretty: false });

    this.sendMessage(xml);
  }

  isModerator () {
    return false;
  };

  setPlayer (p) {
    this.player = p;
  }

  drop (reason) {
    console.log('[server] Dropped client for: ' + reason);
    this.closeSocket();
  }

  broadcast (xmlMessage) {
    this.reflector.broadcast(this, xmlMessage);
  }

  tryAuthenticate (token) {
    var payload = JWT.decode(Key, token);

    if (payload.value) {
      console.log('Player authenticated as ' + payload.value.name);
      this.player.setAttribute('name', payload.value.name);
    } else {
      console.log("Invalid token, couldn't authenticate player");
    }
  }

  makeAnonymous () {
  }

  recieveMessage (xml) {
    PacketParser(xml).childNodes.forEach((element) => {
      if ((element.localName === 'player') && (this.player)) {
        try {
          this.player.position = element.getAttribute('position');
        } catch (e) {
          this.drop('Invalid position ' + element.getAttribute('position'));
        }

        try {
          this.player.rotation = element.getAttribute('rotation');
        } catch (e) {
          this.drop('Invalid rotation ' + element.getAttribute('rotation'));
        }

        this.player.hmd = element.getAttribute('hmd');
      } else if (element.localName === 'event') {
        var el = element.getAttribute('uuid') && this.document.getElementByUUID(element.getAttribute('uuid'));

        try {
          if (el && (element.getAttribute('name') === 'click')) {
            el.dispatchEvent('click', {
              player: this.player,
              currentTarget: el,
              button: parseInt(element.getAttribute('button'), 10),
              point: Vector.fromString(element.getAttribute('point')),
              direction: Vector.fromString(element.getAttribute('direction')),
              normal: Vector.fromString(element.getAttribute('normal')),
              selectedColor: element.getAttribute('selectedColor')
            });
          } else if (el && (element.getAttribute('name') === 'collide')) {
            el.dispatchEvent('collide', {
              player: this.player,
              currentTarget: el,
              normal: Vector.fromString(element.getAttribute('normal'))
            });
          } else if (element.getAttribute('name') === 'chat') {
            this.reflector.chatChannel.sendMessage(this, element.getAttribute('message'));
          } else if (element.getAttribute('name') === 'authenticate') {
            if (element.getAttribute('anonymous')) {
              this.makeAnonymous();
            } else {
              this.tryAuthenticate(element.getAttribute('token'));
            }
          } else if (element.getAttribute('name') === 'inspect') {
            this.inspectElement(el);
          } else {
            console.log('Unrecognized event element or element not found\n  ' + element.toString());
          }
        } catch (e) {
          console.log('[server] ' + this.document.filename + ':\n  ' + (e.toString()));
          console.log(e.stack);
        }
      } else {
        console.log('Unrecognized packet element\n  ' + element.toString());
      }
    });
  }

  sendMessage (message) {
    this.socket.send(message, (err) => {
      if (err) {
        console.log('[server] Socket went away');
        this.reflector.removeObserver(this);
      }
    });
  }
}

module.exports = Observer;
