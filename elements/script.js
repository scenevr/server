// fixme - make a wrapper for htmlelement, because this reads weird...

var util = require('util');
var Node = require('../lib/node');
var Script;

function Script () {
  Node.call(this, 'script');
}

util.inherits(Script, Node);

module.exports = Script;
