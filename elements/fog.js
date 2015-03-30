var util = require('util');
var Element = require('../lib/element');
var Fog;

function Fog () {
  Element.call(this, 'fog');
}

util.inherits(Fog, Element);

Fog.prototype.reflect = true;

module.exports = Fog;
