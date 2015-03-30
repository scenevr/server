var util = require('util');
var Element = require('../lib/element');
var builder = require('xmlbuilder');
var Player;

function Player () {
  Element.call(this, 'player');
}

util.inherits(Player, Element);

Player.prototype.reflect = true;

// Send the player back to the respawn point with an optional message
Player.prototype.respawn = function (reason) {
  var xml = builder.create('root').ele('event', {
    name: 'respawn',
    reason: reason.toString()
  }).toString({ pretty: false });

  this.ownerDocument.reflector.getObserverByUUID(this.uuid).sendMessage(xml);
};

module.exports = Player;
