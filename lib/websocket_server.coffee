Observer = require './observer'

WSServer = require('websocket').server
WSFrame  = require('websocket').frame
WSRouter = require('websocket').router
HTTP = require("http")

debug = (message) ->
  console.log (new Date()) + " " + message

class WebsocketServer
  constructor: (@reflector, @port) ->
    # ...

  listen: ->
    @httpServer = HTTP.createServer (request, response) ->
      debug "Received request for " + request.url
      response.writeHead 404
      response.end()

    @httpServer.listen @port, =>
      debug "Server is listening on port #{@port}"

    @wsServer = new WSServer(
      httpServer : @httpServer
      autoAcceptConnections : false
    )

    @wsServer.on "request", @onRequest

  onRequest: (request) =>
    # todo - check request.origin maybe?
    connection = request.accept("scene-server", request.origin)
    
    observer = new Observer(connection, @reflector)
    @reflector.addObserver(observer)

    connection.on "message", (message) =>
      if message.type != "utf8"
        observer.recieveMessage(JSON.parse(packets))

    connection.on "close", (reasonCode, description) =>
      debug "Peer " + connection.remoteAddress + " disconnected."
      @reflector.removeObserver(observer)

module.exports = WebsocketServer