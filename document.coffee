dom = require("dom-lite")
UUID = require("uuid")

Script = require("./elements/script")
Box = require("./elements/box")

document = dom.document
HTMLElement = dom.HTMLElement

document.createElement = (tag) ->
  if tag == "script"
    node = new Script
  else if tag == "box"
    node = new Box
  else
    node = new HTMLElement(tag)
  
  # Fixme - use less bits
  node.uuid = UUID.v4()
  node.ownerDocument = this
  this.nodeMap[node.uuid] = node

  node

document.nodeMap = {}

module.exports = document