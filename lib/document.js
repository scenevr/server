'use strict';

var dom = require("../lib/dom-lite"),
  UUID = require("uuid"),
  Script = require("../elements/script"),
  Box = require("../elements/box"),
  Spawn = require("../elements/spawn"),
  Player = require("../elements/player"),
  Billboard = require("../elements/billboard"),
  Model = require("../elements/model"),
  Link = require("../elements/link"),
  Skybox = require("../elements/skybox"),
  Fog = require("../elements/fog"),
  Audio = require("../elements/audio"),
  Document = dom.Document,
  HTMLElement = dom.HTMLElement;

Document.prototype.markAsDead = function(uuid) {
  this.deadNodes[uuid] = (new Date).valueOf();
  return delete this.nodeMap[uuid];
};

Document.prototype.getElementByUUID = function(uuid) {
  return this.nodeMap[uuid];
};

Document.prototype.createElement = function(tag) {
  var node;
  if (tag === "script") {
    node = new Script;
  } else if (tag === "box") {
    node = new Box;
  } else if (tag === "player") {
    node = new Player;
  } else if (tag === "billboard") {
    node = new Billboard;
  } else if (tag === "link") {
    node = new Link;
  } else if (tag === "model") {
    node = new Model;
  } else if (tag === "spawn") {
    node = new Spawn;
  } else if (tag === "fog") {
    node = new Fog;
  } else if (tag === "skybox") {
    node = new Skybox;
  } else if (tag === "audio") {
    node = new Audio;
  } else {
    node = new HTMLElement(tag);
  }
  if (node.reflect) {
    node.uuid = UUID.v4();
    this.nodeMap[node.uuid] = node;
  }
  node.ownerDocument = this;
  node.eventTargets = {};
  return node;
};

Document.createDocument = function() {
  var d;
  d = new Document;
  d.deadNodes = {};
  d.nodeMap = {};
  return d;
};

module.exports = Document;
