var test = require('tape');
var Scene = require('../elements/scene');
var Script = require('../elements/script');
var Box = require('../elements/box');
var Plane = require('../elements/plane');
var Spawn = require('../elements/spawn');
var Model = require('../elements/model');
var Link = require('../elements/link');
var Skybox = require('../elements/skybox');
var Fog = require('../elements/fog');
var Audio = require('../elements/audio');

test('should create', function (t) {
  var s;
  s = new Scene('scene');
  t.ok(s instanceof Scene);
  t.equal(s.nodeName, 'scene');
  t.end();
});

test('scene', function (t) {
  t.test('should load scene', function (t) {
    Scene.load(process.cwd() + '/test/fixtures/hello.xml', function (scene) {
      t.equal(scene.childNodes.length, 7);

      var box = scene.childNodes[1];
      t.ok(box instanceof Box);
      t.equal(box.position.y, 10.0);

      var script = scene.childNodes[5];
      t.ok(script instanceof Script);
      t.end();
    });
  });

  t.test('should load scene with <script /> tags', function (t) {
    Scene.load(process.cwd() + '/test/fixtures/script_tag.xml', function (scene) {
      t.equal(scene.childNodes.length, 5);

      var script = scene.childNodes[3];
      t.ok(script instanceof Script);
      t.ok(script.textContent.match(/10 < 20/));
      t.end();
    });
  });
});

test('all_tags', function (t) {
  t.test('should load', function (t) {
    Scene.load(process.cwd() + '/test/fixtures/all_tags.xml', function (scene) {
      t.ok(scene.childNodes.length > 3);
      t.end();
    });
  });

  t.test('should parse spawn', function (t) {
    Scene.load(process.cwd() + '/test/fixtures/all_tags.xml', function (scene) {
      t.equal(scene.getElementsByTagName('spawn').length, 1);
      t.ok(scene.getElementsByTagName('spawn')[0] instanceof Spawn);
      t.end();
    });
  });

  t.test('should parse billboard', function (t) {
    Scene.load(process.cwd() + '/test/fixtures/all_tags.xml', function (scene) {
      t.equal(scene.getElementsByTagName('billboard').length, 1);
      t.ok(scene.getElementsByTagName('billboard')[0].innerHTML.match(/<h1>Welcome/));
      t.ok(scene.getElementsByTagName('billboard')[0].innerHTML.match(/<!\[CDATA\[/));
      t.ok(scene.getElementsByTagName('billboard')[0].innerHTML.match(/stuff and things/));
      t.end();
    });
  });

  t.test('should parse model', function (t) {
    Scene.load(process.cwd() + '/test/fixtures/all_tags.xml', function (scene) {
      t.equal(scene.getElementsByTagName('model').length, 1);
      t.ok(scene.getElementsByTagName('model')[0].src.match(/blah.obj/));
      t.ok(scene.getElementsByTagName('model')[0] instanceof Model);
      t.end();
    });
  });

  t.test('should parse link', function (t) {
    Scene.load(process.cwd() + '/test/fixtures/all_tags.xml', function (scene) {
      t.equal(scene.getElementsByTagName('link').length, 1);
      t.ok(scene.getElementsByTagName('link')[0].href.match(/test/));
      t.ok(scene.getElementsByTagName('link')[0] instanceof Link);
      t.end();
    });
  });

  t.test('should parse skybox', function (t) {
    Scene.load(process.cwd() + '/test/fixtures/all_tags.xml', function (scene) {
      t.equal(scene.getElementsByTagName('skybox').length, 1);
      t.ok(scene.getElementsByTagName('skybox')[0].src.match(/blah/));
      t.ok(scene.getElementsByTagName('skybox')[0] instanceof Skybox);
      t.end();
    });
  });

  t.test('should parse audio', function (t) {
    Scene.load(process.cwd() + '/test/fixtures/all_tags.xml', function (scene) {
      t.equal(scene.getElementsByTagName('audio').length, 1);
      t.ok(scene.getElementsByTagName('audio')[0].src.match(/drone/));
      t.ok(scene.getElementsByTagName('audio')[0] instanceof Audio);
      t.end();
    });
  });

  t.test('should parse fog', function (t) {
    Scene.load(process.cwd() + '/test/fixtures/all_tags.xml', function (scene) {
      t.equal(scene.getElementsByTagName('fog').length, 1);
      t.ok(scene.getElementsByTagName('fog')[0].style.color.match('#fff'));
      t.ok(scene.getElementsByTagName('fog')[0].near.match('100'));
      t.ok(scene.getElementsByTagName('fog')[0] instanceof Fog);
      t.end();
    });
  });

  t.test('should parse plane', function (t) {
    Scene.load(process.cwd() + '/test/fixtures/all_tags.xml', function (scene) {
      t.equal(scene.getElementsByTagName('plane').length, 1);
      t.ok(scene.getElementsByTagName('plane')[0].style.textureMap.match('url'));
      t.ok(scene.getElementsByTagName('plane')[0] instanceof Plane);
      t.end();
    });
  });
});
