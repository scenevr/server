# builder = require('xmlbuilder')

class ChatChannel
  constructor: (@reflector) ->

  sendMessage: (player, message) ->
    return

    xml = builder.create('root')
      .ele('chat', { from : player.name, message : message })
      .toString({ pretty: false })

    console.log(xml)

    @reflector.sendAll "<chat from='#{player.name}'>"
    @reflector.scene.dispatchEvent 'chat', { player : player, message : message }