var Element, Link,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Element = require("../lib/element");

Link = (function(_super) {
  __extends(Link, _super);

  function Link() {
    Link.__super__.constructor.call(this, "link");
  }

  Link.prototype.reflect = true;

  return Link;

})(Element);

module.exports = Link;
