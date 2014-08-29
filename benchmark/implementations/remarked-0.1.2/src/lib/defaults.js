/*!
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT license.
 *
 * Based on marked <https://github.com/chjj/marked>
 * Copyright (c) 2011-2014, Christopher Jeffrey, contributors.
 * Released under the MIT License (MIT)
 */

var Renderer = require('./renderer');

module.exports = {
  breaks: false,
  gfm: true,
  highlight: null,
  langPrefix: 'lang-',
  pedantic: false,
  renderer: new Renderer,
  sanitize: false,
  silent: false,
  smartLists: false,
  smartypants: false,
  tables: true,
  xhtml: false
};