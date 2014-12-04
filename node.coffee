htmlparser = require('htmlparser2')

dom = require("./vendor/dom-lite")
Node = dom.Node

Script = require("./elements/script")
HTMLElement = dom.HTMLElement

Object.defineProperty Node.prototype, 'innerXML', {
  get: ->
    Node.prototype.toString.call(this)

  set: (xml) ->
    self = this

    addChildren = (root, nodes) ->
      for node in nodes
        # console.log node.type, node.data

        if node.type == 'text'
          el = self.ownerDocument.createTextNode(node.data)
        else if node.type == 'cdata'
          el = self.ownerDocument.createCDataNode(node.children[0].data)
        else if node.type == 'comment'
          el = self.ownerDocument.createComment(node.data)
        else if node.type == 'tag' || node.type == "script"
          el = self.ownerDocument.createElement(node.name.toLowerCase())

          for key,value of node.attribs
            el.setAttribute(key, value)

          addChildren(el, node.children)
        else if node == 'directive'
          el = new Directive(nodes[i].data)
        else
          continue

        root.appendChild el

    parser = new htmlparser.Parser(new htmlparser.DomHandler( (err, nodes) =>
      if err
        throw err
  
      @childNodes = []
      addChildren(this, nodes)
    ), { xmlMode : true })
    parser.write(xml)
    parser.end()
}

# Parser for recieving messages from connected clients
Node.packetParser = (xml) ->
  addChildren = (root, nodes) ->
    for node in nodes
      _el = new HTMLElement(node.name.toLowerCase())
      for key,value of node.attribs
        _el.setAttribute(key, value)
      root.appendChild _el

  el = null

  parser = new htmlparser.Parser(new htmlparser.DomHandler( (err, nodes) =>
    if err
      throw err

    for node in nodes
      el = new HTMLElement(node.name.toLowerCase())
      addChildren(el, node.children)
  ), { xmlMode : true })

  parser.write(xml)
  parser.end()

  el

module.exports = Node