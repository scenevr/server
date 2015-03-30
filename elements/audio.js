var util = require('util');
var Element = require('../lib/element');
var Audio;

// Todo - parse the linked sound resource, and keep track of what time the
// audio track is at, so that we can sync up clients, and people can make
// audio-synced visualizations.

function Audio() {
  Element.call(this, 'audio');
}

util.inherits(Audio, Element);

Audio.prototype.reflect = true;

module.exports = Audio;
