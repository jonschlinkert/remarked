/*!
 * Based on marked <https://github.com/chjj/marked>
 * Copyright (c) 2011-2014, Christopher Jeffrey, contributors.
 * Released under the MIT License (MIT)
 */

'use strict';


var InlineLexer = require('./lib/inline-lexer');
var Lexer = require('./lib/lexer');
var Parser = require('./lib/parser');
var Renderer = require('./lib/renderer');

var defaults = require('./lib/defaults');
var utils = require('./lib/utils/helpers');

/**
 * slapdash
 */

function slapdash(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = utils._merge({}, defaults, opt || {});

    var highlight = opt.highlight,
      tokens, pending, i = 0;

    try {
      tokens = Lexer.lex(src, opt);
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function (err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err ? callback(err) : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) {
      return done();
    }

    for (; i < tokens.length; i++) {
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
    if (opt) {
      opt = utils._merge({}, defaults, opt);
    }
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/slapdash.';
    if ((opt || defaults).silent) {
      return '<p>An error occured:</p><pre>' + utils._escape(e.message + '', true) + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

slapdash.options = slapdash.setOptions = function(opt) {
  utils._merge(defaults, opt);
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

slapdash.InlineLexer = InlineLexer;
slapdash.inlineLexer = InlineLexer.output;

slapdash.parse = slapdash;



// Export slapdash
module.exports = slapdash;