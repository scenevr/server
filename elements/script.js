var util = require('util');
var HTMLElement = require('../lib/dom-lite').HTMLElement;
var Script;

function Script () {
  HTMLElement.call(this, 'script');
}

util.inherits(Script, HTMLElement);

module.exports = Script;
