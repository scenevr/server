Element = require("../lib/element")

# Todo - parse the linked sound resource, and keep track of what time the
# audio track is at, so that we can sync up clients, and people can make
# audio-synced visualizations.

class Audio extends Element
  constructor: ->
    super "audio"

  reflect: true

module.exports = Audio