var Document, Element, Euler, Scene, Vector, dom, fs, vm, _;

fs = require('fs');
_ = require("underscore");
vm = require('vm');
dom = require("../lib/dom-lite");
Element = require("../lib/node");
Document = require("../lib/document");
Vector = require("../lib/vector");
Euler = require("../lib/euler");

var path = require('path');

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

  // Wrap setInterval and setTimeout so that errors in callbacks don't
  // kill the server.

  var self = this,
    sandbox = {
      document: document,
      Vector: Vector,
      Euler: Euler,
      XMLHttpRequest: XMLHttpRequest,
      setInterval: function(func, timeout) {
        var handle;
        handle = setInterval(function() {
          try {
            func();
          } catch (_error) {
            e = _error;
            console.log("[server] " + document.filename + ":\n  " + (e.toString()));
            clearInterval(handle);
          }
        }, timeout);
        intervals.push(handle);
        return handle;
      },

      setTimeout: function(func, timeout) {
        var handle;
        handle = setTimeout(function() {
          try {
            func();
          } catch (_error) {
            e = _error;
            console.log("[server] " + document.filename + ":\n  " + (e.toString()));
          }
        }, timeout);
        timeouts.push(handle);
        return handle;
      },
      console: {
        log : function(){
          var message = Array.prototype.slice.call(arguments).join(" ");
          console.log("[log] " + message);
          reflector.chatChannel.sendMessage(self, message);
        }
      }
    };

  // One sandbox for all script contexts
  sandbox = vm.createContext(sandbox);

  document.getElementsByTagName("script").map(function(scriptElement){
    var script = null,
      code = null,
      cdata = _.detect(scriptElement.childNodes, function(node){
        return node.nodeName == '#cdata';
      });

    if(scriptElement.src){
      code = fs.readFileSync(path.resolve(path.dirname(document.filename), scriptElement.src));
    }else if (cdata){
      code = cdata.data;
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
      // Run a script.
      script.runInContext(sandbox);
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
