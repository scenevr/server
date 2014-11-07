
Reflector = require './lib/reflector'
SceneLoader = require './lib/scene_loader'
WebsocketServer = require './lib/websocket_server'

class Server
  constructor: (filename, port) ->
    # Load the scene from the supplied filename
    @scene = new SceneLoader().load(filename)

    # The reflector handles sending updates to the scene to observers
    @reflector = new Reflector(@scene)

    # Handles connections and messages from the websocket
    @websocketServer = new WebsocketServer(@reflector, port)
    @websocketServer.listen()

    # Set an interval to send world state out to clients
    @reflector.startTicking()

    # Run scripts inside the scene..
    @scene.startTicking()

new Server("scenes/hello.xml", 8080)