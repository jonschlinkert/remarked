/*!
 * marked - a markdown parser <https://github.com/chjj/marked>
 * Copyright (c) 2011-2014, Christopher Jeffrey, contributors.
 * Released under the MIT License (MIT)
 */
'use strict';


var InlineLexer = require('./inline-lexer');
var Lexer = require('./lexer');
var Parser = require('./parser');
var Renderer = require('./renderer');

var defaults = require('./defaults');
var utils = require('./utils');

/**
 * Marked
 */

function marked(src, opt, callback) {
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
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || defaults).silent) {
      return '<p>An error occured:</p><pre>' + utils._escape(e.message + '', true) + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options = marked.setOptions = function(opt) {
  utils._merge(defaults, opt);
  return marked;
};

marked.defaults = defaults;

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;



// Export marked
module.exports = marked;