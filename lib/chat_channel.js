var ChatChannel, builder;

'use strict';

builder = require('xmlbuilder');

ChatChannel = (function() {
  function ChatChannel(reflector) {
    this.reflector = reflector;
  }

  ChatChannel.prototype.sendMessage = function(observer, message) {
    var xml;
    xml = builder.create('root').ele('event', {
      name: 'chat',
      from: observer.player.name || 'anonymous',
      message: message
    }).toString({
      pretty: false
    });
    observer.broadcast(xml);
    this.reflector.scene.dispatchEvent('chat', {
      player: observer.player,
      message: message
    });
    return xml;
  };

  return ChatChannel;

})();

module.exports = ChatChannel;
