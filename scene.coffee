fs = require('fs')
_ = require("underscore")

dom = require("./vendor/dom-lite")
Element = require("./node")
document = require("./document")

Scene = dom.HTMLElement

Scene.eventTargets = {}

_.extend Scene.prototype, {
  addEventListener: (event, callback) ->
    (Scene.eventTargets[event] ||= []).push callback

  removeEventListener: (event) ->
    Scene.eventTargets[event] = for e in (Scene.eventTargets[event] || []) when event != e
      e

  dispatchEvent: (event) ->
    for handler in Scene.eventTargets[event]
      handler()

  close: ->
    console.log "Terminating scene server due to scene#close"
    process.exit()
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