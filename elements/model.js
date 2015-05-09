var util = require('util');
var SpatialElement = require('./spatialElement');
var Model;

function Model () {
  SpatialElement.call(this, 'model');
}

util.inherits(Model, SpatialElement);

Model.prototype.reflect = true;

module.exports = Model;
