/*!
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT license.
 */

module.exports = [
  ';(function() {',
  '',
  '<%= code %>',
  '',
  'if (typeof module !== "undefined" && typeof exports === "object") {',
  '  module.exports = marked;',
  '} else if (typeof define === "function" && define.amd) {',
  '  define(function() { return marked; });',
  '} else {',
  '  this.marked = marked;',
  '}',
  '',
  '}).call(function() {',
  '  return this || (typeof window !== "undefined" ? window : global);',
  '}());'
];
