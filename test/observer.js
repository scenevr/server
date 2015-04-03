var test = require('tape');
var Observer = require('../lib/observer');

var o = new Observer();

test('should create', function (t) {
  t.ok(o instanceof Observer);
  t.end();
});

test('should destroy', function (t) {
  o.destroy();
  t.ok(true);
  t.end();
});
