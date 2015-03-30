var test = require('tape');
var Element = require('../lib/element');
var Document = require('../lib/document');
var Vector = require('../lib/vector');
var Euler = require('../lib/euler');
var almostEqual = require('almost-equal');

function almost (t, a, b, msg) {
  if (almostEqual(a, b)) {
    t.ok(true, msg);
  } else {
    t.equal(a, b, msg);
  }
}

var xml = function (e) {
  var s = new Element('scene');
  s.appendChild(e);
  return s.innerXML;
};

var parseXml = function (xml) {
  var document = Document.createDocument();
  var scene = document.createElement('scene');
  scene.innerXML = xml;
  return scene.firstChild;
};

// constructor

test('should create', function (t) {
  t.plan(2);

  var e = new Element('box');
  t.ok(e instanceof Element);
  t.equal(e.nodeName, 'box');
});

// uuid

test('should have uuid', function (t) {
  t.plan(2);

  var e = new Element('box');
  e.uuid = '1234-1234-1234-1234';
  t.ok(/^1234.+/.test(e.uuid));
  t.ok(/<box uuid="1234.+/.test(xml(e)));
});

test('position', function (t) {
  t.test('should get position', function (t) {
    var e = new Element('box');
    t.ok(e.position instanceof Vector);
    t.equal(e.position.z, 0);
    t.end();
  });

  t.test('should set position', function (t) {
    var e = new Element('box');
    e.position = new Vector(1, 2, 3);
    t.equal(e.position.z, 3);
    t.end();
  });

  t.test('should set by attribute', function (t) {
    var e = new Element('box');
    e.setAttribute('position', '3 4 5');
    t.deepEqual(e.position.toArray(), [3, 4, 5]);
    t.end();
  });

  t.test('should try and parse', function (t) {
    var e = new Element('box');
    e.position = '3 4 5';
    t.deepEqual(e.position.toArray(), [3, 4, 5]);
    t.end();
  });

  t.test('throw', function (t) {
    var e = new Element('box');

    t.throws(function () {
      e.position = 'one two three';
    }, 'Invalid position argument');
    t.end();
  });

  t.test('should get xml', function (t) {
    var e = new Element('box');
    e.position.y += 10;
    t.ok(/<box position="0 10 0".+/.test(xml(e)));
    t.end();
  });

  t.end();
});

test('scale', function (t) {
  t.test('should get scale', function (t) {
    var e = new Element('box');
    t.ok(e.scale instanceof Vector);
    t.equal(e.scale.z, 1);
    t.end();
  });

  t.test('should set position', function (t) {
    var e = new Element('box');
    e.scale = new Vector(1, 2, 3);
    t.equal(e.scale.z, 3);
    t.end();
  });

  t.test('should set by attribute', function (t) {
    var e = new Element('box');
    e.setAttribute('scale', '3 4 5');
    t.deepEqual(e.scale.toArray(), [3, 4, 5]);
    t.end();
  });

  t.test('should get xml', function (t) {
    var e = new Element('box');
    e.scale.x += 10;
    t.ok(/<box scale="11 1 1".+/.test(xml(e)));
    t.end();
  });

  t.end();
});

test('rotation', function (t) {
  t.test('should get rotation', function (t) {
    var e = new Element('box');
    t.ok(e.rotation instanceof Euler);
    t.equal(e.rotation.x, 0);
    t.end();
  });

  t.test('should set rotation', function (t) {
    var e = new Element('box');
    e.rotation = new Euler(0, Math.PI / 2, 0);
    almost(t, e.rotation.y, Math.PI / 2);
    t.end();
  });

  t.test('should set by attribute', function (t) {
    var e = new Element('box');
    e.setAttribute('rotation', '0 1.001 2');
    t.equal(e.rotation.x, 0);
    almost(t, e.rotation.y, 1.001);
    t.equal(e.rotation.z, 2);
    t.end();
  });

  t.test('should get xml', function (t) {
    var e = new Element('box');
    e.rotation.y += 0.1;
    t.ok(/<box rotation="0 0.1 0".+/.test(xml(e)));
    t.end();
  });

  t.end();
});

// attributes
test('should support string attributes', function (t) {
  var e;
  e = new Element('model');
  e.src = '//something';
  t.ok(/..something/.test(e.src));
  t.ok(/..something/.test(e.getAttribute('src')));
  t.ok(/src="..something"/.test(xml(e)));
  t.end();
});

test('style', function (t) {
  t.test('should parse', function (t) {
    var e = parseXml('<box style=\'color: red\' />');
    t.equal(e.style.color, 'red');
    e.style.color = 'blue';
    t.ok(/color: blue/.test(xml(e)));
    t.end();
  });

  t.test('should parse hyphenated tags', function (t) {
    var e = parseXml('<box style=\'texture-map: url(/blah.png)\' />');
    t.equal(e.style.textureMap, 'url(/blah.png)');
    e.style.textureMap = 'url(/boop.png)';
    t.ok(/texture-map: url..boop.png./.test(xml(e)));
    t.end();
  });

  t.end();
});
