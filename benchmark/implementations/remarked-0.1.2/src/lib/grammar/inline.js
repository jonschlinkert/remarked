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

var utils = require('../utils/helpers');
var substitute = require('../utils/substitute');
var merge = utils._merge;

/**
 * Inline-Level Grammar
 */

var inline = module.exports = {};

var re = function(pattern) {
  return inline[pattern].source;
};

inline.br       = /^ {2,}\n(?!\s*$)/;
inline.code     = /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/;
inline.del      = utils._noop;
inline.escape   = /^\\([\\`*{}\[\]()#+\-.!_><])/;

// Links
inline.autolink = /^<([^ >]+(@|:\/)[^ >]+)>/;
inline.inside   = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline.href     = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;
inline.link     = new RegExp('^!?\\[(' + re('inside') + ')\\]\\(' + re('href') + '\\)');
inline.reflink  = new RegExp('^!?\\[(' + re('inside') + ')\\]\\s*\\[([^\\]]*)\\]');
inline.nolink   = /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/;

// Emphasis
inline.em       = /^\b_([\s\S]*?[^_\s])_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/;
inline.strong   = /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/;

inline.tag      = /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/;
inline.text     = /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/;
inline.url      = utils._noop;


/**
 * Normal inline grammar
 *
 * Clone the `inline` grammar object before further processing.
 */

inline.normal = merge({}, inline);


/**
 * Pedantic inline grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em:     /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});


/**
 * GFM inline grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: substitute(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,

  text: substitute(inline.text)
    (']|', '~]|')
    ('|', '|https?:\\/\\/|')
    ()
});

/**
 * GFM + line breaks inline grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: substitute(inline.br)('{2,}', '*')(),
  text: substitute(inline.gfm.text)('{2,}', '*')()
});
