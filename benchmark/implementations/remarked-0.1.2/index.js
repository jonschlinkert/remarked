'use strict'

var remarked = new require('./src/');

/*remarked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});*/

exports.run = function(data) {
  return remarked(data);
}
