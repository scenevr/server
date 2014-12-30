---
title: Box
primary_navigation: true
---

# Box

A box is a simple cube. It inherits from [Element](/element.html).

## Sample XML

```xml
<box id="cubey" position="1 2 3" scale="1 1 1" style="color: #f07" />
```

## Screenshot

<img src="/images/box.png" class="screenshot" />

## Styles

### color

The color of the box. Can be set using hexadecimal code or color names. For example to set every box to be red, use the following code.

```javascript
document.getElementsByTagName("box").forEach(function(box){
    box.style.color = '#ff0000';
});
```