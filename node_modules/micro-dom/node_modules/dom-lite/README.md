[1]: https://secure.travis-ci.org/litejs/dom-lite.png
[2]: https://travis-ci.org/litejs/dom-lite
[3]: https://coveralls.io/repos/litejs/dom-lite/badge.png
[4]: https://coveralls.io/r/litejs/dom-lite
[npm package]: https://npmjs.org/package/dom-lite
[GitHub repo]: https://github.com/litejs/dom-lite


    @version    0.1.7
    @date       2014-11-02
    @stability  2 - Unstable


DOM lite &ndash; [![Build][1]][2] [![Coverage][3]][4]
========

A minimal DOM implementation


Examples
--------

```javascript
var document = require("dom-lite").document;

var el = document.createElement("h1");
el.id = 123;
el.className = "large";

var fragment = document.createDocumentFragment();
var text1 = document.createTextNode("hello");
var text2 = document.createTextNode(" world");

fragment.appendChild(text1);
fragment.appendChild(text2);
el.appendChild(fragment);

el.toString();
// <h1 id="123" class="large">hello world</h1>
el.outerHTML;
// <h1 id="123" class="large">hello world</h1>
el.innerHTML;
// hello world
```

Implemented features
--------------------

### Node

- nodeName
- nodeValue
- parentNode
- ownerDocument
- childNodes
- textContent
- firstChild
- lastChild
- previousSibling
- nextSibling
- innerHTML() - Read Only
- outerHTML() - Read Only
- hasChildNodes()
- appendChild()
- insertBefore()
- removeChild()
- replaceChild()
- cloneNode()


### DocumentFragment

Extends Node.

- nodeType


### HTMLElement

Extends Node.

- attributes
- nodeType
- localName
- tagName
- style
- className
- hasAttribute()
- getAttribute()
- setAttribute()
- removeAttribute()
- getElementById()
- getElementsByTagName()
- querySelector() - Only simple selectors
- querySelectorAll() - Only simple selectors


### Text

Extends Node.

- nodeType
- data


### Comment

Extends Node.

- nodeType
- data


### Document

Extends Node.

- nodeType
- createElement()
- createElementNS()
- createTextNode()
- createComment()
- createDocumentFragment()
- getElementById()
- getElementsByTagName()
- querySelector()
- querySelectorAll()



Coding Style Guidelines
-----------------------

-   Use tabs for indentation, align with spaces
-   Use lowerCamelCase for method and variable names
-   Use UpperCamelCase for constructor names
-   Commit files with Unix-style line endings
-   Do not use spaces in file and directory names
    Consider substituting a dash (-) where you would normally use spaces.
-   Rebase before pushing
-   Fix tests before push or pull request


External links
--------------

-   [GitHub repo][]
-   [npm package][]
-   [DOM spec](http://dom.spec.whatwg.org/)



### Licence

Copyright (c) 2014 Lauri Rooden &lt;lauri@rooden.ee&gt;  
[The MIT License](http://lauri.rooden.ee/mit-license.txt)


