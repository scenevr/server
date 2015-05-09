var util = require('util');
var SpatialElement = require('./spatial-element');
var Plane;

function Plane () {
  SpatialElement.call(this, 'plane');
}

util.inherits(Plane, SpatialElement);

Plane.prototype.reflect = true;

module.exports = Plane;
