var htmlparser = require('htmlparser2');
var dom = require('dom-lite');
var HTMLElement = dom.HTMLElement;

module.exports = function (xml) {
  var addChildren = function (root, nodes) {
    nodes.forEach(function (node) {
      var el = new HTMLElement(node.name.toLowerCase());
      var key;

      for (key in node.attribs) {
        el.setAttribute(key, node.attribs[key]);
      }

      root.appendChild(el);
    });
  };

  var el = null;

  var parser = new htmlparser.Parser(new htmlparser.DomHandler(function (err, nodes) {
    if (err) {
      throw err;
    }

    nodes.forEach(function (node) {
      el = new HTMLElement(node.name.toLowerCase());
      addChildren(el, node.children);
    });
  }), { xmlMode: true });
  parser.write(xml);
  parser.end();

  return el;
};
