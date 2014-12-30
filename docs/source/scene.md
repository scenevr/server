---
title: Scene
primary_navigation: true
---

# Scene

The scene is the base class describing a scene. It is equivalent to the `<html/>` tag. All elements go directly in the scene element. Changes to the scene are instantly reflected out to all connected clients. The scene is available to scripts as the `scene` global.

# Sample XML

    <scene>
      <box position="1 2 3" />
    </scene>

# Attributes

Scene has no attributes at the moment.

# Methods

Most of the dom level 2 methods should be available (we utilise [dom-lite](https://www.npmjs.org/package/dom-lite) internally), we've just picked out the most useful ones here.

## addChild(node)

Adds a node to the scene. 

### removeChild(node)

Removes a node from the scene. The node will be removed from the scene, and from all connected clients.

### createElement(nodeName)

Create an element for adding to the scene. 

### getElementById(id)

Fetch an element by id. Note that elements also a `uuid`, but this is used internally to reflect changes to the client and shouldn't be referred to in scripts.