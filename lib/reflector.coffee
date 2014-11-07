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
    packets = []

    for element in @scene.childNodes when element.reflect
      packets << element.outerHTML

    for observer in @observers
      observer.socket.send(JSON.stringify(packets))

    null

module.exports = Reflector