var util = require('util');
var Element = require("../lib/element");
var Skybox;

function Skybox() {
  Element.call(this, 'skybox');
}

util.inherits(Skybox, Element);

Skybox.prototype.reflect = true;

module.exports = Skybox;
