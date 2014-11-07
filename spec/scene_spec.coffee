Scene = require('../scene.coffee')

Script = require('../elements/script.coffee')
Box = require('../elements/box.coffee')

describe 'constructor', ->
  it 'should create', ->
    s = new Scene "scene"
    expect(s instanceof Scene).toBeTruthy()
    expect(s.nodeName).toEqual 'scene'

describe 'element', ->
  it 'should create', ->
    Scene.load process.cwd() + '/spec/fixtures/hello.xml', (scene) ->
      expect(scene.childNodes.length).toEqual(7)

      box = scene.childNodes[1]
      expect(box instanceof Box).toBeTruthy()
      expect(box.getAttribute("color")).toEqual "#FF00AA"
      expect(box.color.red()).toEqual 255

      script = scene.childNodes[5]
      expect(script instanceof Script).toBeTruthy()