---
title: New Homeroom
date: 2015-02-28
tags: homeroom
layout: post
---

I released a new homeroom today. It is a gallery with several tall thin windows looking to the east, and corridors off to the three wings, the alien room (all hail our alien overlord), the reddit gallery room (make sure you click the portals to visit the galleries) and a room that is currently empty but will become a link to scenes that people submit to [/r/scenevr](//reddit.com/r/scenevr).

<img src="/images/blog/homeroom.png" class="screenshot" />

The scene was modelled originally in Sketchup (taking care to make sure the faces are facing the right way and deleting bits of geometry that you can't see from inside the scene). It was then exported to blender where I set up lighting, merged all the geometry together, and then baked the lights.

Because SceneVR doesn't support mesh collision at the moment, I had to create a seperate collision model for the homeroom.

```xml
<!--  Gallery model with collision disabled -->
<model src="/models/home.obj" position="0 0.01 0" style="collision: none; color: #555; light-map: url(/textures/home-lightmap.jpg)"/>
```

I did this by placing about 30 boxes around the walls and corridors. I then use our blender export script which outputs a bunch of invisible boxes that are used only for collision:

```xml
<!--  Collision  -->
<box position="0.16626548767089844 -1.505699634552002 -0.6487710475921631" scale="80.0 2.0 200.0" rotation="0.0 0.0 0.0" style="color: #f0a; visibility: hidden;"/>
<box position="-3.6149256229400635 6.710185527801514 1.4967803955078125" scale="2.0 19.231510162353516 2.0" rotation="0.0 0.0 0.0" style="color: #f0a; visibility: hidden;"/>
<box position="5.27642822265625 6.710185527801514 1.4967803955078125" scale="2.0 19.231510162353516 2.0" rotation="0.0 0.0 0.0" style="color: #f0a; visibility: hidden;"/>
```

The rest of the elements were then placed manually around the scene, as well as an elevator and some sliding panels that hide links to reddit galleries. The galleries are auto-generated using the script in [scene-scripts](https://github.com/bnolan/scene-scripts).

The new homeroom has been posted a few places around the internet, so there have been people joining the room every few minutes all day - it's been great chatting with you all!