Reflector = require('../lib/reflector')
Scene = require('../lib/scene')
Observer = require('../lib/observer')
Box = require("../lib/elements/box")
msgpack = require('msgpack')

describe 'observers', ->
  beforeEach ->
    @r = new Reflector
    @o = new Observer

  it 'should add observer', ->
    @r.addObserver(@o)
    expect(@r.observers.length).toEqual(1)

  it 'should remove observer', ->
    @r.addObserver(@o)
    @r.addObserver(new Observer)
    @r.removeObserver(@o)
    expect(@r.observers.length).toEqual(1)

describe 'tick', ->
  beforeEach ->
    @s = new Scene
    @s.appendChild(new Box 0xFF)

    @o = new Observer
    @o.socket = { send : -> null }

    @r = new Reflector(@s)
    @r.addObserver(@o)

  it 'should do nothing', ->
    @r = new Reflector(@s)
    expect(@r.tick()).toBeNull()

  it 'should socket.send', ->
    spyOn(@o.socket, 'send')
    @r.tick()
    expect(@o.socket.send).toHaveBeenCalled()
    expect(@o.socket.send.mostRecentCall.args[0].length).toEqual(69)

  it 'should send intro packet', ->
    spyOn(@o.socket, 'send')
    @r.tick()
    expect(@o.socket.send).toHaveBeenCalled()

    packets = msgpack.unpack(@o.socket.send.mostRecentCall.args[0])

    expect(packets.length).toEqual(1)
    expect(packets[0].length).toEqual(2)
    expect(packets[0][0]).toEqual(0x01)

  it 'should send nothing on second tick', ->
    spyOn(@o.socket, 'send')
    @r.tick()
    @r.tick()
    packets = msgpack.unpack(@o.socket.send.mostRecentCall.args[0])
    expect(packets.length).toEqual(0)

  it 'should send update packet on second tick', ->
    spyOn(@o.socket, 'send')
    @r.tick()
    @s.markAllDirty()
    @r.tick()

    packets = msgpack.unpack(@o.socket.send.mostRecentCall.args[0])

    expect(packets.length).toEqual(1)
    expect(packets[0].length).toEqual(8)
    expect(packets[0][0]).toEqual(0x02)

