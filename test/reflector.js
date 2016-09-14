const test = require('tape');
const Reflector = require('../lib/reflector');
const ChatChannel = require('../lib/chat-channel');
const microdom = require('micro-dom');

const Document = microdom.Document;

function createObserver (name) {
  return {
    name: name,
    addObserver: function () {},
    setPlayer: function () {},
    player: d.createElement('player'),
    sendMessage: function () {},
    send: function () {},
    destroy: function () {}
  };
}

const GLOBALS = {
  HTMLElement: microdom.HTMLElement,
  MutationObserver: require('micro-dom').MutationObserver
};

var d = new Document();
d.body.innerHTML = '<a-scene></a-scene>';

var o = createObserver('ben');
var r = new Reflector(GLOBALS, d);

test('ctor#create', function (t) {
  t.ok(r instanceof Reflector);
  t.ok(r.chatChannel instanceof ChatChannel);
  t.ok(r.document instanceof Document);
  t.end();
});

test('broadcast', function (t) {
  r.broadcast(o, '<hello />');
  t.end();
});

var o2 = createObserver('joe');

test('addObserver', function (t) {
  r.addObserver(o);
  t.equal(1, r.observerCount);
  r.addObserver(o2);
  t.equal(2, r.observerCount);
  t.end();
});

test('removeObserver', function (t) {
  r.removeObserver(o2);
  t.equal(1, r.observerCount);
  t.ok(r.hasObserver(o));
  t.notOk(r.hasObserver(o2));
  t.notOk(r.empty);
  t.end();
});
