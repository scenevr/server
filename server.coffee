_ = require 'underscore'

Reflector = require './lib/reflector'
WebsocketServer = require './lib/websocket_server'
Scene = require './scene'
IndexScene = require './lib/index_scene'
express = require 'express'
cors = require('cors')
path = require 'path'
fs = require('fs')
glob = require('glob')

class Server
  constructor: (@folder, @port) ->
    console.log "[server] Serving scenes in '#{@folder}'..."

    # Handles connections and messages from the websocket
    @websocketServer = new WebsocketServer(null, @port)
    @websocketServer.listen()

    @webServer = express()
    @webServer.use(cors())
    @webServer.use(express.static("./scenes/"))
    @webServerHandle = @webServer.listen(8090)

    @restart = _.throttle(@restartServer, 1000)

    @loadAllScenes()

  loadAllScenes: ->
    glob "#{@folder}/*.xml", {}, (er, files) =>
      indexXml = new IndexScene(files).toXml()
      Scene.load indexXml, (scene) => 
        @onLoaded(scene, '/index.xml')

      files.forEach (filename) =>
        Scene.load filename, (scene) => 
          @onLoaded(scene, '/' + path.basename(filename))
          fs.watch filename, @restart

  onLoaded: (scene, filename) =>
    console.log "[server]  * Loaded '#{filename}'"

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
      @websocketServer.clearReflectors()
      @loadAllScenes()
    , 250)

if process.argv.length == 2
  console.log "Usage: scenevr [scenedirectory]"
  process.exit()

new Server(process.argv[2], 8080)