var util = require('util');
var Element = require('../lib/element');
var Box;

function Box () {
  Element.call(this, 'box');
}

util.inherits(Box, Element);

Box.prototype.reflect = true;

module.exports = Box;
