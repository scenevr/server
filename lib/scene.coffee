utils = require('./utils')

class Scene
  constructor: ->
    @childNodes = []

  removeChild: (node) ->
    @childNodes = _.reject(@childNodes, node)
    
  appendChild: (element) ->
    @childNodes.push(element)
    element.markAsDirty()

  markAllClean: ->
    for element in @childNodes
      element.dirty = false

  markAllDirty: ->
    for element in @childNodes
      element.markAsDirty()

  elementsVisibleTo: (observer) ->
    # todo
    @childNodes

  startTicking: ->
    setInterval(@tick, 1000 / 10)

  tick: =>
    for element in @childNodes when element.hasScript()
      element.getScript().eval('tick')

module.exports = Scene