'use strict';

const _ = require('underscore');
const ChatChannel = require('./chat-channel');
const Patch = require('scene-streamer').Patch;
const assert = require('assert');

function elementFilter (el) {
  if (el.nodeName === 'SCRIPT') {
    return false;
  }

  return true;
}

/**
 * Reflector pushes out world changes to a number of observers.
 * Each observer should have the following methods:
 *  .sendMessage()
 *  .socket.send()
 * It is expected that this is an instance of Observer.
 */
class Reflector {

  constructor (global, document) {
    this.global = global;
    this.document = document;

    assert.equal(document.nodeType, 9);

    this.observers = [];
    this.chatChannel = new ChatChannel(this);
    this.isShuttingDownForReload = false;

    this.patch = new Patch(this.global, this.body, (message) => {
      this.broadcast(message);
    }, elementFilter);
  }

  get body () {
    return this.document.body;
  }

  get scene () {
    return this.querySelector('a-scene');
  }

  querySelector (selector) {
    return this.document.querySelector(selector);
  }

  getObserverByUUID (uuid) {
    return _.find(this.observers, (observer) => {
      return observer.player.uuid === uuid;
    });
  }

  getElementByUUID (uuid) {
    return this.scene.ownerDocument.getElementByUUID(uuid);
  }

  broadcast (packetString, observer) {
    this.observers.forEach((ob) => {
      if (observer && observer !== ob) {
        return;
      }

      ob.send(packetString);
    });
  }

  get empty () {
    return this.observers.length === 0;
  }

  get observerCount () {
    return this.observers.length;
  }

  /* Tell all clients to disconnect and reconnect in 1000ms */
  emitRestartEvent () {
    this.isShuttingDownForReload = true;
    this.broadcast('<packet><event name="restart" /></packet>');
  }

  hasObserver (o) {
    return this.observers.indexOf(o) >= 0;
  }

  addObserver (o) {
    this.observers.push(o);
    o.setPlayer(this.document.createElement('a-player'));
    this.scene.appendChild(o.player);

    console.log('#addObserver');

    this.sendUUID(o);
    this.sendVersion(o);
    this.sendScene(o);
  }

  sendUUID (ob) {
    ob.sendMessage(`<packet><event name="ready" uuid="${ob.player.uuid}" /></packet>`);
  }

  sendVersion (ob) {
    ob.sendMessage('<packet><version scene="' + (this.scene.getAttribute('version') || '1.0') + '" /></packet>');
  }

  sendScene (ob) {
    var message = this.patch.getSnapshot();
    ob.sendMessage(`<packet>${message}</packet>`);
  }

  removeObserver (o) {
    if (o.player) {
      try {
        this.scene.removeChild(o.player);
      } catch (e) {
        console.log('[server] Unable to remove child');
      }
    }

    o.destroy();

    this.observers.splice(this.observers.indexOf(o), 1);
  }

  start () {
    this.scene.ownerDocument.reflector = this;

    // todo: run all the codes

    // this.scene.start(this);
    // this.interval = setInterval(this.tick.bind(this), 1000 / Env.getTickHertz());
  }

  stop () {
    var self = this;

    // clearInterval(this.interval);

    this.observers.forEach(function (o) {
      self.removeObserver(o);
      o.destroy();
    });

    this.observers = [];
  }
}

module.exports = Reflector;
