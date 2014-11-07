UUID = require("uuid")
dom = require("./vendor/dom-lite")
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

module.exports = Element