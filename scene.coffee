fs = require('fs')
_ = require("underscore")

dom = require("./vendor/dom-lite")
Element = require("./node")
document = require("./document")

Scene = dom.HTMLElement

# fixme - these are added to all instances of htmlelement, not just the Scene
_.extend Scene.prototype, {
  addEventListener: (event, callback) ->
    (@eventTargets[event] ||= []).push callback

  removeEventListener: (event) ->
    @eventTargets[event] = for e in (@eventTargets[event] || []) when event != e
      e

  dispatchEvent: (event) ->
    if @eventTargets[event]
      for handler in @eventTargets[event]
        handler()

  createElement: (tag) ->
    document.createElement tag
}

Scene.load = (filename, callback) ->
  doc = new Element "document"
  doc.innerXML = fs.readFileSync(filename).toString()

  # Fixme - find the <scene /> node
  scene = doc.lastChild

  for script in scene.getElementsByTagName("script")
    # lol
    eval(script.textContent)

  scene.dispatchEvent("ready")

  callback(scene)

module.exports = Scene