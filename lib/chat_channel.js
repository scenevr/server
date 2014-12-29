'use strict';

var Scene = require("../elements/scene");
var builder = require('xmlbuilder');

var ChatChannel = (function() {
  function ChatChannel(reflector) {
    this.reflector = reflector;
  }

  ChatChannel.prototype.sendMessage = function(observer, message) {
    var from;

    if(observer instanceof Scene){
      from = "scene";
    }else if(observer.player.name){
      from = observer.player.name;
    }else{
      from = "anonymous";
    }

    var xml = builder.create('root').ele('event', {
      name: 'chat',
      from: from,
      message: message
    }).toString({
      pretty: false
    });

    if(observer instanceof Scene){
      this.reflector.emit(xml);
    }else{
      observer.broadcast(xml);

      this.reflector.scene.dispatchEvent('chat', {
        player: observer.player,
        message: message
      });
    }

    return xml;
  };

  return ChatChannel;
})();

module.exports = ChatChannel;
