---
title: Model
primary_navigation: true
---

# Model

A 3d model loaded from an external model file. It inherits from [Element](/element.html). Currently only wavefront .obj files are supported.

## Notes

Models should be correctly world sized (1 unit = 1 metre), using the OpenGL coordinate system, and centered at the origin. Models that are not centered at the origin will not have their bounding boxes correctly calculated for collision purposes.

## Sample XML

```xml
<model 
  position="1 2 3" 
  src="/models/spongebob.obj" 
  style="texture-map: url(/models/spongebob.png)" />
```

## Screenshot

<img src="/images/model.png" class="screenshot" />

## Attributes

### src

The src of the model. The src should be an absolute path, that is relative to the root directory of the scene server.

## Styles

### light-map

Note that the current obj loader ignores settings in the mtl file, but this may be fixed in future versions. Textures should be in .png or .jpg format.

Use a value of `url(something.png)` to specify the lightmap for this model. Currently lightmaps and texturemaps are orthogonal. Lightmaps are not affected by light sources in the world, they will just use the color present in the lightmap.

### texture-map

Use a value of `url(something.png)` to specify the texturemap for this model. Texturemaps are lambertian shaded. If your texturemap doesnt seem to be shaded according to the lights in your scene, make sure you checked 'export normals' when saving your .obj file from your modelling program.