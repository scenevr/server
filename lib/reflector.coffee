ChatChannel = require("./chat_channel")

class Reflector
  constructor: (@scene) ->
    @observers = []
    @chatChannel = new ChatChannel(this)

  broadcast: (observer, xmlString) ->
    for obs in @observers when observer isnt obs
      obs.socket.send("<packet>" + xmlString + "</packet>")

  emit: (xmlString) ->
    for observer in @observers
      observer.socket.send("<packet>" + xmlString + "</packet>")

  addObserver: (o) ->
    @observers.push(o)

    o.setPlayer(@scene.ownerDocument.createElement "player")
    @scene.appendChild(o.player)

    o.sendMessage "<event name=\"ready\" uuid=\"#{o.player.uuid}\" />"

  removeObserver: (o) ->
    if o.player
      try
        @scene.removeChild o.player
      catch e
        console.log "[server] Unable to remove child"

    @observers = for observer in @observers when observer != o
      observer

  startTicking: ->
    @interval = setInterval(@tick, 1000 / 5)

  stop: ->
    clearInterval(@interval)

    for ob in @observers
      ob.socket.close()
      @removeObserver(ob)
      ob.player = null

    @observers = []

  tick: =>
    return if @observers.length == 0

    packets = []

    for element in @scene.childNodes when element.reflect
      packets.push element.outerHTML

    now = (new Date).valueOf()

    for uuid, timestamp of @scene.ownerDocument.deadNodes
      packets.push "<dead uuid=\"#{uuid}\" />"

      # Remove tombstones more than 2 seconds old
      if(timestamp < now - 2 * 1000)
        delete @scene.ownerDocument.deadNodes[uuid]

    # console.log "<packet>" + packets.join("\n") + "</packet>"

    for observer in @observers
      observer.socket.send("<packet>" + packets.join("\n") + "</packet>")

    null

module.exports = Reflector