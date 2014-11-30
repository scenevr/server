fs = require('fs')
_ = require("underscore")
vm = require('vm')

dom = require("./vendor/dom-lite")
Element = require("./node")
Document = require("./document")

Scene = dom.HTMLElement

# fixme - these are added to all instances of htmlelement, not just the Scene
_.extend Scene.prototype, {
  stop: ->
    # todo - kill any running scripts (use domains?)
    @childNodes = []
}

Scene.load = (filename, callback) ->
  document = Document.createDocument()

  parsedScene = new Element "null"
  parsedScene.ownerDocument = document
  
  if filename.match(/</)
    parsedScene.innerXML = filename
  else
    parsedScene.innerXML = fs.readFileSync(filename).toString()

  for node in parsedScene.childNodes
    if node.nodeName == 'scene'
      document.scene = node

  if !document.scene
    console.log "[server] Couldn't find a <scene /> element in #{filename}"
    return

  # Fixme - this all requires lots of work and thought (do we run in a sandboxed content?) -
  # we should also wrap setTimeout and setInterval calls so that broken code doesn't bring
  # down the server.
  for scriptElement in document.getElementsByTagName("script")
    script = null

    try
      script = vm.createScript(scriptElement.textContent, filename)
    catch e
      console.log "[server] #{filename}:\n  #{e.toString()}"
      continue

    try
      script.runInThisContext()
    catch e
      console.log "[server] #{filename}"
      console.log "  " + e.stack.split("\n").slice(0,2).join("\n  ")

  document.scene.dispatchEvent("ready")

  callback(document.scene)

module.exports = Scene