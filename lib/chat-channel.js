var builder = require('xmlbuilder');

function ChatChannel (reflector) {
  this.reflector = reflector;
}

ChatChannel.prototype.sendMessage = function (observer, message) {
  var from;

  if (observer.player.name) {
    from = observer.player.name;
  } else {
    from = 'anonymous';
  }

  var attributes = {
    name: 'chat',
    from: from,
    message: message
  };

  if (observer.player) {
    attributes.uuid = observer.player.uuid;
  }

  var xml = builder.create('root').ele('event', attributes).toString({
    pretty: false
  });

  if (!observer) {
    this.reflector.emit(xml);
  } else {
    observer.broadcast(xml);

    this.reflector.scene.dispatchEvent('chat', {
      player: observer.player,
      message: message
    });
  }

  return xml;
};

module.exports = ChatChannel;
