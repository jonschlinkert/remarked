'use strict';

var utils = require('./utils');

/**
 * Block-Level Grammar
 */

var block = {
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  bullet:     /(?:[*+-]|\d+\.)/,
  code:       /^( {4}[^\n]+\n*)+/,
  def:        /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  fences:     utils._noop,
  heading:    /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  hr:         /^( *[-*_]){3,} *(?:\n+|$)/,
  html:       /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  lheading:   /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  list:       /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  newline:    /^\n+/,
  nptable:    utils._noop,
  paragraph:  /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  table:      utils._noop,
  text:       /^[^\n]+/
};

block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = utils._replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = utils._replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = utils._replace(block.blockquote)
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

block.html = utils._replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = utils._replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = utils._merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = utils._merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = utils._replace(block.paragraph)
  ('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|'+ block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = utils._merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table:   /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});


module.exports = block;