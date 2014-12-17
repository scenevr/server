Observer = require './observer'

WSServer = require("ws").Server

MAX_CLIENTS = 16

debug = (message) ->
  console.log (new Date()) + " " + message

class WebsocketServer
  constructor: (@httpServer) ->
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
    # @httpServer = HTTP.createServer (request, response) ->
    #   console.log  "[server] Received request for " + request.url
    #   response.writeHead 404
    #   response.end()

    # @httpServer.listen @port, =>
    #   console.log "[server] Server is listening on port #{@port}"

    @wsServer = new WSServer(
      server : @httpServer
    )

    @wsServer.on "connection", @onConnection

    setInterval @queueInterval, 1000

  queueInterval: =>
    index = 0

    for client in @clients
      if index < MAX_CLIENTS and !client.observer
        @serveConnection(client)

      if index >= MAX_CLIENTS
        client.send "<packet><queue limit='#{MAX_CLIENTS}' position='#{index - MAX_CLIENTS}' /></packet>"

      index++

  onConnection: (connection) =>
    console.log "[server] new request"

    @addClient(connection)

    connection.on "close", (reasonCode, description) =>
      console.log "[server] Peer disconnected."
      @removeClient(connection)

    if @clientsAheadOf(connection) >= 0
      @queueConnection(connection)
    else
      @serveConnection(connection)

  queueConnection: (connection) ->
    # Do nothing.. queueInterval calls serveConnection once you get far enough up the queue

  serveConnection: (connection) ->
    reflector = @reflectors[connection.upgradeReq.url]

    if !reflector
      console.log "[server] 404 scene not found '#{connection.upgradeReq.url}'"
      connection.request.reject()
      return

    console.log "[server] client requested '#{connection.upgradeReq.url}'"
    
    connection.observer = new Observer(connection, reflector)
    reflector.addObserver(connection.observer)

    connection.on "message", (data, flags) =>
      if !flags.binary
        connection.observer.recieveMessage(data)

    connection.on "close", (reasonCode, description) =>
      reflector.removeObserver(connection.observer)

module.exports = WebsocketServer