Reflector = require('../lib/reflector')

describe 'constructor', ->
  it 'should create', ->
    r = new Reflector
    expect(r instanceof Reflector).toBeTruthy()

# describe 'observers', ->
#   before ->
#     observers = [

#     ]
#     observers.pu
#   it 'should send to all ', ->
#     c = new ChatChannel
#     expect(c.sendMessage { name : 'ben' }, 'hello world').toMatch /^<chat from="ben"/
