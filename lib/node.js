var HTMLElement, Node, dom, htmlparser;

'use strict';


htmlparser = require('htmlparser2');

dom = require("./dom-lite");

Node = dom.Node;

HTMLElement = dom.HTMLElement;

Object.defineProperty(Node.prototype, 'innerXML', {
  get: function() {
    return Node.prototype.toString.call(this);
  },
  set: function(xml) {
    var addChildren, parser, self;
    self = this;
    addChildren = function(root, nodes) {
      var el, key, node, value, _i, _len, _ref, _results;
      _results = [];
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        if (node.type === 'text') {
          el = self.ownerDocument.createTextNode(node.data);
        } else if (node.type === 'cdata') {
          el = self.ownerDocument.createCDataNode(node.children[0].data);
        } else if (node.type === 'comment') {
          el = self.ownerDocument.createComment(node.data);
        } else if (node.type === 'tag' || node.type === "script") {
          el = self.ownerDocument.createElement(node.name.toLowerCase());
          _ref = node.attribs;
          for (key in _ref) {
            value = _ref[key];
            el.setAttribute(key, value);
          }
          addChildren(el, node.children);
        } else if (node === 'directive') {
          el = new Directive(nodes[i].data);
        } else {
          continue;
        }
        _results.push(root.appendChild(el));
      }
      return _results;
    };
    parser = new htmlparser.Parser(new htmlparser.DomHandler((function(_this) {
      return function(err, nodes) {
        if (err) {
          throw err;
        }
        _this.childNodes = [];
        return addChildren(_this, nodes);
      };
    })(this)), {
      xmlMode: true
    });
    parser.write(xml);
    return parser.end();
  }
});

Node.packetParser = function(xml) {
  var addChildren, el, parser;
  addChildren = function(root, nodes) {
    var key, node, value, _el, _i, _len, _ref, _results;
    _results = [];
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      node = nodes[_i];
      _el = new HTMLElement(node.name.toLowerCase());
      _ref = node.attribs;
      for (key in _ref) {
        value = _ref[key];
        _el.setAttribute(key, value);
      }
      _results.push(root.appendChild(_el));
    }
    return _results;
  };
  el = null;
  parser = new htmlparser.Parser(new htmlparser.DomHandler((function(_this) {
    return function(err, nodes) {
      var node, _i, _len, _results;
      if (err) {
        throw err;
      }
      _results = [];
      for (_i = 0, _len = nodes.length; _i < _len; _i++) {
        node = nodes[_i];
        el = new HTMLElement(node.name.toLowerCase());
        _results.push(addChildren(el, node.children));
      }
      return _results;
    };
  })(this)), {
    xmlMode: true
  });
  parser.write(xml);
  parser.end();
  return el;
};

module.exports = Node;
