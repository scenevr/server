var Document, Element, Euler, Scene, Vector, dom, fs, vm, _;

fs = require('fs');

_ = require("underscore");

vm = require('vm');

dom = require("../lib/dom-lite");

Element = require("../lib/node");

Document = require("../lib/document");

Vector = require("../lib/vector");

Euler = require("../lib/euler");

// jjg - xhr support
XMLHttpRequest = require('xhr2');

Scene = dom.HTMLElement;

// fixme - these are added to all instances of htmlelement, not just the Scene

_.extend(Scene.prototype, {
  stop: function() {
    this.clearTimeouts();
    return this.childNodes = [];
  },
  clearTimeouts: function() {
    return null;
  }
});

Scene.prototype.ticksPerSecond = 5;

Scene.prototype.start = function(reflector){
  var document = this.ownerDocument;

  var timeouts = [];
  var intervals = [];

  this.clearTimeouts = function() {
    var interval, timeout, _j, _k, _len1, _len2;
    for (_j = 0, _len1 = timeouts.length; _j < _len1; _j++) {
      timeout = timeouts[_j];
      clearTimeout(timeout);
    }
    for (_k = 0, _len2 = intervals.length; _k < _len2; _k++) {
      interval = intervals[_k];
      clearInterval(interval);
    }
    timeouts = [];
    return intervals = [];
  };

  // Fixme - this all requires lots of work and thought (do we run in a sandboxed content?) -
  // we should also wrap setTimeout and setInterval calls so that broken code doesn't bring
  // down the server.

  var self = this;

  document.getElementsByTagName("script").map(function(scriptElement){
    var script = null,
      code = null;

    if(scriptElement.innerXML.match(/<!\[CDATA\[/)){
      code = scriptElement.innerXML.replace(/^[\n\r\s]+<!\[CDATA\[/, '').replace(/\]\]>[\n\r\s]+$/,'');
    }else{
      code = scriptElement.textContent;
    }

    try {
      script = vm.createScript(code, document.filename);
    } catch (e) {
      console.log("[server] " + document.filename + ":\n  " + (e.toString()));
      return;
    }

    try {

      // Run a script. Wrap setInterval and setTimeout so that errors in callbacks don't
      // kill the server.

      script.runInNewContext({
        document: document,
        Vector: Vector,
        Euler: Euler,
	XMLHttpRequest: XMLHttpRequest,

        channel : {
          log : function(message){
            reflector.chatChannel.sendMessage(self, message)
          }
        },

        setInterval: function(func, timeout) {
          var handle;
          handle = setInterval(function() {
            try {
              return func();
            } catch (_error) {
              e = _error;
              console.log("[server] " + document.filename + ":\n  " + (e.toString()));
              return clearInterval(handle);
            }
          }, timeout);
          intervals.push(handle);
          return handle;
        },

        setTimeout: function(func, timeout) {
          var handle;
          handle = setTimeout(function() {
            try {
              return func();
            } catch (_error) {
              e = _error;
              return console.log("[server] " + document.filename + ":\n  " + (e.toString()));
            }
          }, timeout);
          timeouts.push(handle);
          return handle;
        },
        console: console
      });
    } catch (_error) {
      e = _error;
      console.log("[server] " + document.filename);
      console.log("  " + e.stack.split("\n").slice(0, 2).join("\n  "));
    }
  });

  try{
    document.dispatchEvent("ready");
  }catch(e){
    console.log("[server] " + document.filename);
    console.log("  " + e.stack.split("\n").slice(0, 2).join("\n  "));
  }
}

Scene.load = function(filename, callback) {
  var document, e, intervals, node, parsedScene, script, scriptElement, timeouts, _i, _j, _len, _len1, _ref, _ref1;

  document = Document.createDocument();
  
  parsedScene = new Element("null");
  parsedScene.ownerDocument = document;

  if (filename.match(/</)) {
    parsedScene.innerXML = filename;
  } else {
    parsedScene.innerXML = fs.readFileSync(filename).toString();
  }

  _ref = parsedScene.childNodes;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    node = _ref[_i];
    if (node.nodeName === 'scene') {
      document.scene = node;
    }
  }

  if (!document.scene) {
    console.log("[server] Couldn't find a <scene /> element in " + filename);
    return;
  }

  document.filename = filename;

  callback(document.scene);
};

module.exports = Scene;
