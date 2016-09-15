/* globals fetch, WebSocket, DOMParser */

const EventEmitter = require('events');
const Apply = require('scene-streamer').Apply;
const URL = require('url');
const privateAttribute = require('scene-streamer/private-attributes');
const Avatar = require('./avatar');

const UUID_KEY = 'data-uuid';

module.exports = class Client extends EventEmitter {
  constructor () {
    super();

    this.parser = new DOMParser();
  }

  start () {
    this.connect();
  }

  generate () {
    this.scene = document.querySelector('a-scene');

    this.camera = document.createElement('a-camera');
    this.camera.setAttribute('position', '0 1.8 5');
    this.scene.appendChild(this.camera);

    this.cursor = document.createElement('a-cursor');
    this.cursor.setAttribute('color', '#f70');
    this.camera.appendChild(this.cursor);

    this.scene.addEventListener('click', (e) => {
      if (e.target.nodeName === 'CANVAS') {
        return;
      }

      if (e.target.nodeName === 'A-CURSOR') {
        return;
      }

      this.send('event', {
        eventType: 'click',
        target: privateAttribute.get(e.target, UUID_KEY),
        timeStamp: e.timeStamp
      });
    });

    this.apply = new Apply(this.scene);
  }

  connect () {
    var uri = URL.parse(document.location.toString());
    uri.protocol = 'ws';

    var url = URL.format(uri);
    console.log(url);
    this.ws = new WebSocket(url, 'scenevr');
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = () => {
      this.onConnected();
      this.emit('connected');
    };

    this.ws.onclose = () => {
      this.emit('disconnected');
    };

    this.ws.onmessage = this.onMessage.bind(this);
  }

  send (type, json, id) {
    var message = Object.assign({}, json || {}, {type: type});

    if (id) {
      message.id = id;
    }

    this.ws.send(JSON.stringify(message));
  }

  createAvatar () {
    this.avatar = new Avatar(this);
  }

  onConnected () {
    document.body.className = '';
    this.generate();
  }

  onMessage (e) {
    console.log('#onMessage');

    var message;

    if (e.data[0] === '{') {
      message = JSON.parse(e.data);
    } else if (e.data[0] === '<') {
      var doc = this.parser.parseFromString(e.data, 'text/xml');
      var packet = doc.firstChild;
      this.apply.onMessage(packet.firstChild);

      /*
      if (!started) {
        start();
        started = true;
      }
      */

      return;
    }

    switch (message.type) {
      // case 'initial-state':
      //   document.body.innerHTML = message.scene;
      //   avatar.start();
      //   break;

      case 'location':
        send('location', { url: document.location.toString() }, message.id);
        break;

      case 'html':
        fetch(document.location)
          .then((r) => r.text())
          .then((html) => {
            send('html', { url: document.location.toString(), html: html }, message.id);
          });
        break;

      case 'get':
        fetch(message.url).then((response) => {
          send('get', { url: message.url, body: response }, message.id);
        });
        break;

      default:
        console.log(`Message ${message.type} not supported`);
    }
  }
}

window.stop = function () {
  ws.close();
};

