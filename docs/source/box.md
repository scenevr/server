---
title: Box
primary_navigation: true
---

# Box

A box is a simple cube. It inherits from [Element](/element.html).

# Sample XML

    <box id="cubey" position="1 2 3" color="#f70" />

# Attributes

## color

The color of the box. Can be set using hexadecimal code. When accessed programatically, the color is an instance of the [Color](/color.html) class.

    scene.getElementsByTagName("box").forEach(function(box){
        box.color = new Color(255,0,0);
    });