'use strict';

var OpenTok = require('opentok'),
  Env = require("./env");

function OpentokChannel(){
  this.create();
}

OpentokChannel.prototype.create = function(){
  var self = this;

  this.opentok = new OpenTok(Env.getOpenTokKey(), Env.getOpenTokSecret());

  this.opentok.createSession(function(err, session) {
    if (err){
      return console.log('[server] Error establishing opentok session:\n\t' + err);
    }

    self.sessionId = session.sessionId;

    console.log('[server] OpenTok initialized with ' + self.sessionId)

    // save the sessionId
    // db.save('session', session.sessionId, done);
  });
}

OpentokChannel.prototype.createToken = function(observer){
  if(!observer.player || !observer.player.name){
    return console.error('[server] Cannot createToken for anons');
  }

  var token = this.opentok.generateToken(this.sessionId);
  observer.sendMessage('<event name="opentok" apikey="' + Env.getOpenTokKey() + '" session="' + this.sessionId + '" token="' + token + '" />');
}

module.exports = OpentokChannel;