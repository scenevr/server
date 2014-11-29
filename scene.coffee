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

  dispatchEvent: (event, arg) ->
    if @eventTargets[event]
      for handler in @eventTargets[event]
        handler(arg)

  createElement: (tag) ->
    document.createElement tag

  stop: ->
    # todo - kill any running scripts (use domains?)
    @childNodes = []
}

Scene.load = (filename, callback) ->
  doc = new Element "document"
  
  if filename.match(/</)
    doc.innerXML = filename
  else
    doc.innerXML = fs.readFileSync(filename).toString()

  for node in doc.childNodes
    if node.nodeName == 'scene'
      scene = node

  for script in scene.getElementsByTagName("script")
    # lol
    eval(script.textContent)

  scene.dispatchEvent("ready")

  callback(scene)

module.exports = Scene