var test = require('tape');
var Vector = require('../lib/vector.js');

test('should set and get', function (t) {
  var v = new Vector(1, 2, 3);
  t.equal(v.x, 1);
  t.equal(v.y, 2);
  t.equal(v.z, 3);
  t.end();
});

test('should clone', function (t) {
  var v;
  v = new Vector(1, 2, 3);
  v.clone().x = 100;
  t.equal(v.x, 1);
  t.end();
});

test('should trigger onChanged', function (t) {
  t.plan(1);

  var v = new Vector(1, 2, 3);
  v.onChanged = function () {
    t.ok(true);
  };
  v.x += 100;
});

test('should parse', function (t) {
  var v;
  v = Vector.fromString('1 2 3');
  t.equal(v.z, 3);
  t.end();
});
