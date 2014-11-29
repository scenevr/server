Observer = require './observer'

WSServer = require('websocket').server
WSFrame  = require('websocket').frame
WSRouter = require('websocket').router
HTTP = require("http")

debug = (message) ->
  console.log (new Date()) + " " + message

class WebsocketServer
  constructor: (reflector, @port) ->
    # ...
    @reflectors = {}

  listen: ->
    @httpServer = HTTP.createServer (request, response) ->
      console.log  "[server] Received request for " + request.url
      response.writeHead 404
      response.end()

    @httpServer.listen @port, =>
      console.log "[server] Server is listening on port #{@port}"

    @wsServer = new WSServer(
      httpServer : @httpServer
      autoAcceptConnections : false
    )

    @wsServer.on "request", @onRequest

  onRequest: (request) =>
    # todo - check request.origin maybe?
    try
      connection = request.accept("scenevr", request.origin)
    catch 
      # doesnt want scenevr - drop the client
      return

    reflector = @reflectors[request.resource]

    if !reflector
      console.log "[server] 404 scene not found '#{request.resource}'"
      request.reject()
      return

    console.log "[server] client requested '#{request.resource}'"
    
    observer = new Observer(connection, reflector)
    reflector.addObserver(observer)

    connection.on "message", (message) =>
      if message.type is "utf8"
        observer.recieveMessage(message.utf8Data)

    connection.on "close", (reasonCode, description) =>
      console.log "[server] Peer " + connection.remoteAddress + " disconnected."
      reflector.removeObserver(observer)

module.exports = WebsocketServer