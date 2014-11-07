Color = require("color")

Element = require("../element")
# HTMLElement = require("dom-lite").HTMLElement

class Box extends Element
  constructor: ->
    super "box"

  things: ->
    "blah"

Object.defineProperties Box.prototype, {
  color : {
    get: -> @_color
    set: (value) -> @_color = Color(value)
  }
}

# Script = ->
#   return new HTMLElement "script"
#
#   stuff: ->
#     "things"

module.exports = Box