/**
 * Physics is a scene plugin that manipulates objects in the scene using the
 * Cannon.JS physics engine.
 */

var CANNON = require('cannon');
var MutationObserver = require('../lib/mutation_observer');
var Euler = require('../forks/euler');
var Vector = require('../forks/vector');

/**
 * Convert another vector class to a Cannon vector
 */
function cannonVec (vec) {
  return new CANNON.Vec3(vec.x, vec.y, vec.z);
}

function vrVec (vec) {
  return new Vector(vec.x, vec.y, vec.z);
}

function Physics (scene) {
  this.scene = scene;
  this.interval = null;
  this.world = null;

  this.addMutationObserver();
}

Physics.prototype.addMutationObserver = function () {
  var self = this;

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function (node) {
          self.onAppendChild(node);
        });
      } 
    });    
  });

  observer.observe(this.scene);
}

Physics.prototype.start = function () {
  var $p = this;

  // Create world
  this.world = new CANNON.World();
  this.world.gravity.set(0, -9.82, 0); // m/s²
  this.world.broadphase = new CANNON.NaiveBroadphase();

  // Add a ground plane
  // @todo Make the ground plane a part of the scene graph
  var groundShape = new CANNON.Plane();

  var groundBody = new CANNON.Body({
    mass: 0,
    shape: groundShape
  });
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  this.world.add(groundBody);

  // Load all other existing nodes
  this.scene.childNodes.forEach(function (node) {
    $p.buildNode(node);
  });

  // Start the world loop
  var lastTime = null;
  var world = this.world;

  var frameRate = 50.0; // fps
  var fixedTimeStep = 1.0 / frameRate; // seconds
  var maxSubSteps = 3;

  function loop() {
    var time = new Date().valueOf();

    if (lastTime !== null) {
      var dt = (time - lastTime) / 1000;
      lastTime = time;

      world.step(fixedTimeStep, dt, maxSubSteps);
      world.bodies.forEach(function (body) {
        if (body.updateScene) body.updateScene();
      });

      // This measures actual framerate; was 5-10 on Sam's rMBP, which is concerning
      // console.log(dt*1000);

    } else {
      lastTime = time;
    }
  }

  this.interval = setInterval(loop, fixedTimeStep*1000);
};

/**
 * Stop the physics engine.
 * Returns true on success, false if it was already stopped
 */
Physics.prototype.stop = function () {
  if (this.interval) {
    clearInterval(this.interval);
    this.interval = null;
    return true;
  } else {
    return false;
  }
};

/**
 * Add the given scene node to the physics engine
 */
Physics.prototype.buildNode = function (el) {
    // @todo not everything is a box
  switch (el.nodeName) {
  case 'billboard':
  case 'box':
    var body = new CANNON.Body({
      mass: 5, // kg
      position: cannonVec(el.position),
      shape: new CANNON.Box(cannonVec(el.scale.clone().multiplyScalar(0.5)))
    });
    this.world.addBody(body);

    // To do: replace this with a DOM Mutation Observer
    el.setX = function(x) {
      el.position.x = body.position.x = x;
    };
    el.setY = function(y) {
      el.position.y = body.position.y = y;
    };
    el.setZ = function(z) {
      el.position.z = body.position.z = z;
    };

    body.updateScene = function () {
      if(body.sleepState !== CANNON.Body.SLEEPING) {
        var r = new Euler();
        r.setFromQuaternion(body.quaternion);
        // LOLHACKS
        r.distanceToSquared = Vector.prototype.distanceToSquared;
        var v = vrVec(body.position);

        if(v.distanceToSquared(el.position) > 0.01) el.position = v;
        if(r.distanceToSquared(el.rotation) > 0.01) el.rotation = r;
      }
    };

    break;
  }
};

/**
 * Respond to appendChild mutation events from the scene
 */
Physics.prototype.onAppendChild = function (el) {
  this.buildNode(el);
};

module.exports = Physics;
