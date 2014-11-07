_ = require 'underscore'

Reflector = require './lib/reflector'
WebsocketServer = require './lib/websocket_server'
Scene = require './scene'

class Server
  constructor: (@filename, @port) ->
    console.log "Loading '#{@filename}'..."
    Scene.load(@filename, @onLoaded)

  onLoaded: (scene) =>
    @scene = scene

    # The reflector handles sending updates to the scene to observers
    @reflector = new Reflector(@scene)

    # Handles connections and messages from the websocket
    @websocketServer = new WebsocketServer(@reflector, @port)
    @websocketServer.listen()

    # Set an interval to send world state out to clients
    @reflector.startTicking()

new Server(_.last(process.argv), 8080)