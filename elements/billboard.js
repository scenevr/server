var util = require('util');
var Element = require("../lib/element");
var Billboard;

function Billboard() {
  Element.call(this, 'billboard');
}

util.inherits(Billboard, Element);

Billboard.prototype.reflect = true;

module.exports = Billboard;
