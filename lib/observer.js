'use strict';

var Node = require("./node"),
  Vector = require("./vector.js"),
  Key = require("../publickey.js"),
  JWT = require('json-web-token'),
  Env = require('./env.js');

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

Observer.prototype.getScene = function() {
  return this.reflector.scene;
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

Observer.prototype.tryAuthenticate = function(token){
  var payload = JWT.decode(Key, token)

  if(payload.value){
    console.log("Player authenticated as " + payload.value.name);
    this.player.setAttribute('name', payload.value.name);
  }else{
    console.log("Invalid token, couldn't authenticate player");
  }
};

Observer.prototype.hasModifyPermission = function(){
  return this.player.name === 'bnolan' || Env.isDevelopment();
}

Observer.prototype.recieveMessage = function(xml) {
  var e, el, element, _i, _len, _ref;
  _ref = Node.packetParser(xml).childNodes;

  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    element = _ref[_i];
    
    if (element.nodeName === "player") {
    
      try {
        this.player.position = element.getAttribute("position");
      } catch (e) {
        this.drop("Invalid position " + element.getAttribute("position"));
      }

      try {
        this.player.rotation = element.getAttribute("rotation");
      } catch (e) {
        this.drop("Invalid rotation " + element.getAttribute("rotation"));
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
        } else if (element.getAttribute('name') === 'authenticate'){
          this.tryAuthenticate(element.getAttribute('token'));
        } else if ( (this.hasModifyPermission()) && (element.getAttribute('name') === 'create')){
          this.createElement(element.firstChild);
        } else if ( (this.hasModifyPermission()) && (element.getAttribute('name') === 'update')){
          this.updateElement(element.getAttribute("uuid"), element.firstChild);
        } else if ( (this.hasModifyPermission()) && (element.getAttribute('name') === 'remove')){
          this.removeElement(element.getAttribute("uuid"));
        } else {
          console.log("Unrecognized event element or element not found");
          console.log("  " + xml);
        }
      }catch(e){
        console.log("[server] " + this.document.filename + ":\n  " + (e.toString()));
        
        if(Env.isDevelopment()){
          throw(e);
        }
      }
    } else {
      console.log("Unrecognized packet element");
      console.log("  " + element.toString());
    }
  }
};

Observer.prototype.createElement = function(el){
  var node = this.getScene().ownerDocument.importNode(el);
  this.getScene().appendChild(node);
}

Observer.prototype.updateElement = function(uuid, el){
  var node = this.getScene().ownerDocument.getElementByUUID(uuid);

  if(!node){
    console.log("Cannot find UUID for #updateElement");
    return;
  }

  // todo - copy childNodes
  el.attributes.forEach(function(attr){
    node.setAttribute(attr.name, attr.value);
  });
}

Observer.prototype.removeElement = function(uuid){
  var node = this.getScene().ownerDocument.getElementByUUID(uuid);

  if(!node){
    console.log("Cannot find UUID for #removeElement");
    return;
  }

  node.parentNode.removeChild(node);
}

Observer.prototype.sendMessage = function(xml) {
  return this.socket.send("<packet>" + xml + "</packet>");
};

module.exports = Observer;
