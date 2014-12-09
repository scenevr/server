dom = require("../lib/dom-lite")
UUID = require("uuid")

Script = require("../elements/script")
Box = require("../elements/box")
Spawn = require("../elements/spawn")
Player = require("../elements/player")
Billboard = require("../elements/billboard")
Model = require("../elements/model")
Link = require("../elements/link")
Skybox = require("../elements/skybox")
Audio = require("../elements/audio")

Document = dom.Document
HTMLElement = dom.HTMLElement

Document.prototype.markAsDead = (uuid) ->
  @deadNodes[uuid] = (new Date).valueOf()
  delete @nodeMap[uuid]

Document.prototype.getElementByUUID = (uuid) ->
  @nodeMap[uuid]

Document.prototype.createElement = (tag) ->
  if tag == "script"
    node = new Script
  else if tag == "box"
    node = new Box
  else if tag == "player"
    node = new Player
  else if tag == "billboard"
    node = new Billboard
  else if tag == "link"
    node = new Link
  else if tag == "model"
    node = new Model
  else if tag == "spawn"
    node = new Spawn
  else if tag == "skybox"
    node = new Skybox
  else if tag == "audio"
    node = new Audio
  else
    node = new HTMLElement(tag)
  
  if node.reflect
    node.uuid = UUID.v4()
    @nodeMap[node.uuid] = node

  node.ownerDocument = this
  node.eventTargets = {}

  node

# Gross. Need to split dom-lite out into a bunch of stuff, and port all this to javascript
Document.createDocument = ->
  d = new Document
  d.deadNodes = {}
  d.nodeMap = {}
  d

module.exports = Document