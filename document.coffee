dom = require("dom-lite")

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
  
  node.ownerDocument = this

  node

module.exports = document