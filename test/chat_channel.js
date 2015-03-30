var test = require('tape');
var ChatChannel = require('../lib/chat_channel');
var Scene = require('../elements/scene');

test('should create', function (t) {
  t.plan(1);

  var c = new ChatChannel();
  t.ok(c instanceof ChatChannel);
});

test('should send message', function (t) {
  t.plan(1);

  var c = new ChatChannel({
    scene: new Scene('scene')
  });

  var xml = c.sendMessage({
    broadcast: function () {},
    player: { name: 'ben' }
  }, 'hello world');

  t.ok(/^<event.+chat/.test(xml));
});
