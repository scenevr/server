---
title: Home
primary_navigation: false
position: 1
---

# SceneVR

## Our Goal

A platform for creating virtual reality scenes using tools web developers are experienced with.

## An introduction

Create scenes using **html like markup** and css:

```xml
<scene>
  <box id="mycube" position="1 2 3" scale="1 1 1" style="color: #f07" />
</scene>
```

**Add interaction** to these scenes using **javascript**:

```javascript
document.getElementById("mycube").addEventListener("click", function(e){
  document.scene.removeChild(document.getElementById("mycube"));
});
```

Play with friends with **multiplayer support** that is automatically enabled.

```javascript
var playerCount = 0;

document.getElementById("mycube").addEventListener("click", function(e){
  playerCount++;
  console.log(e.player.name + " just clicked the cube");
  console.log(playerCount + " players have clicked the cube");
});
```

**Live edit scenes** in your favourite text editor and see changes in realtime. **Edit any file**, and when you hit save, the server will reload the changes and everyone viewing the scene will see the changes instantly. **Work collaboratively**. Make changes on your PC and share to your friends in realtime over the net.

```
$ scenevr myscenes/
[server] Serving scenes in 'myscenes/' on port 8080...
[server] Restarting server on file change.
```

**Get started in minutes**

Install node.js for your platform (Windows, Linux or Mac) and then simply use npm to install the scene server in less than a minute.

```
$ npm install -g scenevr
```


# Overview

With SceneVR you can build multiuser 3d scenes using html-like tags and javascript. SceneVR scenes are viewed using a browser-powered viewer (powered by webGL). Chrome, firefox and IE are supported. The server is powered by node.js and runs on Windows, Mac OS and Linux.

BSD Licensed.

## Try now: [client.scenevr.com](http://client.scenevr.com)

Server: [github.com/bnolan/scenevr](http://github.com/bnolan/scenevr)

Web client: [github.com/bnolan/scenevr-web](http://github.com/bnolan/scenevr-web)

<iframe width="730" height="440" src="//www.youtube.com/embed/0safeTYH_WM?rel=0" frameborder="0" allowfullscreen></iframe>

<small style="opacity: 0.5">Soundtrack from <a href="https://soundcloud.com/tvfreemusic">soundcloud.com/tvfreemusic</a></small>
# Feature comparison

SceneVR can be most closely compared to [JanusVR](//janusvr.com) and [Glam](//glamjs.org). There have been some brief discussions with glam and janus about creating a common markup, so that the three projects can interchange content between each other. To give you an idea of the features of each project:

<p class="feature-comparison" />

Feature | Glam | JanusVR | SceneVR
--------|------|---------|--------
Simple html-like markup | ✓ | ✓ | ✓
Javascript scripting support | ✓ | ✓ | ✓
Physics model | - | ✓ | ✓
Multiplayer server | - | ✓ | ✓
HTML Billboards | - | ✓ | ✓
Runs in your browser | ✓ | - | ✓
Opensource licence | ✓ | - | ✓
Mobile support | - | - | ✓
Server maintains world state | - | - | ✓

The biggest difference between Janus and SceneVR is that in Janus, the world is described in a static html file that is sent to each client, and then scripts run locally. In SceneVR, the scene file is loaded by a [node.js](//nodejs.org) server that simulates the world on the server, and all clients see the exact same world. This means you can write multiplayer games where each player interacts with the same world, which is currently not possible in Janus.

# Features

## Multi-user

Your SceneVR scene is multi-user from the get go. Just share the URL to your scene and your friends can join you. Each user is represented by a peg-man character. When a user interacts with the scene (by clicking a button for example), everyone sees the change that happens to the scene. You can use this to write **multi-user games** using just xml and javascript.

## Javascript API

Script your scene with a **simple javascript API** that is modelled on the DOM. The javascript code is run on the server, and changes are reflected to all connected clients. You can change element attributes, create elements, remove elements.

## Mobile device support

Your scenes work in modern webGL-enabled browsers like the ios 8 browser. Just turn your phone sideways, and use the two thumb joysticks to walk and look around the scene.

## Interpolation

Changes on the server are sent to the clients 5 times a second. On the frames in between, movement and rotation are interpolated, so your clients get a 60 (or 75) fps **silky smooth** experience.

## Simple markup

The markup is straightforward and easy to learn. Use style attributes for styling, linear gradients on your skybox. Rotations are expressed in euler angles as radians (so `rotation="3.14 0 0"` rotates an element 180° around the x axis.) Positions are expressed in meters so `position="0 0 10"` is 10 meters in front of you.

## .obj model support

Use the model tag (`<model src="/models/cat.obj" />`) to import obj models from your favourite modelling tool. You can also apply textures (that are normal shaded) or lightmaps (that are unlit) to your models.

## Physics simulation

We use [cannon.js](http://cannonjs.org/) so do collision detection on the client, so you can create platform games where you jump from box to box. We have a blender plugin under development to export collision models from that tool.

# Under development

SceneVR is still under heavy development, and some of these features are only available on branches of the scenevr-web client. Feel free to try them out and log issues and help contribute to development!

## Oculus Rift support

If you use a webVR browser ([firefox](http://mozvr.com/downloads.html) or [chrome](http://blog.tojicode.com/2014/07/bringing-vr-to-chrome.html)), you can use the oculus rift to experience the scenes in VR. Hit `F11` for fullscreen, and `R` to reset your viewport.

## Portals

When you click a link to the next scene, a portal opens and shows you the next scene. Just walk through the portal to visit the next scene.
