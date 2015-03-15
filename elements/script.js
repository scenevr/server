var
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

var HTMLElement = require("../lib/dom-lite").HTMLElement;

var Script;

__extends(Script, HTMLElement);

function Script() {
  Script.__super__.constructor.call(this, "script");
}

module.exports = Script;
