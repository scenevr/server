dom = require("dom-lite")
UUID = require("uuid")
Vector = require("./vector")

Element = dom.HTMLElement

Object.defineProperties Element.prototype, {
  uuid : {
    get: -> @_uuid
    set: (value) -> @_uuid = "" + value.toString()
  }
  position : {
    get: -> @_position ||= new Vector

    set: (value) ->
      if value instanceof Vector
        @_position = value.clone()
      else if typeof value == "string"
        v = (new Vector).fromArray(value.split(' ').map(parseFloat))

        if isFinite(v.length())
          @_position = v
        else
          throw "Invalid argument"
      else
        throw "Invalid argument"

      # @_position.onChanged = =>
      #   @onChanged()
      # @onChanged()
  }
}

module.exports = Element # dom.HTMLElement

# class Element extends Element
#   constructor: ->
#     @_uuid = UUID.v4()
#     @_position = new Vector

# Element.prototype.onChanged = ->
#   @ownerDocument.onChanged(this)

# Element.prototype.setAttribute = (name, value) ->
#   if name == 'position'
#     @_position = (new Vector).fromArray(value.split(' ').map(parseFloat))
#   else
#     @[name] = "" + value

# console.log 
#class Element extends Node
  # constructor: ->
  #   @_uuid = UUID.v4()
  #   @_position = new Vector
  #   super()
