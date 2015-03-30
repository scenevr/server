Vector = require('../lib/vector.js')

describe 'vector', ->
  it 'should set and get', ->
    v = new Vector 1,2,3
    expect(v.x).toEqual(1)
    expect(v.y).toEqual(2)
    expect(v.z).toEqual(3)

  it 'should clone', ->
    v = new Vector(1,2,3)
    v.clone().x = 100
    expect(v.x).toEqual(1)

  it 'should trigger onChanged', ->
    v = new Vector(1,2,3)

    v.onChanged = jasmine.createSpy("onChanged")
    expect(v.onChanged).not.toHaveBeenCalled()

    v.x += 100
    expect(v.onChanged).toHaveBeenCalled()


  it 'should parse', ->
    v = Vector.fromString("1 2 3")
    expect(v.z).toEqual(3)