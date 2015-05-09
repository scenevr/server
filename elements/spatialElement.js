var util = require('util');
var Element = require('./element');
/**
 * SpatialElement represents a node the system that has a spatial presence:
 * position, rotation, scale, velocity, mass, material
 */
function SpatialElement () {
  Element.apply(this, arguments);
}

util.inherits(SpatialElement, Element);

Object.defineProperties(SpatialElement.prototype, {
  position: Element.createVectorProperty('position', [0, 0, 0]),
  scale: Element.createVectorProperty('scale', [1, 1, 1]),
  rotation: Element.createEulerProperty('rotation', [0, 0, 0])
});

module.exports = SpatialElement;
