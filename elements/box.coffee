Color = require("color")
Element = require("../element")

class Box extends Element
  constructor: ->
    super "box"

  reflect: true

  things: ->
    "blah"

Object.defineProperties Box.prototype, {
  color : {
    get: -> @_color
    set: (value) -> @_color = Color(value)
  }
}

module.exports = Box