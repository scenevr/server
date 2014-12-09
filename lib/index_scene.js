var _ = require('underscore'),
  Vector = require("./vector"),
  path = require("path");

'use strict';

var IndexScene = function(file){
  var self = this;

  self.xml = "<scene><spawn position='0 0 10' />";

  var i = 0;

  _.each(file, function(filename){
    var v = new Vector(i * 5,1,0),
      pathname = path.basename(filename);

    self.xml += "<billboard position='" + v.toString() + "'><h3 style='font-size: 2em'>" + pathname +"</h3></billboard>";
    v.z += 0.5;
    self.xml += "<link position='" + v.toString() + "' href='/" + pathname + "' scale='0.25 0.25 0.25' />";

    i++;
  });

  self.xml += "</scene>";
}

IndexScene.prototype.toXml = function(){
  return this.xml;
};

module.exports = IndexScene;