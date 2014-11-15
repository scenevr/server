_ = require 'underscore'

Reflector = require './lib/reflector'
WebsocketServer = require './lib/websocket_server'
Scene = require './scene'
express = require 'express'
cors = require('cors')
path = require 'path'
fs = require('fs')

class Server
  constructor: (@filename, @port) ->
    console.log "Loading '#{@filename}'..."

    # Handles connections and messages from the websocket
    @websocketServer = new WebsocketServer(null, @port)
    @websocketServer.listen()

    @webServer = express()
    @webServer.use(cors())
    @webServer.use(express.static(path.dirname(@filename)))
    @webServerHandle = @webServer.listen(8090)

    @restart = _.throttle(@restartServer, 1000)
    Scene.load(@filename, @onLoaded)
      

  onLoaded: (scene) =>
    fs.watch @filename, @restart

    @scene = scene

    # The reflector handles sending updates to the scene to observers
    @reflector = new Reflector(@scene)

    # Set an interval to send world state out to clients
    @reflector.startTicking()

    @websocketServer.reflector = @reflector

  # Stop the server and restart it
  restartServer: =>
    console.log "[server] Restarting server on file change."

    @reflector.sendAll('<event name="restart" />')
    @reflector.stop()

    @scene.stop()
    delete @scene

    # Gross
    setTimeout( => 
      Scene.load(@filename, @onLoaded)
    , 250)

new Server(_.last(process.argv), 8080)