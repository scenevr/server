class Observer
  constructor: (@socket, @reflector) ->
    @awareList = {}

  isAwareOf: (element) ->
    @awareList[element.uuid]

  makeAwareOf: (element) ->
    @awareList[element.uuid] = true

  recieveMessage: (packets) ->
    # for packet in packets
    #   if klass = Packets.dictionary[packet[0]]
    #     p = new klass(packet)
    #     p.process(@reflector)
    #   else
    #     console.log "Unhandled packet 0x#{packet[0].toString(16)}"

    console.log "Recieved message..."
    console.log "  " + JSON.stringify(packets)

module.exports = Observer