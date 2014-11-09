Node = require("../node")

class Observer
  constructor: (@socket, @reflector) ->
    @awareList = {}

  isAwareOf: (element) ->
    @awareList[element.uuid]

  makeAwareOf: (element) ->
    @awareList[element.uuid] = true

  recieveMessage: (xml) ->
    for element in Node.packetParser(xml).childNodes
      if element.nodeName == "player"
        @player.position = element.getAttribute("position")

  sendMessage: (xml) ->
    @socket.send("<packet>#{xml}</packet>")

module.exports = Observer