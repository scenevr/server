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

  Element.prototype.markAsDirty = function(){
    if(this.ownerDocument){
      this.ownerDocument.markAsDirty(this);
    }
  }

  // By default elements do reflect to the client
  Element.prototype.reflect = true;

  return Element;

})(dom.HTMLElement);

function createVector(element, x, y, z){
  var v = new Vector(x, y, z);
  v._element = element;
  return v;
}

function createEuler(element, x, y, z){
  var e = new Euler(x, y, z);
  e._element = element;
  return e;
}

Object.defineProperties(Element.prototype, {
  uuid: {
    get: function() {
      return this._uuid;
    },
    set: function(value) {
      this._uuid = value.toString();
    }
  },
  position: {
    get: function() {
      return this._position || (this._position = createVector(this, 0, 0, 0));
    },
    set: function(value) {
      var v;

      if (value instanceof Vector) {

        this._position = createVector(this).copy(value);

      } else if (typeof value === "string") {

        v = createVector(this).fromArray(value.split(' ').map(parseFloat));

        if (isFinite(v.length())) {
          this._position = v;
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
      return this._scale || (this._scale = createVector(this, 1, 1, 1));
    },
    set: function(value) {
      var v;

      if (value instanceof Vector) {

        this._scale = createVector(this).copy(value);

      } else if (typeof value === "string") {

        v = createVector(this).fromArray(value.split(' ').map(parseFloat));

        if (isFinite(v.length())) {
          this._scale = v;

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
      return this._rotation || (this._rotation = createEuler(this, 0, 0, 0));
    },
    set: function(value) {
      var v;
      
      if (value instanceof Euler) {

        this._rotation = createEuler(this).copy(value).clamp();

      } else if (typeof value === "string") {

        v = createEuler(this).fromArray(value.split(' ').map(parseFloat));

        if (isFinite(v.x) && isFinite(v.y) && isFinite(v.z)) {
          this._rotation = v.clamp();
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
