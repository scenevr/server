dom = require("./vendor/dom-lite")
UUID = require("uuid")

Script = require("./elements/script")
Box = require("./elements/box")
Spawn = require("./elements/spawn")
Player = require("./elements/player")

document = dom.document
HTMLElement = dom.HTMLElement

document.markAsDead = (uuid) ->
  @deadNodes[uuid] = (new Date).valueOf()
  delete @nodeMap[uuid]

document.getElementByUUID = (uuid) ->
  @nodeMap[uuid]

document.createElement = (tag) ->
  if tag == "script"
    node = new Script
  else if tag == "box"
    node = new Box
  else if tag == "player"
    node = new Player
  else if tag == "spawn"
    node = new Spawn
  else
    node = new HTMLElement(tag)
  
  if node.reflect
    # Fixme - use less bits (maybe an autoincrementing counter?)
    node.uuid = UUID.v4()
    @nodeMap[node.uuid] = node

  node.ownerDocument = this
  node.eventTargets = {}

  node

document.deadNodes = {}
document.nodeMap = {}

module.exports = document