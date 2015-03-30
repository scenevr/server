var util = require('util');
var Element = require('../lib/element');
var Link;

function Link () {
  Element.call(this, 'link');
}

util.inherits(Link, Element);

Link.prototype.reflect = true;

module.exports = Link;
