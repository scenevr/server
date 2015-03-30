var _ = require('underscore');
var Vector = require('./vector');
var path = require('path');

var IndexScene = function (file) {
  var self = this;

  self.xml = "<scene><spawn position='0 0 10' /><skybox style='color: linear-gradient(#fff, #99f);' />";

  var i = 0;

  _.each(file, function (filename) {
    var v = new Vector(i * 3, 1, 0);
    var name = path.basename(filename, '.xml');
    var pathname = path.basename(filename);

    self.xml += '<billboard position=\'' + v.toString() + '\'><![CDATA[<h3 style=\'text-align: center; font-size: 3em\'>' + name + '</h3>]]></billboard>';
    v.z += 0.28;
    self.xml += '<link position=\'' + v.toString() + '\' href=\'/' + pathname + '\' scale=\'0.25 0.25 0.25\' />';

    i++;
  });

  self.xml += '</scene>';
};

IndexScene.prototype.toXml = function () {
  return this.xml;
};

module.exports = IndexScene;
