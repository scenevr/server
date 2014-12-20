var Element, Spawn,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Element = require("../lib/element");

Spawn = (function(_super) {
  __extends(Spawn, _super);

  function Spawn() {
    Spawn.__super__.constructor.call(this, "spawn");
  }

  Spawn.prototype.reflect = true;

  return Spawn;

})(Element);

module.exports = Spawn;
