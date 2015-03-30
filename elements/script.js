// fixme - make a wrapper for htmlelement, because this reads weird...

var util = require('util');
var HTMLElement = require('../lib/dom-lite').HTMLElement;
var Script;

function Script () {
  HTMLElement.call(this, 'script');
}

util.inherits(Script, HTMLElement);

module.exports = Script;
