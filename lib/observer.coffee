THREE = require('three')
utils = require('./utils')
Packets = require('./packets')

class Observer
  constructor: (@socket, @reflector) ->
    @id = utils.GUID()
    @position = new THREE.Vector3
    @awareList = {}

  isAwareOf: (element) ->
    @awareList[element.id]

  makeAwareOf: (element) ->
    @awareList[element.id] = true

  recieveMessage: (packets) ->
    for packet in packets
      if klass = Packets.dictionary[packet[0]]
        p = new klass(packet)
        p.process(@reflector)
      else
        console.log "Unhandled packet 0x#{packet[0].toString(16)}"

    console.log "Recieved message..."
    console.log "  " + JSON.stringify(packets)

module.exports = Observer