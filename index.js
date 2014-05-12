/*!
 * Based on marked <https://github.com/chjj/marked>
 * Copyright (c) 2011-2014, Christopher Jeffrey, contributors.
 * Released under the MIT License (MIT)
 */

'use strict';

var Lexer = require('./lib/lexer');
var Parser = require('./lib/parser');
var Renderer = require('./lib/renderer');
var InlineLexer = require('./lib/inline-lexer');

var defaults = require('./lib/defaults');
var utils = require('./lib/utils/helpers');

/**
 * slapdash
 */

function slapdash(src, options, callback) {
  if (callback || typeof options === 'function') {
    if (!callback) {
      callback = options;
      options = null;
    }

    options = utils._merge({}, defaults, options || {});

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

    var done = function (err) {
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
      return done();
    }

    delete options.highlight;

    if (!pending) {
      return done();
    }

    for (; i < pending; i++) {
      (function (token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function (err, code) {
          if (err) {
            return done(err);
          }
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }
    return;
  }
  try {
    if (options) {
      options = utils._merge({}, defaults, options);
    }
    return Parser.parse(Lexer.lex(src, options), options);
  } catch (e) {
    e.message += '\n[slapdash]: please report this to https://github.com/jonschlinkert/slapdash.';
    if ((options || defaults).silent) {
      return '<p>An error occured:</p><pre>' + utils._escape(e.message + '', true) + '</pre>';
    }
    throw e;
  }
}

/**
 * options
 */

slapdash.options = slapdash.setOptions = function(options) {
  utils._merge(defaults, options);
  return slapdash;
};

slapdash.defaults = defaults;



/**
 * Expose
 */

slapdash.Parser = Parser;
slapdash.parser = Parser.parse;

slapdash.Renderer = Renderer;

slapdash.Lexer = Lexer;
slapdash.lexer = Lexer.lex;

slapdash.InlineLexer = InlineLexer
slapdash.inlineLexer = InlineLexer.output;


slapdash.parse = slapdash;

// Export slapdash
module.exports = slapdash;