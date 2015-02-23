---
title: Script
primary_navigation: true
---

# Script

An inline, or externally referenced javascript block. These blocks are executed after the dom has been loaded. 

## Notes

Even though the script block is evaluated on the server, by a node.js process, it is run in a sandbox, so you cannot access many of the node.js built ins. When scripting with SceneVR, you should refer only to documented attributes and methods of the elements. It may be possible to escape out of the sandbox, but use of SceneVR internals is not supported, and your scenes may break in future versions. Note that the node.js sandboxing doesn't prevent you from creating infinite loops. If you create an infinite loop, your server will grind to a halt.

Due to limitations in the way we parse the scenes at the moment, you may not get a correct line number when an error is reported. This will be improved in future versions.

All scripts run in the same context.

## Sample XML

```xml
<script src="scripts/chess.js"></script>

<script>
    var game = new Chess;
    console.log(game.gameOver());
</script>
```

NB: If you are embedding html in strings in your javascript, or using < and >, you need to wrap your script inside a cdata.

```
<script>
  <![CDATA[
    console.log("This is some <b>html</b>");
  ]]>
</script>
```

## Attributes

### src

If specified, the script will be synchronously loaded from an external file and evaluated. Scripts must be local, you cannot reference files over http.

## Global scope

The following members are in the global scope. See [scene.js](https://github.com/bnolan/scenevr/blob/master/elements/scene.js) for an up to date list of members exported to the global scope.

### document

The document object representing this scene. Access `document.scene` for the root level scene element.

### Vector

The [vector](/vector.html) class, derived from the three.js vector class.

### Euler

The euler class, derived from the three.js euler class, for rotations.

### XMLHttpRequest

The [XMLHTTPRequest](http://www.w3.org/TR/XMLHttpRequest/) class, an implementation of the w3c spec. It has no cross-domain restrictions.

### console

A minimal console, only has `console.log`. Logs as a chat message to connected clients, as well as to the server console.

### setTimeout

A proxied setTimeout that catches errors in user code without bringing down the server.

### setInterval

A proxied setInterval that catches errors in user code without bringing down the server.
