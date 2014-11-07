htmlparser = require('htmlparser2')

dom = require("./vendor/dom-lite")
document = require("./document")
Node = dom.Node

Script = require("./elements/script")

addChildren = (root, nodes) ->
  for node in nodes
    # console.log node.type, node.name
    if node.type == 'text'
      el = document.createTextNode(node.data)
    else if node.type == 'comment'
      el = document.createComment(node.data)
    else if node.type == 'tag' || node.type == "script"
      el = document.createElement(node.name.toLowerCase())

      for key,value of node.attribs
        el.setAttribute(key, value)

      addChildren(el, node.children)
    else if node == 'directive'
      el = new Directive(nodes[i].data)
    else
      continue

    root.appendChild el

Object.defineProperty Node.prototype, 'innerXML', {
  get: ->
    Node.prototype.toString.call(this)

  set: (xml) ->
    parser = new htmlparser.Parser(new htmlparser.DomHandler( (err, nodes) =>
      if err
        throw err
  
      @childNodes = []
      addChildren(this, nodes)
    ), { xmlMode : true })
    parser.write(xml)
    parser.end()
}

module.exports = Node