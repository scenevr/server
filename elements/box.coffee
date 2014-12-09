Color = require("color")
Element = require("../lib/element")

# fixme *properly*
Color.prototype.toString = ->
  @hexString()

class Box extends Element
  constructor: ->
    super "box"

  reflect: true

Object.defineProperties Box.prototype, {
  color : {
    get: -> @_color
    set: (value) -> @_color = Color(value)
  }
}

module.exports = Box