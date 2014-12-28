var Element, Euler, UUID, Vector, dom,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

'use strict';

UUID = require("uuid");

dom = require("../lib/dom-lite");

Vector = require("../lib/vector");

Euler = require("../lib/euler");

Element = (function(_super) {
  __extends(Element, _super);

  function Element() {
    return Element.__super__.constructor.apply(this, arguments);
  }

  Element.prototype.removeChild = function() {};

  return Element;

})(dom.HTMLElement);

Object.defineProperties(Element.prototype, {
  uuid: {
    get: function() {
      return this._uuid;
    },
    set: function(value) {
      return this._uuid = "" + value.toString();
    }
  },
  position: {
    get: function() {
      return this._position || (this._position = new Vector);
    },
    set: function(value) {
      var v;
      if (value instanceof Vector) {
        return this._position = value.clone();
      } else if (typeof value === "string") {
        v = (new Vector).fromArray(value.split(' ').map(parseFloat));
        if (isFinite(v.length())) {
          return this._position = v;
        } else {
          throw "Invalid position argument";
        }
      } else {
        throw "Invalid position argument";
      }
    }
  },
  scale: {
    get: function() {
      return this._scale || (this._scale = new Vector(1, 1, 1));
    },
    set: function(value) {
      var v;
      if (value instanceof Vector) {
        return this._scale = value.clone();
      } else if (typeof value === "string") {
        v = (new Vector).fromArray(value.split(' ').map(parseFloat));
        if (isFinite(v.length())) {
          return this._scale = v;
        } else {
          throw "Invalid scale argument";
        }
      } else {
        throw "Invalid scale argument";
      }
    }
  },
  rotation: {
    get: function() {
      return this._rotation || (this._rotation = new Euler(0, 0, 0));
    },
    set: function(value) {
      var v;
      if (value instanceof Euler) {
        return this._rotation = value.clone().clamp();
      } else if (typeof value === "string") {
        v = (new Euler).fromArray(value.split(' ').map(parseFloat));
        if (isFinite(v.x) && isFinite(v.y) && isFinite(v.z)) {
          return this._rotation = v.clamp();
        } else {
          throw "Invalid rotation argument";
        }
      } else {
        throw "Invalid rotation argument";
      }
    }
  }
});

module.exports = Element;
