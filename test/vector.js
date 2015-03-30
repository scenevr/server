var test = require('tape');
var Vector = require('../lib/vector.js');

test('should set and get', function(t) {
  var v = new Vector(1, 2, 3);
  expect(v.x).toEqual(1);
  expect(v.y).toEqual(2);
  return expect(v.z).toEqual(3);
});

test('should clone', function() {
  var v;
  v = new Vector(1, 2, 3);
  v.clone().x = 100;
  return expect(v.x).toEqual(1);
});

test('should trigger onChanged', function() {
  var v;
  v = new Vector(1, 2, 3);
  v.onChanged = jasmine.createSpy("onChanged");
  expect(v.onChanged).not.toHaveBeenCalled();
  v.x += 100;
  return expect(v.onChanged).toHaveBeenCalled();
});

test('should parse', function() {
  var v;
  v = Vector.fromString("1 2 3");
  return expect(v.z).toEqual(3);
});

