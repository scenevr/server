var dom = require('../lib/dom-lite');
var UUID = require('uuid');
var Script = require('../elements/script');
var Box = require('../elements/box');
var Plane = require('../elements/plane');
var Spawn = require('../elements/spawn');
var Player = require('../elements/player');
var Billboard = require('../elements/billboard');
var Model = require('../elements/model');
var Link = require('../elements/link');
var Skybox = require('../elements/skybox');
var Fog = require('../elements/fog');
var Audio = require('../elements/audio');
var Document = dom.Document;
var Node = require('./node');
var Scene = require('../elements/scene');

Document.prototype.markAsDead = function (uuid) {
  this.deadNodes[uuid] = (new Date()).valueOf();
  delete this.nodeMap[uuid];
};

Document.prototype.markAsDirty = function (node) {
  this.dirtyNodes[node.uuid] = node;
};

Document.prototype.getElementByUUID = function (uuid) {
  return this.nodeMap[uuid];
};

Document.prototype.createElement = function (tag) {
  var node;

  if (tag === 'script') {
    node = new Script();
  } else if (tag === 'box') {
    node = new Box();
  } else if (tag === 'plane') {
    node = new Plane();
  } else if (tag === 'player') {
    node = new Player();
  } else if (tag === 'billboard') {
    node = new Billboard();
  } else if (tag === 'link') {
    node = new Link();
  } else if (tag === 'model') {
    node = new Model();
  } else if (tag === 'spawn') {
    node = new Spawn();
  } else if (tag === 'fog') {
    node = new Fog();
  } else if (tag === 'skybox') {
    node = new Skybox();
  } else if (tag === 'audio') {
    node = new Audio();
  } else if (tag === 'scene') {
    node = new Scene();
  } else {
    node = new Node(tag);
  }

  if (node.reflect) {
    node.uuid = UUID.v4();
    this.nodeMap[node.uuid] = node;
    node.observeSelf();
  }

  node.ownerDocument = this;
  node.eventTargets = {};
  return node;
};

Document.createDocument = function () {
  var d;
  d = new Document();
  d.deadNodes = {};
  d.dirtyNodes = {};
  d.nodeMap = {};
  return d;
};

module.exports = Document;
