Element = require("../lib/element")

class Skybox extends Element
  constructor: ->
    super "skybox"

  reflect: true

module.exports = Skybox