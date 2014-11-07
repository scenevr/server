Node = require('../node')

describe 'constructor', ->
  it 'should create', ->
    n = new Node
    expect(n instanceof Node).toBeTruthy()

describe 'innerXML', ->
  it 'should set text', ->
    n = new Node
    n.innerXML = "hello world"
    expect(n.textContent).toEqual('hello world')
    
  it 'should create nodes', ->
    n = new Node
    n.innerXML = "<box id='dave' />"
    expect(n.firstChild.nodeName).toEqual('box')
    expect(n.firstChild.id).toEqual('dave')

  it 'should get xml', ->
    n = new Node
    n.innerXML = "<box id='dave' />"
    n.firstChild.id = 'mary'
    n.firstChild.setAttribute 'class', 'nothing'
    expect(n.innerXML).toMatch /<box uuid\S+ id="mary" class="nothing".+/

describe 'attributes', ->
  it 'should ignore underscored attributes', ->
    n = new Node
    n.innerXML = "<box />"
    n.firstChild._position = {
      toString: -> "1 2 3"
    }
    expect(n.innerXML).toMatch /<box uuid\S+ position="1 2 3"><.box>/
