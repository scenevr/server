domimpl = require('xmldom').DOMImplementation

module.exports = {
  GUID : ->
    Math.floor(Math.random() * 0xEFFF + 0x1000).toString(16)

  createDocument: ->
    domimpl.prototype.createDocument()

  createElement: (nodeName) ->
    @createDocument().createElement(nodeName)
}
