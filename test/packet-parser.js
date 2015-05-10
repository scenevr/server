var test = require('tape');
var PacketParser = require('../lib/packet-parser');
var HTMLElement = require('dom-lite').HTMLElement;

test('should parse packets', function (t) {
  var n = PacketParser('<packet><event name=\'boop\' /><player position=\'1 2 3\' /></packet>');
  t.ok(n instanceof HTMLElement);
  t.equal(n.localName, 'packet');
  t.equal(n.childNodes.length, 2);
  t.equal(n.firstChild.localName, 'event');
  t.equal(n.firstChild.getAttribute('name'), 'boop');
  t.end();
});
