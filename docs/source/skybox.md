---
title: Skybox
primary_navigation: true
---

# Skybox

A skybox is a box that is very large and placed around the scene as a background. It can have a plain color, a gradient, or a 6 sided image mapped to it.

## Sample XML

```xml
<skybox style="color: linear-gradient(#fff, #99f);" />
```

## Screenshot

<img src="/images/skybox.png" class="screenshot" />

## Attributes

### src

Use the src attribute to specify a 6-sided image for the skybox. SceneVR will automatically insert the prefixes back, front, left, right, top and bottom to your image url. For example the following markup:

```xml
<skybox src='/skyboxes/clouds_.jpg' />
```

Will cause scenevr to look for these images:

```
/skyboxes/clouds_top.jpg
/skyboxes/clouds_bottom.jpg
/skyboxes/clouds_left.jpg
/skyboxes/clouds_right.jpg
/skyboxes/clouds_front.jpg
/skyboxes/clouds_back.jpg
```

If any of the images is missing, the entire skybox may fail to render.

## Styles

### color

The color of the skybox. You can use `linear-gradient` to set a gradient (the start color is at the horizon, and the end color at the zenith of the sky. Otherwise you can just use a hexidecimal color.

