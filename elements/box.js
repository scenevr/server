var Box, Element,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Element = require("../lib/element");

Box = (function(_super) {
  __extends(Box, _super);

  function Box() {
    Box.__super__.constructor.call(this, "box");
  }

  Box.prototype.reflect = true;

  return Box;

})(Element);

module.exports = Box;
