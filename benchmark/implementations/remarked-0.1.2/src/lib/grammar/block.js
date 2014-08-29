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

/**
 * Block-Level Grammar
 */

var block = module.exports = {};

block.blockquote = /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/;
block.bullet     = /(?:[*+-]|\d+\.)/;
block.closed     = /<(tag)[\s\S]+?<\/\1>/;
block.closing    = /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/;
block.code       = /^( {4}[^\n]+\n*)+/;
block.comment    = /<!--[\s\S]*?-->/;
block.def        = /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/;
block.heading    = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/;
block.hr         = /^( *[-*_]){3,} *(?:\n+|$)/;
block.html       = /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/;
block.item       = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.lheading   = /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/;
block.list       = /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/;
block.newline    = /^\n+/;
block.paragraph  = /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/;
block.text       = /^[^\n]+/;


block.item = substitute(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = substitute(block.list)
  (/bull/g, block.bullet)
  ('def',   '\\n+(?=' + block.def.source + ')')
  ('hr',    '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ();

block.blockquote = substitute(block.blockquote)
  ('def', block.def)
  ();

var exclusions = [
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'br',
  'cite',
  'code',
  'data',
  'del',
  'dfn',
  'em',
  'i',
  'img',
  'ins',
  'kbd',
  'mark',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
  'wbr'
];

block._tag = '(?!(?:' + exclusions.join('|') + ')\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = substitute(block.html)
  ('comment',    block.comment)
  ('closed',     block.closed)
  ('closing',    block.closing)
  (/tag/g,       block._tag)
  ();

block.paragraph = substitute(block.paragraph)
  ('hr',         block.hr)
  ('heading',    block.heading)
  ('lheading',   block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' +  block._tag)
  ('def',        block.def)
  ();


/**
 * Normal block grammar
 */

block.fences  = utils._noop;
block.nptable = utils._noop;
block.table   = utils._noop;
block.normal  = utils._merge({}, block);


/**
 * GFM
 */


var gfm = {
  fences:    /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  nptable:   /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table:     /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
};

// Paragraphs
gfm.paragraph = substitute(block.paragraph)
  ('(?!', '(?!' + gfm.fences.source.replace('\\1', '\\2') + '|'+ block.list.source.replace('\\1', '\\3') + '|')
  ();


// Block grammar
block.gfm = utils._merge({}, block.normal, {
  fences:    gfm.fences,
  paragraph: gfm.paragraph
});


// GFM + tables block grammar
block.tables = utils._merge({}, block.gfm, {
  nptable: gfm.nptable,
  table:   gfm.table
});