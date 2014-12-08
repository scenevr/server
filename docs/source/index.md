---
title: Home
primary_navigation: false
---

# SceneVR

With SceneVR you can build multiuser 3d scenes using html-like tags and javascript. SceneVR scenes are viewed using a browser-powered viewer (powered by webGL). Chrome, firefox and IE are supported. The server is powered by node.js and runs on Windows, Mac OS and Linux.

Server: [github.com/bnolan/scenevr](http://github.com/bnolan/scenevr)

Web client: [github.com/bnolan/scenevr-web](http://github.com/bnolan/scenevr-web)

<iframe width="730" height="440" src="//www.youtube.com/embed/xEE0PXy8Xfk?rel=0" frameborder="0" allowfullscreen></iframe>

# Features

## Multi-user

Your SceneVR scene is multi-user from the get go. Just share the URL to your scene and your friends can join you. Each user is represented by a peg-man character. When a user interacts with the scene (by clicking a button for example), everyone sees the change that happens to the scene. You can use this to write **multi-user games** using just xml and javascript.

## Javascript API

Script your scene with a **simple javascript API** that is modelled on the DOM. The javascript code is run on the server, and changes are reflected to all connected clients. You can change element attributes, create elements, remove elements.

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

## Mobile device support

Your scenes work in modern webGL-enabled browsers like the ios 8 browser. Just turn your phone sideways, and use the two thumb joysticks to walk and look around the scene.

## Portals

When you click a link to the next scene, a portal opens and shows you the next scene. Just walk through the portal to visit the next scene.
