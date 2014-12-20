var Element, Model,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Element = require("../lib/element");

Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    Model.__super__.constructor.call(this, "model");
  }

  Model.prototype.reflect = true;

  return Model;

})(Element);

module.exports = Model;
