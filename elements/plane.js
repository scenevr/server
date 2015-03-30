var util = require('util');
var Element = require('../lib/element');
var Plane;

function Plane() {
  Element.call(this, 'plane');
}

util.inherits(Plane, Element);

Plane.prototype.reflect = true;

module.exports = Plane;
