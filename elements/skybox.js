var util = require('util');
var Element = require('./element');
var Skybox;

function Skybox () {
  Element.call(this, 'skybox');
}

util.inherits(Skybox, Element);

Skybox.prototype.reflect = true;

module.exports = Skybox;
