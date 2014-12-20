var Element, Skybox,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Element = require("../lib/element");

Skybox = (function(_super) {
  __extends(Skybox, _super);

  function Skybox() {
    Skybox.__super__.constructor.call(this, "skybox");
  }

  Skybox.prototype.reflect = true;

  return Skybox;

})(Element);

module.exports = Skybox;
