'use strict';

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

var Element = require("../lib/element");
var builder = require('xmlbuilder');

var Player = (function(_super) {
  __extends(Player, _super);

  function Player() {
    Player.__super__.constructor.call(this, "player");
  }

  Player.prototype.reflect = true;

  // Send the player back to the respawn point with an optional message
  Player.prototype.respawn = function(reason){
    var xml = builder.create('root').ele('event', {
      name: 'respawn',
      reason: reason.toString()
    }).toString({ pretty: false });

    this.ownerDocument.reflector.getObserverByUUID(this.uuid).sendMessage(xml);
  }

  return Player;

})(Element);

module.exports = Player;
