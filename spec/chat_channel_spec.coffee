ChatChannel = require('../lib/chat_channel')

describe 'constructor', ->
  it 'should create', ->
    n = new ChatChannel
    expect(n instanceof ChatChannel).toBeTruthy()

describe 'sendMessage', ->
  it 'should send message', ->
    c = new ChatChannel
    expect(c.sendMessage { name : 'ben' }, 'hello world').toMatch /^<chat from="ben"/
