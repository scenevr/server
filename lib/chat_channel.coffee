builder = require('xmlbuilder')

class ChatChannel
  constructor: (@reflector) ->

  sendMessage: (player, message) ->
    xml = builder.create('root')
      .ele('event', { name: 'chat', from : player.name || 'anonymous', message : message })
      .toString({ pretty: false })

    @reflector.sendAll xml
    @reflector.scene.dispatchEvent 'chat', { player : player, message : message }

module.exports = ChatChannel
