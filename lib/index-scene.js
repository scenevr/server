const _ = require('underscore');
const Vector = require('three').Vector3;
const path = require('path');
const glob = require('glob');
const Env = require('./env');
const microdom = require('micro-dom');
const Document = microdom.Document;

var IndexScene = function (folder, callback) {
  var html = `<a-scene><skybox color='#99f' /><`;

  var i = 0;

  glob(folder + '/*.html', {}, function (err, files) {
    if (err || (files.length === 0)) {
      console.log('[server] Error. No scene files found in ' + folder);
      if (Env.isDevelopment()) {
        process.exit(-1);
      }
    }

    console.log(files);

    _.each(files, function (filename) {
      var v = new Vector(i * 3, 1, 0);
      var name = path.basename(filename, '.html');
      var pathname = path.basename(filename);

      html += `<a-cube position="${v.toArray().join(' ')} title="${name} - ${pathname}"></a-cube>`;

      v.z += 0.28;

      // xml += '<link position=\'' + v.toString() + '\' href=\'/' + pathname + '\' scale=\'0.25 0.25 0.25\' />';

      i++;
    });

    html += '</a-scene></body></html>';

    var doc = new Document();
    doc.body.innerHTML = html;
    callback(false, doc);
  });
};

module.exports = IndexScene;
