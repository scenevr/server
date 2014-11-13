---
title: Vector
primary_navigation: true
---

# Vector

The vector class is used to represent a position in 3 dimensional space. Sceneserver uses the same coordinate space as Three.js - so treats x as left to right, y as down to up, and z as near to far.

The vector class is the same as the Three.js Vector3 class. [See their docs](http://threejs.org/docs/#Reference/Math/Vector3) for all the available methods. We extended the `THREE.Vector3` so that we can detect changes to properties on the vector.

To create a new Vector:

    box.position = new Vector(1,2,3);

You can act on Vector components directly:

    box.position.x += 10.5;

When setting a vector attribute on an element, we clone the vector. This means if you work on your original copy the changes will be ignored. eg this won't work:

    v = new Vector(1,2,3)
    box.position = v;
    v.x += 10.5;

Instead do this:

    v = new Vector(1,2,3)
    box.position = v;
    box.position.x += 10.5;
