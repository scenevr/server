var util = require('util');
var SpatialElement = require('./spatial-element');
var Model;

function Model () {
  SpatialElement.call(this, 'model');
}

util.inherits(Model, SpatialElement);

Model.prototype.reflect = true;

module.exports = Model;
