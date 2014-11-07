utils = require('./utils')
THREE = require('three')
dom = require('xmldom').DOMParser
xpath = require('xpath')
Node = require("./node")

attributeToVector = (element, attributeName) ->
  [x,y,z] = element.getAttribute(attributeName).split(' ').map(parseFloat)
  new THREE.Vector3 x,y,z

attributeToEuler = (element, attributeName) ->
  [x,y,z] = element.getAttribute(attributeName).split(' ').map(parseFloat)
  new THREE.Euler x,y,z


# Base clas for any visible element in the scene
class Element extends Node
  constructor: (@uuid) ->
    @position = new THREE.Vector3
    @rotation = new THREE.Euler
    @scale = new THREE.Vector3 1, 1, 1
    @name = null
    @dirty = true
    super()

  hasScript: ->
    @getScript() instanceof Script

  getScript: ->
    for id, node of @childNodes when node instanceof Script
      return node

  remove: ->
    @scene.removeChild(this)

  markAsDirty: ->
    @dirty = true

  markAsClean: ->
    @dirty = false

  isDirty: ->
    @dirty

  setPosition: (p) ->
    throw "Invalid class" unless p instanceof THREE.Vector3
    @position = p
    @markAsDirty()

  setRotation: (r) ->
    throw "Invalid class" unless r instanceof THREE.Euler
    @rotation = r
    @markAsDirty()

  toXml: ->
    unless @nodeName
      throw "Tried to call #toXml on an instance of Node"

    unless @id
      throw "Tried to call #toXml with a null id"

    el = utils.createElement(@nodeName)

    el.setAttribute "id", @id
    el.setAttribute "position", [@position.x, @position.y, @position.z].join " "
    el.setAttribute "rotation", [@rotation.x, @rotation.y, @rotation.z].join " "
    el.setAttribute "scale", [@scale.x, @scale.y, @scale.z].join " "

    # optional params
    el.setAttribute "name", @name if @name
    el.setAttribute "src", @src if @src

    el

  @loadFromXml: (xml) ->
    doc = new dom().parseFromString(xml.toString())
    @loadFromDom(xpath.select("/*", doc)[0])

  @loadFromDom: (domElement) ->
    id = utils.GUID()

    node = switch domElement.nodeName.toLowerCase()
      when 'box' then new Box id
      when 'model' then new Model id
      else
        throw "Invalid domElement <#{domElement.nodeName} /> in <scene />"
    
    node.position = attributeToVector(domElement, 'position')
    node.rotation = attributeToEuler(domElement, 'rotation')
    node.scale = attributeToVector(domElement, 'scale')

    if domElement.getAttribute 'src'
      node.src = domElement.getAttribute('src')

    # maybe todo - replace with a proper xmlparser, instead of manually looking for elements
    for childdomElement in xpath.select("script", domElement)
      if childdomElement.nodeName != "script"
        throw "Invalid domElement <#{childdomElement.nodeName} /> in <node.nodeName />"
      childNode = new Script utils.GUID()
      childNode.setScript(childdomElement.textContent)
      node.appendChild(childNode)

    node

module.exports = Element

Box = require './elements/box'
Model = require './elements/model'
Script = require './elements/script'