// Todo - parse the linked sound resource, and keep track of what time the
// audio track is at, so that we can sync up clients, and people can make
// audio-synced visualizations.

var Audio, Element,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Element = require("../lib/element");

Audio = (function(_super) {
  __extends(Audio, _super);

  function Audio() {
    Audio.__super__.constructor.call(this, "audio");
  }

  Audio.prototype.reflect = true;

  return Audio;

})(Element);

module.exports = Audio;
