var Node, Observer, Vector;

'use strict';

Node = require("./node");

Vector = require("./vector.js");

Observer = (function() {
  function Observer(socket, reflector) {
    this.socket = socket;
    this.reflector = reflector;
    this.awareList = {};
    this.document = this.reflector.scene.ownerDocument;
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
    var e, el, element, _i, _len, _ref, _results;
    _ref = Node.packetParser(xml).childNodes;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      if (element.nodeName === "player") {
        try {
          _results.push(this.player.position = element.getAttribute("position"));
        } catch (_error) {
          e = _error;
          _results.push(this.drop("Invalid position " + element.getAttribute("position")));
        }
      } else if (element.nodeName === "event") {
        el = element.getAttribute('uuid') && this.document.getElementByUUID(element.getAttribute('uuid'));
        if (el && (element.getAttribute('name') === "click")) {
          _results.push(el.dispatchEvent('click', {
            player: this.player,
            point: Vector.fromString(element.getAttribute("point"))
          }));
        } else if (el && (element.getAttribute('name') === "collide")) {
          _results.push(el.dispatchEvent('collide', {
            player: this.player,
            normal: Vector.fromString(element.getAttribute("normal"))
          }));
        } else if (element.getAttribute('name') === 'chat') {
          _results.push(this.reflector.chatChannel.sendMessage(this, element.getAttribute('message')));
        } else {
          console.log("Unrecognized event element or element not found");
          _results.push(console.log("  " + element.toString()));
        }
      } else {
        console.log("Unrecognized packet element");
        _results.push(console.log("  " + element.toString()));
      }
    }
    return _results;
  };

  Observer.prototype.sendMessage = function(xml) {
    return this.socket.send("<packet>" + xml + "</packet>");
  };

  return Observer;

})();

module.exports = Observer;
