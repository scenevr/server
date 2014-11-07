# todo - use dom mutation event names on append/removeChild

class Node
  constructor: ->
    @childNodes = []
    @parentNode = null
    @nodeName = null
    @_gone = false

  markAsGone: ->
    @_gone = true
  
  isGone: ->
    @gone

  _getScene: ->
    node = this

    while node.parentNode
      node = node.parentNode

    node

  firstChild: ->
    _.first(@childNodes)

  lastChild: ->
    _.last(@childNodes)

  nodeValue: ->
    @_nodeValue
    
  ownerScene: ->
    @_getScene()

  appendChild: (node) ->
    node.parentNode = this
    @childNodes.push(node)
    @_getScene().trigger 'added', node

  removeChild: (node) ->
    node.parentNode = null
    @childNodes = _.without(@childNodes, node)
    @_getScene().trigger 'removed', node

  hasChildNodes: ->
    _.any(@childNodes)

module.exports = Node