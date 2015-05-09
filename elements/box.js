var util = require('util');
var SpatialElement = require('./spatial-element');
var Box;

function Box () {
  SpatialElement.call(this, 'box');
}

util.inherits(Box, SpatialElement);

Box.prototype.reflect = true;

module.exports = Box;
