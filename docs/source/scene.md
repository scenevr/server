# Scene

Scenes are the base class describing a scene. They is a combination of the `document` object and the `<html />` tag. All elements go directly in the scene element. Changes to the scene are instantly reflected out to all connected clients. The scene is available to scripts as the `scene` global.

# Methods

## addChild(Node)

Adds a node to the scene. 

## removeChild(node)

Removes a node from the scene. The node will be removed from the scene, and from all connected clients.

## addEventListener(event, listener)

Add an event listener for the named event.

## removeEventListener(event)

Removes all event listeners for the named event.

## createElement(nodeName)

Create an element for adding to the scene. 

## getElementById(id)

Fetch an element by id. Note that elements also a `uuid`, but this is used internally to reflect changes to the client and shouldn't be referred to in scripts.

## querySelectorAll(selector)

Get all emlements matching the selector. Tag names, ids and class names are supported.