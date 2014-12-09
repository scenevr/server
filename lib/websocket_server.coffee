Observer = require './observer'

WSServer = require('websocket').server
WSFrame  = require('websocket').frame
WSRouter = require('websocket').router
HTTP = require("http")
MAX_CLIENTS = 8

debug = (message) ->
  console.log (new Date()) + " " + message

class WebsocketServer
  constructor: (reflector, @port) ->
    # ...
    @reflectors = {}
    @clients = []

  addClient: (client) ->
    @clients.push(client)

  removeClient: (client) ->
    if @clients.indexOf(client) >= 0
      @clients.splice(@clients.indexOf(client), 1)

  clientsAheadOf: (client) ->
    index = @clients.indexOf(client)

    if index < MAX_CLIENTS
      -1
    else
      index - MAX_CLIENTS

  clearReflectors: ->
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

    setInterval @queueInterval, 1000

  queueInterval: =>
    index = 0

    for client in @clients
      if index < MAX_CLIENTS and !client.observer
        @serveConnection(client)

      if index >= MAX_CLIENTS
        client.send "<packet><queue limit='#{MAX_CLIENTS}' position='#{index - MAX_CLIENTS}' /></packet>"

      index++

  onRequest: (request) =>
    console.log "[server] new request from #{request.remoteAddress}"

    try
      # todo - check request.origin maybe?
      connection = request.accept("scenevr", request.origin)
    catch 
      # doesnt want scenevr - drop the client
      connection.close()
      return

    connection.request = request

    @addClient(connection)

    connection.on "close", (reasonCode, description) =>
      console.log "[server] Peer " + connection.remoteAddress + " disconnected."
      @removeClient(connection)

    if @clientsAheadOf(connection) >= 0
      @queueConnection(connection)
    else
      @serveConnection(connection)

  queueConnection: (connection) ->
    # Do nothing.. queueInterval calls serveConnection once you get far enough up the queue

  serveConnection: (connection) ->
    reflector = @reflectors[connection.request.resource]

    if !reflector
      console.log "[server] 404 scene not found '#{connection.request.resource}'"
      connection.request.reject()
      return

    console.log "[server] client requested '#{connection.request.resource}'"
    
    connection.observer = new Observer(connection, reflector)
    reflector.addObserver(connection.observer)

    connection.on "message", (message) =>
      if message.type is "utf8"
        connection.observer.recieveMessage(message.utf8Data)

    connection.on "close", (reasonCode, description) =>
      reflector.removeObserver(connection.observer)

module.exports = WebsocketServer