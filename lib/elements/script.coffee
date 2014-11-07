THREE = require 'three'
Node = require '../node'

class Script extends Node
  nodeName: "script"

  eval: (func) ->
    eval("(#{@content})")[func](@parentNode)

  setScript: (content) ->
    @content = content

module.exports = Script