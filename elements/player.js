var Element, Player,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Element = require("../lib/element");

Player = (function(_super) {
  __extends(Player, _super);

  function Player() {
    Player.__super__.constructor.call(this, "player");
  }

  Player.prototype.reflect = true;

  return Player;

})(Element);

module.exports = Player;
