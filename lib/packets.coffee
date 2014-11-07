Element = require('./element')

# todo - split into inbound and outbound packets....

class PacketIntroducing
  id: 0x01
  @id: 0x01
  
  constructor: (args) ->
    if args instanceof Array
      [nil, @xml] = args
    else
      @element = args
    # ...

  toArray: ->
    [@id, @element.toXml().toString()]

  process: (reflector) ->
    element = Element.loadFromXml(@xml)
    reflector.scene.appendChild element


class PacketUpdate
  id: 0x02
  @id: 0x02

  constructor: (@element) ->
    # ...

  toArray: ->
    [
      @id, 
      @element.id,
      @element.position.x, 
      @element.position.y, 
      @element.position.z, 
      @element.rotation.x,
      @element.rotation.y,
      @element.rotation.z
    ]

class PacketGone
  id: 0x03
  @id: 0x03
  
  constructor: (@element) ->
    # ...

  toArray: ->
    [@id, @element.id]

packets = {
    "Introducing" : PacketIntroducing
    "Update" : PacketUpdate
    "Gone" : PacketGone
  }

dictionary = {}

for key, value of packets
  dictionary[value.id] = value

packets.dictionary = dictionary

module.exports = packets