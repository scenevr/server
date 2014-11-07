fs = require('fs')
dom = require("dom-lite")

Element = require("./node")
document = require("./document")

Scene = dom.HTMLElement

Scene.prototype.addEventListener = (event, callback) ->
  callback()
  
Scene.load = (filename, callback) ->
  doc = new Element "document"
  doc.innerXML = fs.readFileSync(filename).toString()

  # Fixme - find the <scene /> node
  scene = doc.lastChild

  for script in scene.getElementsByTagName("script")
    # lol
    eval(script.textContent)

  callback(scene)

module.exports = Scene