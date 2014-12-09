fs = require('fs')
_ = require("underscore")
vm = require('vm')

dom = require("../lib/dom-lite")
Element = require("../lib/node")
Document = require("../lib/document")

Vector = require("../lib/vector")
Euler = require("../lib/euler")

Scene = dom.HTMLElement

# fixme - these are added to all instances of htmlelement, not just the Scene
_.extend Scene.prototype, {
  stop: ->
    @clearTimeouts()
    @childNodes = []

  clearTimeouts: ->
    null
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

  timeouts = []
  intervals = []

  document.scene.clearTimeouts = ->
    for timeout in timeouts
      clearTimeout(timeout)

    for interval in intervals
      clearInterval(interval)

    timeouts = []
    intervals = []

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
      script.runInNewContext { 
        document : document
        Vector : Vector
        Euler : Euler

        setInterval : (func, timeout) ->
          handle = setInterval( ->
            try
              func()
            catch e
              console.log "[server] #{filename}:\n  #{e.toString()}"
              clearInterval(handle)
          , timeout)

          intervals.push(handle)
          handle

        setTimeout : (func, timeout) ->
          handle = setTimeout( ->
            try
              func()
            catch e
              console.log "[server] #{filename}:\n  #{e.toString()}"
          , timeout)

          timeouts.push(handle)
          handle

        console : console
      }
    catch e
      console.log "[server] #{filename}"
      console.log "  " + e.stack.split("\n").slice(0,2).join("\n  ")

  document.dispatchEvent("ready")

  callback(document.scene)

module.exports = Scene