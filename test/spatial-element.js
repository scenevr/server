var test = require('tape');
var SpatialElement = require('../elements/spatial-element');
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
  var s = new SpatialElement('scene');
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

  var e = new SpatialElement('box');
  t.ok(e instanceof SpatialElement);
  t.equal(e.nodeName, 'box');
});

// uuid

test('should have uuid', function (t) {
  t.plan(2);

  var e = new SpatialElement('box');
  e.uuid = '1234-1234-1234-1234';
  t.ok(/^1234.+/.test(e.uuid));
  t.ok(/<box uuid="1234.+/.test(xml(e)));
});

test('position', function (t) {
  t.test('should get position', function (t) {
    var e = new SpatialElement('box');
    t.ok(e.position instanceof Vector);
    t.equal(e.position.z, 0);
    t.end();
  });

  t.test('should set position', function (t) {
    var e = new SpatialElement('box');
    e.position = new Vector(1, 2, 3);
    t.equal(e.position.z, 3);
    t.end();
  });

  t.test('should set by attribute', function (t) {
    var e = new SpatialElement('box');
    e.setAttribute('position', '3 4 5');
    t.deepEqual(e.position.toArray(), [3, 4, 5]);
    t.end();
  });

  t.test('should try and parse', function (t) {
    var e = new SpatialElement('box');
    e.position = '3 4 5';
    t.deepEqual(e.position.toArray(), [3, 4, 5]);
    t.end();
  });

  t.test('throw', function (t) {
    var e = new SpatialElement('box');

    t.throws(function () {
      e.position = 'one two three';
    }, 'Invalid position argument');
    t.end();
  });

  t.test('should get xml', function (t) {
    var e = new SpatialElement('box');
    e.position.y += 10;
    t.ok(/<box position="0 10 0".+/.test(xml(e)));
    t.end();
  });

  t.test('should allow change observation', function (t) {
    t.plan(5);

    var e = new SpatialElement('box');
    e.position = '1 2 3';

    var message = '(unknown)';
    e.addPropertyChangeObserver('position', function (value) {
      t.ok(message);
    });

    message = 'Replaced by string';
    e.position = '4 5 6';

    message = 'Replaced by vector';
    e.position = new Vector(7, 8, 9);

    message = 'Single ordinate updated - x';
    e.position.x = 10;
    message = 'Single ordinate updated - y';
    e.position.y = 11;
    message = 'Single ordinate updated - z';
    e.position.z = 12;

    t.end();
  });

  t.test('change observation shouldn\'t cross into other objects', function (t) {
    t.plan(2);

    var e1 = new SpatialElement('box');
    e1.position = '1 2 3';
    var e2 = new SpatialElement('box');
    e2.position = '4 5 6';

    e1.addPropertyChangeObserver('position', function (value) {
      t.equals(7, value.x, 'e1 callback called by e1 change');
    });
    e2.addPropertyChangeObserver('position', function (value) {
      t.equals(8, value.x, 'e2 callback called by e2 change');
    });
    e1.position.x = 7;
    e2.position.x = 8;

    t.end();
  });

  t.end();
});

test('scale', function (t) {
  t.test('should get scale', function (t) {
    var e = new SpatialElement('box');
    t.ok(e.scale instanceof Vector);
    t.equal(e.scale.z, 1);
    t.end();
  });

  t.test('should set position', function (t) {
    var e = new SpatialElement('box');
    e.scale = new Vector(1, 2, 3);
    t.equal(e.scale.z, 3);
    t.end();
  });

  t.test('should set by attribute', function (t) {
    var e = new SpatialElement('box');
    e.setAttribute('scale', '3 4 5');
    t.deepEqual(e.scale.toArray(), [3, 4, 5]);
    t.end();
  });

  t.test('should get xml', function (t) {
    var e = new SpatialElement('box');
    e.scale.x += 10;
    t.ok(/<box scale="11 1 1".+/.test(xml(e)));
    t.end();
  });

  t.end();
});

test('rotation', function (t) {
  t.test('should get rotation', function (t) {
    var e = new SpatialElement('box');
    t.ok(e.rotation instanceof Euler);
    t.equal(e.rotation.x, 0);
    t.end();
  });

  t.test('should set rotation', function (t) {
    var e = new SpatialElement('box');
    e.rotation = new Euler(0, Math.PI / 2, 0);
    almost(t, e.rotation.y, Math.PI / 2);
    t.end();
  });

  t.test('should set by attribute', function (t) {
    var e = new SpatialElement('box');
    e.setAttribute('rotation', '0 1.001 2');
    t.equal(e.rotation.x, 0);
    almost(t, e.rotation.y, 1.001);
    t.equal(e.rotation.z, 2);
    t.end();
  });

  t.test('should get xml', function (t) {
    var e = new SpatialElement('box');
    e.rotation.y += 0.1;
    t.ok(/<box rotation="0 0.1 0".+/.test(xml(e)));
    t.end();
  });

  t.end();
});

// attributes
test('should support string attributes', function (t) {
  var e;
  e = new SpatialElement('model');
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
