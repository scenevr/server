Node = require("../node")

class Observer
  constructor: (@socket, @reflector) ->
    @awareList = {}

  isAwareOf: (element) ->
    @awareList[element.uuid]

  makeAwareOf: (element) ->
    @awareList[element.uuid] = true

  recieveMessage: (xml) ->
    # for packet in packets
    #   if klass = Packets.dictionary[packet[0]]
    #     p = new klass(packet)
    #     p.process(@reflector)
    #   else
    #     console.log "Unhandled packet 0x#{packet[0].toString(16)}"

    console.log "Recieved message..."
    console.log "  " + xml

    element = Node.packetParser(xml)

    console.log element.nodeName
    console.log element.childNodes.length

  sendMessage: (xml) ->
    @socket.send("<packet>#{xml}</packet>")

module.exports = Observer