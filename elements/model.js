var util = require('util');
var Element = require('../lib/element');
var Model;

function Model () {
  Element.call(this, 'model');
}

util.inherits(Model, Element);

Model.prototype.reflect = true;

module.exports = Model;
