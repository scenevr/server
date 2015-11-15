var _ = require('underscore');
var Vector = require('scene-dom').Vector;
var path = require('path');
var glob = require('glob');
var Env = require('./env');

var IndexScene = function (folder, callback) {
  var xml = "<scene><spawn position='0 0 10' /><skybox style='color: linear-gradient(#fff, #99f);' />";

  var i = 0;

  glob(folder + '/*.xml', {}, function (err, files) {
    if (err || (files.length === 0)) {
      console.log('[server] Error. No scene files found in ' + folder);
      if (Env.isDevelopment()) {
        process.exit(-1);
      }
    }

    console.log(files);

    _.each(files, function (filename) {
      var v = new Vector(i * 3, 1, 0);
      var name = path.basename(filename, '.xml');
      var pathname = path.basename(filename);

      xml += '<billboard position=\'' + v.toString() + '\'><![CDATA[<h3 style=\'text-align: center; font-size: 3em\'>' + name + '</h3>]]></billboard>';
      v.z += 0.28;
      xml += '<link position=\'' + v.toString() + '\' href=\'/' + pathname + '\' scale=\'0.25 0.25 0.25\' />';

      i++;
    });

    xml += '</scene>';

    callback(false, xml);
  });
};

module.exports = IndexScene;
