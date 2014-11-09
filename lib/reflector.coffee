class Reflector
  constructor: (@scene) ->
    @observers = []

  addObserver: (o) ->
    @observers.push(o)

    o.player = @scene.createElement "player"
    o.sendMessage "<event name=\"ready\" uuid=\"#{o.player.uuid}\" />"

  removeObserver: (o) ->
    @observers = for observer in @observers when observer != o
      observer

  startTicking: ->
    setInterval(@tick, 1000 / 2)

  tick: =>
    packets = []

    for element in @scene.childNodes when element.reflect
      packets.push element.outerHTML

    now = (new Date).valueOf()

    for uuid, timestamp of @scene.ownerDocument.deadNodes
      packets.push "<dead uuid=\"#{uuid}\" />"

      # Remove tombstones more than 2 seconds old
      if(timestamp < now - 2 * 1000)
        delete @scene.ownerDocument.deadNodes[uuid]

    for observer in @observers
      observer.socket.send("<packet>" + packets.join("\n") + "</packet>")

    null

module.exports = Reflector