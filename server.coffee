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
    @webServer.use(express.static("./scenes/"))
    @webServerHandle = @webServer.listen(8090)

    @restart = _.throttle(@restartServer, 1000)

    @scenes = []

    ["/lightmap.xml", "/index.xml"].forEach (filename) =>
      Scene.load "./scenes" + filename, (scene) => 
        @onLoaded(scene, filename)
        fs.watch "./scenes/" + filename, @restart

  onLoaded: (scene, filename) =>
    console.log "[server] Loaded '#{filename}'"

    # The reflector handles sending updates to the scene to observers
    reflector = new Reflector(scene, filename)

    @websocketServer.reflectors[filename] = reflector

    # Set an interval to send world state out to clients
    reflector.startTicking()


  # Stop the server and restart it
  restartServer: =>
    console.log "[server] Restarting server on file change."

    for filename, reflector of @websocketServer.reflectors
      reflector.sendAll('<event name="restart" />')
      reflector.stop()
      reflector.scene.stop()
      delete reflector.scene

    # Gross
    setTimeout( => 
      Scene.load(@filename, @onLoaded)
    , 250)

new Server(_.last(process.argv), 8080)