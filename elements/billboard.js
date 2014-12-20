var Billboard, Element,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Element = require("../lib/element");

Billboard = (function(_super) {
  __extends(Billboard, _super);

  function Billboard() {
    Billboard.__super__.constructor.call(this, "billboard");
  }

  Billboard.prototype.reflect = true;

  return Billboard;

})(Element);

module.exports = Billboard;
