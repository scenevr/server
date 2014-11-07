


/*
* @version    0.1.7
* @date       2014-11-02
* @stability  2 - Unstable
* @author     Lauri Rooden <lauri@rooden.ee>
* @license    MIT License
*/

var hasOwn = Object.prototype.hasOwnProperty

function extend(obj, _super, extras) {
	obj.prototype = Object.create(_super.prototype)
	for (var key in extras) {
		obj.prototype[key] = extras[key]
	}
	obj.prototype.constructor = obj
}

function StyleMap(style) {
	var self = this
	if (style) style.split(/\s*;\s*/g).map(function(val) {
		val = val.split(/\s*:\s*/)
		if(val[1]) self[val[0]] = val[1]
	})
}

StyleMap.prototype.valueOf = function() {
	var self = this
	return Object.keys(self).map(function(key) {
		return key + ": " + self[key]
	}).join("; ")
}

function Node(){}

function getSibling(node, step) {
	var silbings = node.parentNode && node.parentNode.childNodes
	, index = silbings && silbings.indexOf(node)

	return silbings && index > -1 && silbings[ index + step ] || null
}

Node.prototype = {
	nodeName:        null,
	parentNode:      null,
	ownerDocument:   null,
	childNodes:      null,
	get nodeValue() {
		return this.nodeType === 3 || this.nodeType === 8 ? this.data : null
	},
	set nodeValue(text) {
		return this.nodeType === 3 || this.nodeType === 8 ? (this.data = text) : null
	},
	get textContent() {
		return this.hasChildNodes() ? this.childNodes.map(function(child) {
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
		return this.childNodes && this.childNodes[ this.childNodes.length - 1 ] || null
	},
	get previousSibling() {
		return getSibling(this, -1)
	},
	get nextSibling() {
		return getSibling(this, 1)
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
		, node = new self.constructor(self.tagName || self.data)
		node.ownerDocument = self.ownerDocument

		if (self.hasAttribute) {
			for (key in self) if (self.hasAttribute(key)) node[key] = self[key].valueOf()
		}

		if (deep && self.hasChildNodes()) {
			self.childNodes.forEach(function(child){
				node.appendChild(child.cloneNode(deep))
			})
		}
		return node
	},
	toString: function() {
		return this.hasChildNodes() ? this.childNodes.reduce(function (memo, node) {
			return memo + node
		}, "") : ""
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
Attribute.prototype.toString = function() {
	return this.name + '="' + this.value.replace(/&/g, "&amp;").replace(/"/g, "&quot;") + '"'
}

function HTMLElement(tag) {
	var self = this
	self.nodeName = self.tagName = tag.toUpperCase()
	self.localName = tag.toLowerCase()
	self.childNodes = []
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

extend(HTMLElement, Node, {
	namespaceURI: "http://www.w3.org/1999/xhtml",
	nodeType: 1,
	localName: null,
	tagName: null,
	styleMap: null,
	hasAttribute: function(name) {
		// HACK
		return name == "style" && !!this.style.valueOf() ||
			hasOwn.call(this, name) && this[name] !== "" && !(name in HTMLElement.prototype)
	},
	getAttribute: function(name) {
		return this.hasAttribute(name) ? "" + this[name] : null
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
	getElementsByTagName: function(tag) {
		var el, els = [], next = this.firstChild
		tag = tag === "*" ? 1 : tag.toUpperCase()
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
		var attrs = this.attributes.join(" ")
		return "<" + this.localName + (attrs ? " " + attrs : "") + ">"
			+ (voidElements[this.tagName] ? "" : this.innerHTML + "</" + this.localName + ">" )
	}
})

Object.defineProperty(HTMLElement.prototype, "attributes", {
	get: function() {
		var key
		, attrs = []
		, self = this
		for (key in self) if (self.hasAttribute(key)) attrs.push(new Attribute(self, key))
		return attrs
	}
})

function ElementNS(namespace, tag) {
	var self = this
	self.namespaceURI = namespace
	self.nodeName = self.tagName = self.localName = tag
	self.childNodes = []
}

ElementNS.prototype = HTMLElement.prototype

function Text(data) {
	this.data = data
}

extend(Text, Node, {
	nodeType: 3,
	nodeName: "#text",
	toString: function() {
		return ("" + this.data).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
	}
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

function own(Element) {
	return function($1, $2) {
		var node = new Element($1, $2)
		node.ownerDocument = this
		return node
	}
}

function body(getter) {
	return function(value) {
		return this.body[getter](value)
	}
}

extend(Document, Node, {
	nodeType: 9,
	nodeName: "#document",
	createElement: own(HTMLElement),
	createElementNS: own(ElementNS),
	createTextNode: own(Text),
	createComment: own(Comment),
	createDocumentFragment: own(DocumentFragment),
	getElementById: body("getElementById"),
	getElementsByTagName: body("getElementsByTagName"),
	querySelector: body("querySelector"),
	querySelectorAll: body("querySelectorAll")
})

module.exports = {
	document: new Document,
	Document: Document,
	HTMLElement: HTMLElement
}

