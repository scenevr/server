var Box, Color, Element,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Color = require("color");

Element = require("../lib/element");

// fixme *properly*

Color.prototype.toString = function() {
  return this.hexString();
};

Box = (function(_super) {
  __extends(Box, _super);

  function Box() {
    Box.__super__.constructor.call(this, "box");
  }

  Box.prototype.reflect = true;

  return Box;

})(Element);

Object.defineProperties(Box.prototype, {
  color: {
    get: function() {
      return this._color;
    },
    set: function(value) {
      return this._color = Color(value);
    }
  }
});

module.exports = Box;
