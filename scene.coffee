fs = require('fs')

dom = require("dom-lite")
Element = require("./node")
Scene = dom.HTMLElement

Scene.load = (filename, callback) ->
  scene = new Scene "document"
  scene.innerXML = fs.readFileSync(filename).toString()

  # Fixme - find the <scene /> node
  callback(scene.lastChild)

module.exports = Scene