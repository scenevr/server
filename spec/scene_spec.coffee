Scene = require('../scene.coffee')

Script = require('../elements/script.coffee')
Box = require('../elements/box.coffee')

describe 'constructor', ->
  it 'should create', ->
    s = new Scene "scene"
    expect(s instanceof Scene).toBeTruthy()
    expect(s.nodeName).toEqual 'scene'

describe 'scene', ->
  it 'should load scene', ->
    Scene.load process.cwd() + '/spec/fixtures/hello.xml', (scene) ->
      expect(scene.childNodes.length).toEqual(7)

      box = scene.childNodes[1]
      expect(box instanceof Box).toBeTruthy()
      expect(box.getAttribute("color")).toEqual "#FF00AA"
      expect(box.color.red()).toEqual 255
      expect(box.position.y).toEqual 10.0

      script = scene.childNodes[5]
      expect(script instanceof Script).toBeTruthy()

  it 'should load scene with <script /> tags', ->
    Scene.load process.cwd() + '/spec/fixtures/script_tag.xml', (scene) ->
      expect(scene.childNodes.length).toEqual(5)

      script = scene.childNodes[3]
      expect(script instanceof Script).toBeTruthy()
      expect(script.textContent).toMatch /10 < 20/

