var OpenTok = require('opentok');
var Env = require('./env');

function OpentokChannel () {
  this.create();
}

OpentokChannel.prototype.create = function () {
  var self = this;

  this.opentok = new OpenTok(Env.getOpenTokKey(), Env.getOpenTokSecret());

  this.opentok.createSession({
    mediaMode: 'routed'
  }, function (err, session) {
    if (err) {
      return console.log('[server] Error establishing opentok session:\n\t' + err);
    }

    self.sessionId = session.sessionId;

    console.log('[server] OpenTok initialized with ' + self.sessionId);

    // save the sessionId
    // db.save('session', session.sessionId, done);
  });
};

OpentokChannel.prototype.createToken = function (observer) {
  if (!observer.player) {
    return console.error('[server] Player not found for observer');
  }

  var options = {};

  if (observer.isModerator()) {
    options.role = 'moderator';
  } else if (observer.player.name) {
    options.role = 'publisher';
  } else {
    options.role = 'subscriber';
  }

  var token = this.opentok.generateToken(this.sessionId, options);

  observer.sendMessage('<event name="opentok" role="' + options.role + '" apikey="' + Env.getOpenTokKey() + '" session="' + this.sessionId + '" token="' + token + '" />');

  return token;
};

module.exports = OpentokChannel;
