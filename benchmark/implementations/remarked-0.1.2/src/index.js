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

function remarked(src, options, callback) {
  if (typeof options === 'function' || callback) {
    if (!callback) {
      callback = options;
      options = null;
    }

    options = merge({}, defaults, options);

    var highlight = options.highlight;
    var tokens;
    var pending;
    var i = 0;

    try {
      tokens = Lexer.lex(src, options);
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var cb = function (err) {
      if (err) {
        options.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, options);
      } catch (e) {
        err = e;
      }

      options.highlight = highlight;
      return err ? callback(err) : callback(null, out);
    };


    if (!highlight || highlight.length < 3) {
      return cb();
    }

    delete options.highlight;

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
  }

  try {
    if (options) {
      options = merge({}, defaults, options);
    }
    return Parser.parse(Lexer.lex(src, options), options);
  } catch (e) {
    e.message += '\n  [remarked]: please report this to https://github.com/jonschlinkert/remarked.';
    if ((options || defaults).silent) {
      return '<p>An error occured:</p><pre>' + utils._escape(e.message + '', true) + '</pre>';
    }
    throw e;
  }
}

/**
 * options
 */

remarked.options = remarked.setOptions = function(options) {
  merge(defaults, options);
  return this;
};

remarked.defaults = defaults;


/**
 * Expose
 */

remarked.Parser = Parser;
remarked.parser = Parser.parse;

remarked.Renderer = Renderer;

remarked.Lexer = Lexer;
remarked.lexer = Lexer.lex;

remarked.InlineLexer = InlineLexer
remarked.inlineLexer = InlineLexer.output;


remarked.parse = remarked;

// Export remarked
module.exports = remarked;