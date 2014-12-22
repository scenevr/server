Node = require("./node")
Vector = require("./vector.js")

class Observer
  constructor: (@socket, @reflector) ->
    @awareList = {}
    @document = @reflector.scene.ownerDocument

  setPlayer: (p) ->
    @player = p

  drop: (reason) ->
    console.log "[server] Dropped client for: #{reason}"
    @socket.close()

  isAwareOf: (element) ->
    @awareList[element.uuid]

  makeAwareOf: (element) ->
    @awareList[element.uuid] = true

  broadcast: (xmlMessage) ->
    @reflector.broadcast(@, xmlMessage)

  recieveMessage: (xml) ->
    for element in Node.packetParser(xml).childNodes
      if element.nodeName == "player"
        try
          @player.position = element.getAttribute("position")
        catch e
          @drop("Invalid position " + element.getAttribute("position"))

      else if element.nodeName == "event"
        el = element.getAttribute('uuid') && @document.getElementByUUID(element.getAttribute('uuid'))

        if el && (element.getAttribute('name') is "click")
          el.dispatchEvent 'click', {
            player : @player
            point : Vector.fromString(element.getAttribute("point"))
          }
        else if el && (element.getAttribute('name') is "collide")
          el.dispatchEvent 'click', {
            player : @player
            normal : Vector.fromString(element.getAttribute("normal"))
          }
        else if element.getAttribute('name') is 'chat'
          @reflector.chatChannel.sendMessage(@, element.getAttribute('message'))
        else
          console.log "Unrecognized event element or element not found"
          console.log "  " + element.toString()
      else
        console.log "Unrecognized packet element"
        console.log "  " + element.toString()

  sendMessage: (xml) ->
    @socket.send("<packet>#{xml}</packet>")

module.exports = Observer
