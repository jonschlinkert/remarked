'use strict';


var utils = require('./utils/helpers');


/**
 * Inline-Level Grammar
 */

var inline = {
  _href:    /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/,
  _inside:  /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,
  br:       /^ {2,}\n(?!\s*$)/,
  code:     /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  del:      utils._noop,
  escape:   /^\\([\\`*{}\[\]()#+\-.!_>])/,

  // Links
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  link:     /^!?\[(inside)\]\(href\)/,
  nolink:   /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  reflink:  /^!?\[(inside)\]\s*\[([^\]]*)\]/,

  // Emphasis
  em:       /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  strong:   /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,


  tag:      /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  text:     /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/,
  url:      utils._noop
};

inline.link = utils._replace(inline.link)
  ('inside', inline._inside)
  ('href',   inline._href)
  ();

inline.reflink = utils._replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = utils._merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = utils._merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = utils._merge({}, inline.normal, {
  escape: utils._replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: utils._replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = utils._merge({}, inline.gfm, {
  br: utils._replace(inline.br)('{2,}', '*')(),
  text: utils._replace(inline.gfm.text)('{2,}', '*')()
});


module.exports = inline;