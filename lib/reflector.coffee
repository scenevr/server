utils = require('./utils')
msgpack = require('msgpack')
Packets = require("./packets")

class Reflector
  constructor: (@scene) ->
    @observers = []

  addObserver: (o) ->
    @observers.push(o)

  removeObserver: (o) ->
    @observers = for observer in @observers when observer != o
      observer

  startTicking: ->
    setInterval(@tick, 1000 / 2)

  tick: =>
    for observer in @observers
      packets = []

      for element in @scene.elementsVisibleTo(observer)
        if !observer.isAwareOf(element)
          packets.push(new Packets.Introducing(element))
          observer.makeAwareOf(element)
        else if element.isDirty()
          packets.push(new Packets.Update(element))
        else if element.isGone()
          packets.push(new Packets.Gone(element))
        else
          # don't care...
        
      packets = for packet in packets
        packet.toArray()

      observer.socket.send(msgpack.pack(packets))

    @scene.markAllClean()

    null

module.exports = Reflector