Node = require('../lib/node')
HTMLElement = require("../lib/dom-lite").HTMLElement
Document = require('../lib/document')

ownerDocument = Document.createDocument()

describe 'constructor', ->
  it 'should create', ->
    n = new Node
    expect(n instanceof Node).toBeTruthy()

describe 'innerXML', ->
  it 'should set text', ->
    n = new Node
    n.ownerDocument = ownerDocument
    n.innerXML = "hello world"
    expect(n.textContent).toEqual('hello world')
    
  it 'should create nodes', ->
    n = new Node
    n.ownerDocument = ownerDocument
    n.innerXML = "<box id='dave' />"
    expect(n.firstChild.nodeName).toEqual('box')
    expect(n.firstChild.id).toEqual('dave')

  it 'should get xml', ->
    n = new Node
    n.ownerDocument = ownerDocument
    n.innerXML = "<box id='dave' />"
    n.firstChild.id = 'mary'
    n.firstChild.setAttribute 'class', 'nothing'
    expect(n.innerXML).toMatch /<box uuid\S+ id="mary" class="nothing".+/

describe 'attributes', ->
  it 'should ignore underscored attributes', ->
    n = new Node
    n.ownerDocument = ownerDocument
    n.innerXML = "<box />"
    n.firstChild._position = {
      toString: -> "1 2 3"
    }
    expect(n.innerXML).toMatch /<box uuid\S+ position="1 2 3"><.box>/

describe 'packetParser', ->
  it 'should parse packets', ->
    n = Node.packetParser "<packet><event name='boop' /><player position='1 2 3' /></packet>"
    expect(n instanceof HTMLElement).toBeTruthy()
    expect(n.nodeName).toEqual("packet")
    expect(n.childNodes.length).toEqual(2)
    expect(n.firstChild.nodeName).toEqual('event')
    expect(n.firstChild.getAttribute('name')).toEqual('boop')