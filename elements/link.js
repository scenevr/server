var util = require('util');
var SpatialElement = require('./spatial-element');
var Link;

function Link () {
  SpatialElement.call(this, 'link');
}

util.inherits(Link, SpatialElement);

Link.prototype.reflect = true;

module.exports = Link;
