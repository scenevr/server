builder = require('xmlbuilder')

class ChatChannel
  constructor: (@reflector) ->

  sendMessage: (observer, message) ->
    xml = builder.create('root')
      .ele('event', { name: 'chat', from : observer.player.name || 'anonymous', message : message })
      .toString({ pretty: false })

    observer.broadcast xml
    @reflector.scene.dispatchEvent 'chat', { player : observer.player, message : message }

    xml

module.exports = ChatChannel
