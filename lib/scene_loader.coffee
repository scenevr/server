dom = require('xmldom').DOMParser
xpath = require('xpath')
fs = require('fs')
THREE = require('three')

utils = require './utils'
Scene = require './scene'

# Kind of elements we can load
Element = require './element'
Box = require './elements/box'

class SceneLoader
  constructor: ->
    @scene = new Scene

  load: (filename) ->
    @doc = new dom().parseFromString(fs.readFileSync(filename).toString())

    if xpath.select("/scene", @doc) == null
      throw "Root element <scene /> not found"

    for domNode in xpath.select("/scene/*", @doc)
      node = Element.loadFromDom(domNode)
      @scene.appendChild(node)

    @scene

module.exports = SceneLoader