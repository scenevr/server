var htmlparser = require('htmlparser2')
  , dom = require('dom-lite')

var document = dom.document

document.ELEMENT_NODE = 1
document.TEXT_NODE = 3
document.COMMENT_NODE = 8
document.DOCUMENT_NODE = 9
document.DOCUMENT_TYPE_NODE = 10
document.DOCUMENT_FRAGMENT_NODE = 11

var el_proto = Object.getPrototypeOf(document.createElement('p'))
  , node_proto = Object.getPrototypeOf(el_proto)
  , doc_proto = Object.getPrototypeOf(document)

var Node = dom.Node

Object.defineProperty(node_proto, 'innerXML', {
    get: get_html
  , set: set_html
})

var el_to_string = el_proto.toString

doc_proto.createElementNS = createElementNS

function get_html() {
  return node_proto.toString.call(this)
}

function set_html(html) {
  var parser = new htmlparser.Parser(new htmlparser.DomHandler(parsed))
    , self = this

  parser.write(html)
  parser.end()

  function parsed(err, nodes) {
    if(err) {
      throw err
    }

    self.childNodes = []
    add_children(self, nodes)
  }
}

function add_children(root, nodes) {
  var attrs
    , el

  for(var i = 0, l = nodes.length; i < l; ++i) {
    if(nodes[i].type === 'text') {
      el = document.createTextNode(nodes[i].data)
    } else if(nodes[i].type === 'comment') {
      el = document.createComment(nodes[i].data)
    } else if(nodes[i].type === 'tag') {
      el = document.createElement(nodes[i].name.toLowerCase())
      attrs = Object.keys(nodes[i].attribs)

      for(var j = 0, l2 = attrs.length; j < l2; ++j) {
        el.setAttribute(attrs[j], nodes[i].attribs[attrs[j]])
      }

      add_children(el, nodes[i].children)
    } else if(nodes[i].type === 'directive') {
      el = new Directive(nodes[i].data)
    } else {
      continue
    }

    root.appendChild(el)
  }
}

function createElementNS(ns, tag) {
  return this.createElement(tag)
}

function Directive(data) {
  this.data = data
}

Directive.prototype = Object.create(node_proto)
Directive.prototype.toString = function() {
  return '<' + this.data + '>'
}

Node.prototype.removeChild = function(el){
  var self = this
  , index = self.childNodes.indexOf(el)
  if (index == -1) throw new Error("NOT_FOUND_ERR")

  self.childNodes.splice(index, 1)
  el.parentNode = null
  return el
}

module.exports = {
  Element : Element,
  Node : Node,
  Scene : document
}