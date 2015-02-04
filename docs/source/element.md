---
title: Element
primary_navigation: true
---

# Element

An Element is the base class for 3d objects in the scene. You can't instantiate an element directly, instead use `document.createElement(tagName)`. Element inherits from node. Elements can be nested inside each other, but none of the current primitives support that.

## Markup

```xml
<box id="cubey" position="1 2 3" rotation="1.570 0 0" />
```

## Attributes

### id

The id of this element. You can find this element by id later on.

### position

A [vector](/vector.html) that describes the position of the center of this element.

```javascript
var cube = document.getElementById("cubey");
console.log(cube.position.y) 
> 2
cube.position.set(10,20,30)
console.log(cube.position.z) 
> 30
cube.position = cube.position.normalize()
console.log(cube.position.x) 
> 0.3333333333
```

### rotation

A [euler](/euler.html) that describes the rotation of the element. Rotations are expressed in radians. Rotation are in x,y,z order. That means that the element is first rotated around x, then the rotated around the rotated axes in the y direction, then z. The [wikipedia article](http://en.wikipedia.org/wiki/Euler_angles) has some more (impenetrable) information.

#### Quaternions

The client uses quaternions to represent rotations internally, but we send eulers over the wire, since they are easier to understand for the normal person. 

If you want to lerp (interpolate) between two rotations, you should keep track of the start rotation and rotation as quaternions, and then interpolate, and assign the result to the elements rotation.

#### Scripting

```javascript
var cube = document.getElementById("cubey");

// Rotate the cube 45°
console.log(cube.rotation.y += 0.785);

// Get a quaternion version of this rotation
var q = new Quaternion().setFromEuler(cube.rotation);

// Assign the rotation back
cube.rotation.setFromQuaternion(q);
```

#### Degrees to radians table

360° = 2*PI Radians. Or use this handy table. You can use negative radians to rotate in the other direction.

 Degrees | Radians 
---------|---------
0° | 0
45° | 0.785
90° | 1.570
180° | 3.141
270° | 4.712

## Events

### click

Fired when the user clicks on an element. May be triggerd by a click, a touch, or pressing a trigger on a gamepad, but it always maps to a click event. Will never fire on elements that have their style set as `visibility:hidden`. The event object that is passed in contains a key `player` which represents the player that clicked.

```javascript
document.getElementById("cubey").addEventListener("click", function(e){
    console.log("Player with uuid " + e.player.uuid + " clicked on cubey");
});
```

### collide

Fired when the user collides with an element. Collide events are only sent when a user touches a new element, or jumps in the air and touches an element again. Walking across an element will not trigger multiple collide events. If an elements physical attributes changes (rotation, scale, position, geometry), the collide event may be re-triggered for this element. Collide events are throttled so that moving elements can't cause 60 collision events per second sent to the server. Will never fire on elements that have their style set as `collision:none`. The event object that is passed in contains a key `player` and a key `normal` that is the vector of the collision normal, in the direction of the player to the element that it collided with.

```javascript
document.getElementById("cubey").addEventListener("click", function(e){
    console.log("Respawning the player because they touched cubey");
    e.player.respawn("you touched cubey");
});
```

## Methods

Most of the normal dom level 2 methods should be available.

### Inherited from Node

- nodeName
- parentNode
- ownerDocument
- childNodes
- textContent
- firstChild
- lastChild
- previousSibling
- nextSibling
- innerXML() - Read Only
- hasChildNodes()
- appendChild()
- insertBefore()
- removeChild()
- replaceChild()
- cloneNode()

### On Element
- attributes
- nodeType
- tagName
- style
- className
- hasAttribute()
- getAttribute()
- setAttribute()
- removeAttribute()
- getElementById()
- getElementsByTagName()

### addEventListener(event, listener)

Add an event listener for the named event.

### removeEventListener(event, listener)

Removes the event listeners for the named event.

