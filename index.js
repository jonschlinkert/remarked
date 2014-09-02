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

'use strict';

var defaults = require('./lib/defaults');
var Parser = require('./lib/parser');
var Lexer = require('./lib/lexer-block');
var InlineLexer = require('./lib/lexer-inline');
var Renderer = require('./lib/renderer');
var utils = require('./lib/utils/helpers');
var merge = require('./lib/utils/merge');

// Copy defaults
var remarkedOptions = merge({}, defaults);

/**
 * remarked
 */

function Remarked(src, options) {
  if (!(this instanceof Remarked)) {
    var remarked = new Remarked(merge({} ,remarkedOptions, options));

    return remarked.parse(src);
  }

  this.options = merge({}, defaults, src);
  this.lexer = new Lexer(this.options);
  this.parser = new Parser(this.options);
}


/**
 * parse
 */

Remarked.prototype.parse = function(src) {
  try {
    return this.parser.parse(this.lexer.lex(src));
  } catch (e) {
    e.message += '\n  [remarked]: please report this to https://github.com/jonschlinkert/remarked.';
    if ((this.options || defaults).silent) {
      return '<p>An error occured:</p><pre>' + utils._escape(e.message + '', true) + '</pre>';
    }
    throw e;
  }
};


/**
 * options
 */

Remarked.prototype.setOptions = function(options) {
  merge(this.options, options);
  return this;
};

Remarked.setOptions = function (options) {
  merge(remarkedOptions, options);
  return this;
};

Remarked.defaults = defaults;


/**
 * Expose classes
 */

Remarked.Parser = Parser;
Remarked.Renderer = Renderer;
Remarked.Lexer = Lexer;
Remarked.InlineLexer = InlineLexer;


// Export remarked

module.exports = Remarked;
