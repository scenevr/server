---
title: Roadmap
primary_navigation: false
position: 3
---

# Roadmap

Subject to change. This is the current plan for scenevr.

### Authentication

Create an authentication service so players can claim their names and servers can trust they are the player they say.

### Avatar customisation

Allow users to set girth, height and color of avatars. Make a visual face configuration tool for choosing a face. Render a face on the avatars.

### Friend list

Keep a list of your friends, be able to message them in game (voice message or text chat), and teleport to their location.

### Unity client

Investigate porting the web client to unity (c#), and measure the performance advantages. This is particularly with a goal to having a highly performant mobile client. Investigate opensource licenses that can be used with Unity projects and plugins. Find out how to render to texture for each platform (for the billboards).

### Gear VR

Try using the chrome webview, or the unity client, to create a gear vr + bluetooth controller mobile interface for SceneVR.

### Google Cardboard

Use the hmd polyfill to support google cardboard. Investigate navigation techniques that will work with the one bit 'magnet' input system. Probably look at the ground and click to teleport.

### WebRTC audio

Use web rtc audio with positional webaudio to create push-to-talk voice chat in the browser.

### Physics on the server

Use bullet physics on the server, with a fallback to cannon.js, add physical attributes to elements so they can be simulated on the server.

### \<group /\> element

Create a group element for nesting transforms, allows things like:

```xml
<group position="1 2 3">
  <box />
</box>
```

### Break server into smaller modules

As per the npm philosophy, break the server into several smaller modules, so that people can re use the scenegraph/dom code for other purposes and projects.

### Hosting

Create a hosting server that allows people to easily serve SceneVR scenes. Have some error handling (or provide integration with raygun.io) for reporting errors that occur in the scene.

### Persistence

Investigate and expose a persistence method for scenes, something like localStorage, or webSQL. Possibly use redis for this?

### Blender exporter

Take the existing blender export code and make it work well, generating entire scene files with collision meshes and seperate .obj objects, keeps existing blender object names and converts them into `id` attribute.

### Support convexpolyhedra collision meshes

Create a model format for representing polyhedra as collision meshes (possibly create hulls around .obj models), to allow collision models that aren't cube.

### Add \<sphere /\> element

Allow spheres, potentially with `subdivision` count as an attribute.

### Add \<light /\> element

Allow point lights and ambient light to be set as an element.

## Performance

SceneVR is written in pure javascript at the moment, with a few node.js binary modules on platforms that support them. The client, server and scripts are all written in javascript. Earlier in the lifecycle of SceneVR, I wrote a server in c++, that embedded v8. And I have also worked on various native viewers for the SceneVR protocol. As the project progresses, there is no reason that parts of the client or server cannot be replaced by close-to-the-metal components, with a native fallback for cases where ultra-performance isn't required.

For example, cannon.js can be augmented with bullet. The websocket protocol can be augmented by raknet. The dom-lite implementation could be augmented with the dom implmenetation in webkit or firefox. The client can be rewritten in unity, unreal, jmonkeyengine or ogre. Some of these libraries already have node.js bindings, others would need new bindings written, but with node-gyp, it's relatively straightforward to create bindings to existing libraries. It would even be possible to write the entire server in c++, embedding v8, although this would prevent people extending their scenes with custom node modules.

In summary, there is a long path ahead for optimisations to SceneVR, but we won't be taking any steps until we are forced to by performance bottlenecks.

In the words of [Donald Knuth](http://c2.com/cgi/wiki?PrematureOptimization):

 "Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: **premature optimization is the root of all evil**. Yet we should not pass up our opportunities in that critical 3%."