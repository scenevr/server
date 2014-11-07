Packets = require('../lib/packets')
Element = require('../lib/element')

describe 'Update', ->
  beforeEach ->
    @p = new Packets.Update(new Element)

  