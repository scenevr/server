Node = require("../node")
Vector = require("../vector.js")

class Observer
  constructor: (@socket, @reflector) ->
    @awareList = {}
    @document = @reflector.scene.ownerDocument

  isAwareOf: (element) ->
    @awareList[element.uuid]

  makeAwareOf: (element) ->
    @awareList[element.uuid] = true

  recieveMessage: (xml) ->
    for element in Node.packetParser(xml).childNodes
      if element.nodeName == "player"
        @player.position = element.getAttribute("position")
      else if element.nodeName == "event"
        if element.getAttribute("name") == "click"
          if @document.getElementByUUID(element.getAttribute("uuid"))
            @document.getElementByUUID(element.getAttribute("uuid")).dispatchEvent 'click', {
              player : @player
              point : Vector.fromString(element.getAttribute("point"))
            }
        else
          console.log "Unrecognized event element"
          console.log "  " + element.toString()
      else
        console.log "Unrecognized packet element"
        console.log "  " + element.toString()

  sendMessage: (xml) ->
    @socket.send("<packet>#{xml}</packet>")

module.exports = Observer