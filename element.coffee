UUID = require("uuid")
dom = require("./vendor/dom-lite")
Vector = require("./vector")
Euler = require("./euler")

class Element extends dom.HTMLElement
  removeChild: ->
    
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
  scale : {
    get: -> @_scale ||= new Vector(1,1,1)

    set: (value) ->
      if value instanceof Vector
        @_scale = value.clone()
      else if typeof value == "string"
        v = (new Vector).fromArray(value.split(' ').map(parseFloat))

        if isFinite(v.length())
          @_scale = v
        else
          throw "Invalid argument"
      else
        throw "Invalid argument"

      # @_scale.onChanged = =>
      #   @onChanged()
      # @onChanged()
  }
  rotation : {
    get: -> @_rotation ||= new Euler(0,0,0)

    set: (value) ->
      if value instanceof Euler
        @_rotation = value.clone()
      else if typeof value == "string"
        v = (new Euler).fromArray(value.split(' ').map(parseFloat))

        if isFinite(v.x) && isFinite(v.y) && isFinite(v.z)
          @_rotation = v
        else
          throw "Invalid argument"
      else
        throw "Invalid argument"

      # @_rotation.onChanged = =>
      #   @onChanged()
      # @onChanged()
  }
}

module.exports = Element