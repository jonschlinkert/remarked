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


/**
 * remarked
 */

function Remarked(src, options, callback) {
  if (!(this instanceof Remarked)) {
    if (typeof options === 'function') {
      callback = options;
      options = null;
    }

    var remarked = new Remarked(options);
    return remarked.parse(src, callback);
  }

  this.options = merge({}, defaults, src);
  this.lexer = new Lexer(this.options);
  this.parser = new Parser(this.options);
}


/**
 * parse
 */

Remarked.prototype.parse = function(src, callback) {
  if (!callback) {
    try {
      return this.parser.parse(this.lexer.lex(src));
    } catch (e) {
      e.message += '\n  [remarked]: please report this to https://github.com/jonschlinkert/remarked.';
      if ((this.options || defaults).silent) {
        return '<p>An error occured:</p><pre>' + utils._escape(e.message + '', true) + '</pre>';
      }
      throw e;
    }
  }

  var self = this;
  var highlight = this.options.highlight;
  var tokens;
  var pending;
  var i = 0;

  try {
    tokens = this.lexer.lex(src);
  } catch (e) {
    return callback(e);
  }

  pending = tokens.length;

  var cb = function (err) {
    if (err) {
      self.options.highlight = highlight;
      return callback(err);
    }

    var out;

    try {
      out = self.parser.parse(tokens);
    } catch (e) {
      err = e;
    }

    self.options.highlight = highlight;
    return err ? callback(err) : callback(null, out);
  };

  if (!highlight || highlight.length < 3) {
    return cb();
  }

  delete this.options.highlight;

  if (!pending) {
    return cb();
  }

  for (; i < pending; i += 1) {
    var token = tokens[i];
    if (token.type !== 'code') {
      return (pending -= 1) || cb();
    }
    return highlight(token.text, token.lang, function (err, code) {
      if (err) {
        return cb(err);
      }
      if (code === null || code === token.text) {
        return (pending -= 1) || cb();
      }
      token.text = code;
      token.escaped = true;
      (pending -= 1) || cb();
    });
  }

  return;
};


/**
 * options
 */

Remarked.prototype.setOptions = function(options) {
  merge(this.options, options);
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