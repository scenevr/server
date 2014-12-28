/*
 * Badly hacked up to support attributes that are of other classes. Needs some refactoring. The
 * _attribute stuff in particular is really nasty. All the badness is by @bnolan.
 */

/*
* @version    0.0.14
* @date       2014-04-04
* @stability  2 - Unstable
* @author     Lauri Rooden <lauri@rooden.ee>
* @license    MIT License
*/

function extend(obj, _super, extras) {
  obj.prototype = Object.create(_super.prototype)
  for (var key in extras) {
    obj.prototype[key] = extras[key]
  }
  obj.prototype.constructor = obj
}

function hyphenatedToCamelcase(key){
  return key.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function camelcaseToHyphenated(key){
  return key.replace(/([A-Z])/g, function (g) { return '-' + g[0].toLowerCase(); });
}

function StyleMap(style) {
  var self = this
  if (style) style.split(/\s*;\s*/g).map(function(val) {
    val = val.split(/\s*:\s*/)
    if(val[1]) self[hyphenatedToCamelcase(val[0])] = val[1]
  })
}

StyleMap.prototype.valueOf = function() {
  var self = this
  return Object.keys(self).map(function(key) {
    return camelcaseToHyphenated(key) + ": " + self[key]
  }).join("; ")
}

function Node(){}

Node.prototype = {
  nodeName:        null,
  parentNode:      null,
  ownerDocument:   null,
  childNodes:      null,
  eventTargets:    null,

  addEventListener: function(event, callback){
    if(!this.eventTargets){
      this.eventTargets = {};
    }

    if(!this.eventTargets[event]){
      this.eventTargets[event] = [];
    }

    this.eventTargets[event].push(callback);
  },

  removeEventListener: function(event){
    this.eventTargets[event] = null;
  },

  dispatchEvent: function(event, arg){
    if((this.eventTargets) && (this.eventTargets[event])){
      this.eventTargets[event].forEach(function(handler){
        handler(arg);
      });
    }
  },

  get textContent() {
    return this.hasChildNodes() ? this.childNodes.map(function(child){
      return child[ child.nodeType == 3 ? "data" : "textContent" ]
    }).join("") : this.nodeType === 3 ? this.data : ""
  },
  set textContent(text) {
    if(this.nodeType === 3) return this.data = text
    for (var self = this; self.firstChild;) self.removeChild(self.firstChild)
    self.appendChild(self.ownerDocument.createTextNode(text))
  },
  get firstChild() {
    return this.childNodes && this.childNodes[0] || null
  },
  get lastChild() {
    return this.childNodes[ this.childNodes.length - 1 ] || null
  },
  get previousSibling() {
    var self = this
    , childs = self.parentNode && self.parentNode.childNodes
    , index = childs && childs.indexOf(self) || 0

    return index > 0 && childs[ index - 1 ] || null
  },
  get nextSibling() {
    var self = this
    , childs = self.parentNode && self.parentNode.childNodes
    , index = childs && childs.indexOf(self) || 0

    return childs && childs[ index + 1 ] || null
  },
  get innerHTML() {
    return Node.prototype.toString.call(this)
  },
  get outerHTML() {
    return this.toString()
  },
  get htmlFor() {
    return this["for"]
  },
  set htmlFor(value) {
    this["for"] = value
  },
  get className() {
    return this["class"] || ""
  },
  set className(value) {
    this["class"] = value
  },
  get style() {
    return this.styleMap || (this.styleMap = new StyleMap())
  },
  set style(value) {
    this.styleMap = new StyleMap(value)
  },
  hasChildNodes: function() {
    return this.childNodes && this.childNodes.length > 0
  },
  appendChild: function(el) {
    return this.insertBefore(el)
  },
  insertBefore: function(el, ref) {
    var self = this
    , childs = self.childNodes

    if (el.nodeType == 11) {
      while (el.firstChild) self.insertBefore(el.firstChild, ref)
    } else {
      if (el.parentNode) el.parentNode.removeChild(el)
      el.parentNode = self

      // If ref is null, insert el at the end of the list of children.
      childs.splice(ref ? childs.indexOf(ref) : childs.length, 0, el)
    }
    return el
  },
  removeChild: function(el) {
    var self = this
    , index = self.childNodes.indexOf(el)
    if (index == -1) throw new Error("NOT_FOUND_ERR")

    if(el.reflect){
      self.ownerDocument.markAsDead(el.uuid);
    }

    self.childNodes.splice(index, 1)
    el.parentNode = null

    return el
  },
  replaceChild: function(el, ref) {
    this.insertBefore(el, ref)
    return this.removeChild(ref)
  },
  cloneNode: function(deep) {
    var key
    , self = this
    , node = own(self.ownerDocument, new self.constructor(self.tagName || self.data))

    if (self.hasAttribute) {
      for (key in self) if (self.hasAttribute(key)) node[key] = self[key].valueOf()

    }

    if (deep && self.hasChildNodes()) {
      node.childNodes = self.childNodes.map(function(child){
        return child.cloneNode(deep)
      })
    }
    return node
  },
  toString: function() {
    if (this.hasChildNodes()){
      return this.childNodes.reduce(function (memo, node) {
        return memo + node
      }, "");
    }else if (this.nodeType == 4){
      return "<![CDATA[" + this.data + "]]>";
    }else{
      return this.data || "";
    }
  }
}


function DocumentFragment() {
  this.childNodes = []
}

extend(DocumentFragment, Node, {
  nodeType: 11,
  nodeName: "#document-fragment"
})

function Attribute(node, name) {
  this.name = name

  Object.defineProperty(this, "value", {
    get: function() {return node.getAttribute(name)},
    set: function(val) {node.setAttribute(name, val)}
  })
}

function HTMLElement(tag) {
  var self = this
  self.nodeName = self.tagName = tag.toLowerCase()
  self.childNodes = []

  Object.defineProperties(self, {
    attributes: {
      get: function() {
        var attrs = []
        , self = this
        for(key in self){
          if(self.hasAttribute(key)){
            attrs.push(key.replace(/^_/,''));
          }
        }
        return attrs.map(function(name) {return new Attribute(self, name)})
      }
    }
  })
}

var elRe = /([.#:[])([-\w]+)(?:=([-\w]+)])?]?/g

function findEl(node, sel, first) {
  var el
  , i = 0
  , out = []
  , rules = ["_"]
  , tag = sel.replace(elRe, function(_, o, s, v) {
    rules.push(
      o == "." ? "(' '+_.className+' ').indexOf(' "+s+" ')>-1" :
      o == "#" ? "_.id=='"+s+"'" :
      "_.getAttribute('"+s+"')"+(v?"=='"+v+"'":"")
    )
    return ""
  }) || "*"
  , els = node.getElementsByTagName(tag)
  , fn = Function("_", "return " + rules.join("&&"))

  for (; el = els[i++]; ) if (fn(el)) {
    if (first) return el
    out.push(el)
  }
  return first ? null : out
}

/*
* Void elements:
* http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
*/
var voidElements = {
  AREA:1, BASE:1, BR:1, COL:1, EMBED:1, HR:1, IMG:1, INPUT:1,
  KEYGEN:1, LINK:1, MENUITEM:1, META:1, PARAM:1, SOURCE:1, TRACK:1, WBR:1
}

function attributesToString(node) {
  var attrs = node.attributes.map(function(attr) {
    return attr.name + '="' + attr.value + '"'
  })

  return attrs.length ? " " + attrs.join(" ") : ""
}

extend(HTMLElement, Node, {
  nodeType: 1,
  tagName: null,
  styleMap: null,
  hasAttribute: function(name) {
    // HACK
    return name == "style" && !!this.style.valueOf() || this.hasOwnProperty(name) && !(name in HTMLElement.prototype)
  },
  getAttribute: function(name) {
    // Massive hack
    if(this["_" + name]){
      return this["_" + name].toString();
    }else{
      return this.hasAttribute(name) ? "" + this[name] : null
    }
  },
  setAttribute: function(name, value) {
    this[name] = "" + value
  },
  removeAttribute: function(name) {
    this[name] = ""
    delete this[name]
  },
  getElementById: function(id) {
    if (this.id == id) return this
    for (var el, found, i = 0; !found && (el = this.childNodes[i++]);) {
      if (el.nodeType == 1) found = el.getElementById(id)
    }
    return found || null
  },
  getElementsByName: function(name) {
    var el, els = [], next = this.firstChild;
    for (var i = 0, key = "name"; (el = next); ) {
      if (el.name === name) els[i++] = el
      next = el.firstChild || el.nextSibling
      while (!next && (el = el.parentNode)) next = el.nextSibling
    }
    return els
  },
  getElementsByTagName: function(tag) {
    var el, els = [], next = this.firstChild
    tag = tag === "*" ? 1 : tag.toLowerCase()
    for (var i = 0, key = tag === 1 ? "nodeType" : "nodeName"; (el = next); ) {
      if (el[key] === tag) els[i++] = el
      next = el.firstChild || el.nextSibling
      while (!next && (el = el.parentNode)) next = el.nextSibling
    }
    return els
  },
  querySelector: function(sel) {
    return findEl(this, sel, 1)
  },
  querySelectorAll: function(sel) {
    return findEl(this, sel)
  },
  toString: function() {
    return "<" + this.tagName + attributesToString(this) + ">"
      + (voidElements[this.tagName] ? "" : this.innerHTML + "</" + this.tagName + ">" )
  }
})


function Text(data) {
  this.data = data
}

extend(Text, Node, {
  nodeType: 3,
  nodeName: "#text"
})

function CData(data) {
  this.data = data
}

extend(CData, Node, {
  nodeType: 4,
  nodeName: "#cdata"
})

function Comment(data) {
  this.data = data
}

extend(Comment, Node, {
  nodeType: 8,
  nodeName: "#comment",
  toString: function() {
    return "<!--" + this.data + "-->"
  }
})

function Document(){
  this.body = this.createElement("body")
}

function own(self, node) {
  node.ownerDocument = self
  return node
}

extend(Document, Node, {
  nodeType: 9,
  nodeName: "#document",
  createElement: function(tag) {
    return own(this, new HTMLElement(tag))
  },
  createTextNode: function(value) {
    return own(this, new Text(value))
  },
  createCDataNode : function(value){
    return own(this, new CData(value))
  },
  createComment: function(value) {
    return own(this, new Comment(value))
  },
  createDocumentFragment: function() {
    return own(this, new DocumentFragment())
  },
  getElementById: function(id) {
    return this.scene.getElementById(id)
  },
  getElementsByTagName: function(tag) {
    return this.scene.getElementsByTagName(tag)
  },
  querySelector: function(sel) {
    return this.scene.querySelector(sel)
  },
  querySelectorAll: function(sel) {
    return this.scene.querySelectorAll(sel)
  }
})

module.exports = {
  Document: Document,
  HTMLElement: HTMLElement,
  Node: Node
}

