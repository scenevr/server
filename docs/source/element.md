---
title: Element
primary_navigation: true
---

# Element

An Element is the base class for 3d objects in the scene. You can't instantiate an element directly, instead use `document.createElement(tagName)`. Element inherits from node. Elements can be nested inside each other, but none of the current primitives support that.

# Sample XML

    <box id="cubey" position="1 2 3" />

# Attributes

## id

The id of this element. You can find this element by id later on.

## position

A [vector](/vector.html) that describes the position of the center of this element.

    var cube = document.getElementById("cubey");
    console.log(cube.position.y) 
    > 2
    cube.position.set(10,20,30)
    console.log(cube.position.z) 
    > 30
    cube.position = cube.position.normalize()
    console.log(cube.position.x) 
    > 0.3333333333

# Methods

Most of the normal dom level 2 methods should be available.

## Inherited from Node

- nodeName
- parentNode
- ownerDocument
- childNodes
- textContent
- firstChild
- lastChild
- previousSibling
- nextSibling
- innerXML() - Read Only
- hasChildNodes()
- appendChild()
- insertBefore()
- removeChild()
- replaceChild()
- cloneNode()

## On Element
- attributes
- nodeType
- tagName
- style
- className
- hasAttribute()
- getAttribute()
- setAttribute()
- removeAttribute()
- getElementById()
- getElementsByTagName()
