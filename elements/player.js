var util = require('util');
var Element = require('../lib/element');
var Player;

function Player () {
  Element.call(this, 'player');
}

util.inherits(Player, Element);

Player.prototype.reflect = true;

Player.prototype.getObserver = function () {
  return this.ownerDocument.reflector.getObserverByUUID(this.uuid);
};

// Send the player back to the respawn point with an optional message
Player.prototype.respawn = function (reason) {
  this.getObserver().respawn(reason);
};

module.exports = Player;
