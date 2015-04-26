var util = require('util');
var Node = require('../lib/node');
var Euler = require('../lib/euler');
var Vector = require('../lib/vector');

/**
 * Element represents any node in the scene graph, and provides support for client<->server synchronisation
 * of scene graph data, including the uuid property
 */
function Element () {
  Node.apply(this, arguments);
  var _propertyChangeObserverList = [];

  /**
   * Add a callback to be called when the given property is chagned.
   * The observer will perform deep-inspection of vector and euler properties
   */
  this.addPropertyChangeObserver = function (propName, callback) {
    if (!_propertyChangeObserverList[propName]) {
      _propertyChangeObserverList[propName] = [];
    }
    _propertyChangeObserverList[propName].push(callback);
  };

  /**
   * Helper function to trigger observer callbacks for a change to the given propName
   */
  this._triggerPropertyChange = function (propName) {
    var value = this[propName];
    if (_propertyChangeObserverList[propName]) {
      _propertyChangeObserverList[propName].forEach(function (callback) {
        callback(value);
      });
    }
  };
}

util.inherits(Element, Node);

/**
 * Return a get/set pair to manage a vector parameter
 * attrName: The name of the property (e.g. 'velocity')
 * defaultValue: A 3-element array representing the default value (e.g. [0, 0, 0])
 */
Element.createVectorProperty = function (attrName, defaultValue) {
  var privateProperty = '_' + attrName;
  return {
    get: function () {
      if (!this[privateProperty]) {
        this[privateProperty] = new Vector(defaultValue[0], defaultValue[1], defaultValue[2]);

        // Add change observer for deep change inspection
        var self = this;
        this[privateProperty].addChangeObserver(function () {
          self.markAsDirty();
          self._triggerPropertyChange(attrName);
        });
      }
      return this[privateProperty];
    },
    set: function (value) {
      var v;

      if (value instanceof Vector) {
        this[privateProperty] = new Vector().copy(value);
      } else if (typeof value === 'string') {
        v = new Vector().fromArray(value.split(' ').map(parseFloat));

        if (isFinite(v.length())) {
          this[privateProperty] = v;
        } else {
          throw new Error('Invalid ' + attrName + ' argument');
        }
      } else {
        throw new Error('Invalid ' + attrName + ' argument');
      }

      // Add change observer for deep change inspection
      var self = this;
      this[privateProperty].addChangeObserver(function () {
        self.markAsDirty();
        self._triggerPropertyChange(attrName);
      });

      // Trigger change observers
      this._triggerPropertyChange(attrName);
    }
  };
};

/**
 * Return a get/set pair to manage a euler parameter
 * attrName: The name of the property (e.g. 'velocity')
 * defaultValue: A 3-element array representing the default value (e.g. [0, 0, 0])
 */
Element.createEulerProperty = function (attrName, defaultValue) {
  var privateProperty = '_' + attrName;
  return {
    get: function () {
      if (!this[privateProperty]) {
        this[privateProperty] = new Euler(defaultValue[0], defaultValue[1], defaultValue[2]);

        // Add change observer for deep change inspection
        var self = this;
        this[privateProperty].addChangeObserver(function () {
          self.markAsDirty();
          self._triggerPropertyChange(attrName);
        });
      }
      return this[privateProperty];
    },
    set: function (value) {
      var v;

      if (value instanceof Euler) {
        this[privateProperty] = new Euler().copy(value);
      } else if (typeof value === 'string') {
        v = new Euler().fromArray(value.split(' ').map(parseFloat));

        if (isFinite(v.x) && isFinite(v.y) && isFinite(v.z)) {
          this[privateProperty] = v;
        } else {
          throw new Error('Invalid ' + attrName + ' argument');
        }
      } else {
        throw new Error('Invalid ' + attrName + ' argument');
      }

      // Add change observer for deep change inspection
      var self = this;
      this[privateProperty].addChangeObserver(function () {
        self.markAsDirty();
        self._triggerPropertyChange(attrName);
      });

      // Trigger change observers
      this._triggerPropertyChange(attrName);
    }
  };
};

/**
 * Return a get/set pair to manage a scalar parameter
 * attrName: The name of the property (e.g. 'mass')
 * defaultValue: A float representing the default value
 */
Element.createScalarProperty = function (attrName, defaultValue) {
  var privateProperty = '_' + attrName;
  return {
    get: function () {
      return this[privateProperty] || (this[privateProperty] = defaultValue);
    },
    set: function (value) {
      var v;

      if (typeof value === 'number') {
        this[privateProperty] = value;
      } else if (typeof value === 'string') {
        v = parseFloat(value);

        if (!isNaN(v)) {
          this[privateProperty] = v;
        } else {
          throw new Error('Invalid ' + attrName + ' argument');
        }
      } else {
        throw new Error('Invalid ' + attrName + ' argument');
      }

      // Trigger change observers
      this._triggerPropertyChange(attrName);
    }
  };
};

/**
 * Return a get/set pair to manage a string parameter
 * attrName: The name of the property (e.g. 'material')
 * defaultValue: A string representing the default value
 */
Element.createStringProperty = function (attrName, defaultValue) {
  var privateProperty = '_' + attrName;
  return {
    get: function () {
      return this[privateProperty] || (this[privateProperty] = defaultValue);
    },
    set: function (value) {
      if (typeof value === 'string') {
        this[privateProperty] = value;
      } else {
        throw new Error('Invalid ' + attrName + ' argument');
      }

      // Trigger change observers
      this._triggerPropertyChange(attrName);
    }
  };
};

Element.prototype.removeChild = function () {};

Element.prototype.getReflector = function () {
  return this.ownerDocument.reflector;
};

Object.defineProperties(Element.prototype, {
  uuid: {
    get: function () {
      return this._uuid;
    },
    set: function (value) {
      this._uuid = value.toString();
    }
  }
});

module.exports = Element;
