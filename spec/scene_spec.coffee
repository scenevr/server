Scene = require('../scene.coffee')

Script = require('../elements/script.coffee')
Box = require('../elements/box.coffee')
Spawn = require('../elements/spawn.coffee')

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


describe 'all_tags', ->
  it 'should load', ->
    Scene.load process.cwd() + '/spec/fixtures/all_tags.xml', (scene) ->
      expect(scene.childNodes.length).toBeGreaterThan 3

      expect(scene.getElementsByTagName("spawn").length).toEqual 1
      expect(scene.getElementsByTagName("spawn")[0] instanceof Spawn).toBeTruthy()

