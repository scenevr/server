var Node, Observer, Vector;

'use strict';

Node = require("./node");

Vector = require("./vector.js");

Observer = (function() {
  function Observer(socket, reflector) {
    this.socket = socket;
    this.reflector = reflector;
    this.awareList = {};

    if(this.reflector){
      this.document = this.reflector.scene.ownerDocument;
    }
  }

  Observer.prototype.setPlayer = function(p) {
    return this.player = p;
  };

  Observer.prototype.drop = function(reason) {
    console.log("[server] Dropped client for: " + reason);
    return this.socket.close();
  };

  Observer.prototype.isAwareOf = function(element) {
    return this.awareList[element.uuid];
  };

  Observer.prototype.makeAwareOf = function(element) {
    return this.awareList[element.uuid] = true;
  };

  Observer.prototype.broadcast = function(xmlMessage) {
    return this.reflector.broadcast(this, xmlMessage);
  };

  Observer.prototype.recieveMessage = function(xml) {
    var e, el, element, _i, _len, _ref;
    _ref = Node.packetParser(xml).childNodes;

    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      if (element.nodeName === "player") {
        try {
          this.player.position = element.getAttribute("position");
        } catch (_error) {
          e = _error;
          this.drop("Invalid position " + element.getAttribute("position"));
        }
      } else if (element.nodeName === "event") {
        el = element.getAttribute('uuid') && this.document.getElementByUUID(element.getAttribute('uuid'));

        try{
          if (el && (element.getAttribute('name') === "click")) {
            el.dispatchEvent('click', {
              player: this.player,
              point: Vector.fromString(element.getAttribute("point"))
            });
          } else if (el && (element.getAttribute('name') === "collide")) {
            el.dispatchEvent('collide', {
              player: this.player,
              normal: Vector.fromString(element.getAttribute("normal"))
            });
          } else if (element.getAttribute('name') === 'chat') {
            this.reflector.chatChannel.sendMessage(this, element.getAttribute('message'));
          } else {
            console.log("Unrecognized event element or element not found");
            console.log("  " + element.toString());
          }
        }catch(e){
          console.log("[server] " + this.document.filename + ":\n  " + (e.toString()));
        }
      } else {
        console.log("Unrecognized packet element");
        console.log("  " + element.toString());
      }
    }
  };

  Observer.prototype.sendMessage = function(xml) {
    return this.socket.send("<packet>" + xml + "</packet>");
  };

  return Observer;

})();

module.exports = Observer;
