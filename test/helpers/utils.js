/**
 * Helpers
 */
var path = require('path');
var file = require('fs-utils');

var utils = module.exports = {};


utils.h1 = function(text, lvl, id) {
  return '<level'+lvl+' id="'+id+'">'+text+'</level'+lvl+'>';
};


utils.readFile = function(filepath) {
  var src = path.join('test/fixtures', filepath);
  return file.readFileSync(src);
};

/**
 * Normalize newlines
 * @param   {String}  str
 * @return  {String}
 */

utils.normalize = function(str) {
  return str.replace(/\s+/g, '');
};


utils.writeActual = function(dir, test, actual) {
  var dest = path.join('test/actual', dir, test + '.html');
  file.writeFileSync(dest, actual);
};