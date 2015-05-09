var util = require('util');
var SpatialElement = require('./spatial-element');
var Player;

function Player () {
  SpatialElement.call(this, 'player');
}

util.inherits(Player, SpatialElement);

Player.prototype.reflect = true;

Player.prototype.getObserver = function () {
  return this.ownerDocument.reflector.getObserverByUUID(this.uuid);
};

// Send the player back to the respawn point with an optional message
Player.prototype.respawn = function (reason) {
  this.getObserver().respawn(reason);
};

module.exports = Player;
