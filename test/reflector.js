var test = require('tape');
var Reflector = require('../lib/reflector');
var ChatChannel = require('../lib/chat-channel');
var Document = require('scene-dom').Document;

function createObserver (name) {
  return {
    name: name,
    addObserver: function () {},
    setPlayer: function () {},
    player: d.createElement('player'),
    sendMessage: function () {},
    destroy: function () {}
  };
};

var d = Document.createDocument();
var s = d.createElement('scene');
var o = createObserver('ben');
var r = new Reflector(s);

test('ctor#create', function (t) {
  t.ok(r instanceof Reflector);
  t.ok(r.chatChannel instanceof ChatChannel);
  t.equal(r.scene, s);
  t.end();
});

test('broadcast', function (t) {
  r.broadcast(o, '<hello />');
  t.end();
});

test('emit', function (t) {
  r.emit('<boop />');
  t.end();
});

var o2 = createObserver('joe');

test('addObserver', function (t) {
  r.addObserver(o);
  t.equal(1, r.observerCount());
  r.addObserver(o2);
  t.equal(2, r.observerCount());
  t.end();
});

test('removeObserver', function (t) {
  r.removeObserver(o2);
  t.equal(1, r.observerCount());
  t.ok(r.hasObserver(o));
  t.notOk(r.hasObserver(o2));
  t.end();
});
