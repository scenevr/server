---
title: Fog
primary_navigation: true
---

# Fog

The fog element controls fog that is present in the scene. 

## Notes

Fog is homogenous and extends to infinity in all directions. It is linear fog with near and far attributes. Some elements (like the skybox) are not affected by the fog and always display with full acuity. It does not make sense to have more than one fog element in a scene. If the fog element is not present, the scene will be without fog. Making the fog the same color as the horizon color of your skybox looks good.

## Sample XML

```xml
<fog style="color: #fff" near="100" far="1000" />
```

## Screenshot

<img src="/images/skybox.png" class="screenshot" />

## Attributes

### near

The distance in meters from the viewport at which fog starts to become visible.

### far

The distance in meters from the viewport at which the fog is impenetrable.

## Styles

### color

The color of the fog. You can use hexidecimal or color names.

