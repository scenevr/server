var util = require('util');
var htmlparser = require('htmlparser2');
var dom = require('./dom-lite');
var HTMLElement = dom.HTMLElement;

function Node () {
  HTMLElement.apply(this, arguments);
}

util.inherits(Node, HTMLElement);

Object.defineProperty(Node.prototype, 'innerXML', {
  get: function () {
    return Node.prototype.toString.call(this);
  },
  set: function (xml) {
    var self = this;

    var addChildren = function (root, nodes) {
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
        } else if (node.type === 'tag' || node.type === 'script') {
          el = self.ownerDocument.createElement(node.name.toLowerCase());
          _ref = node.attribs;
          for (key in _ref) {
            value = _ref[key];
            el.setAttribute(key, value);
          }
          addChildren(el, node.children);
        } else {
          continue;
        }
        _results.push(root.appendChild(el));
      }
      return _results;
    };

    var parser = new htmlparser.Parser(new htmlparser.DomHandler(function (err, nodes) {
      if (err) {
        throw err;
      }
      self.childNodes = [];
      addChildren(self, nodes);
    }), {
      xmlMode: true
    });

    parser.write(xml);
    parser.end();
  }
});

Node.packetParser = function (xml) {
  var addChildren = function (root, nodes) {
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

  var el = null;

  var parser = new htmlparser.Parser(new htmlparser.DomHandler(function (err, nodes) {
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
  }), {
    xmlMode: true
  });
  parser.write(xml);
  parser.end();

  return el;
};

module.exports = Node;
