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

var defaults = require('./defaults');
var block = require('./grammar/block');


/**
 * Block lexers
 */

var lexers = [];

// newline
lexers.push(function newline(self, state) {
  var cap = self.rules.newline.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  if (cap[0].length > 1) {
    self.tokens.push({
      type: 'space'
    });
  }

  return true;
});

// code
lexers.push(function code(self, state) {
  var cap = self.rules.code.exec(state.src);

  if (!cap) {
    return false;
  }

  if (self._options.laxSpacing && !self.rules.alnum.exec(state.src[4])) {
    var newSrc = state.src.substring(4);

    if (self.rules.list.exec(newSrc) ||
        self.rules.item.exec(newSrc) ||
        self.rules.blockquote.exec(newSrc) ||
        self.rules.fences.exec(newSrc)) {

      state.src = newSrc;
      return false;
    }
  }

  state.src = state.src.substring(cap[0].length);
  cap = cap[0].replace(/^ {4}/gm, '');
  self.tokens.push({
    type: 'code',
    text: !self._options.pedantic
      ? cap.replace(/\n+$/, '')
      : cap
  });

  return true;
});

// fences (gfm)
lexers.push(function fences(self, state) {
  var cap = self.rules.fences.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  self.tokens.push({
    type: 'code',
    lang: cap[2],
    text: cap[3]
  });

  return true;
});

// heading
lexers.push(function heading(self, state) {
  var cap = self.rules.heading.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  self.tokens.push({
    type: 'heading',
    depth: cap[1].length,
    text: cap[2]
  });

  return true;
});

// table no leading pipe (gfm)
lexers.push(function nptable(self, state) {
  var cap = self.rules.nptable.exec(state.src);

  if (!state.top || !cap) {
    return false;
  }

  var item;

  state.src = state.src.substring(cap[0].length);

  item = {
    type: 'table',
    header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
    align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
    cells: cap[3].replace(/\n$/, '').split('\n')
  };

  for (var i = 0; i < item.align.length; i += 1) {
    if (/^ *-+: *$/.test(item.align[i])) {
      item.align[i] = 'right';
    } else if (/^ *:-+: *$/.test(item.align[i])) {
      item.align[i] = 'center';
    } else if (/^ *:-+ *$/.test(item.align[i])) {
      item.align[i] = 'left';
    } else {
      item.align[i] = null;
    }
  }

  for (i = 0; i < item.cells.length; i += 1) {
    item.cells[i] = item.cells[i].split(/ *\| */);
  }

  self.tokens.push(item);

  return true;
});

// lheading
lexers.push(function lheading(self, state) {
  var cap = self.rules.lheading.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  self.tokens.push({
    type: 'heading',
    depth: cap[2] === '=' ? 1 : 2,
    text: cap[1]
  });

  return true;
});

// hr
lexers.push(function hr(self, state) {
  var cap = self.rules.hr.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  self.tokens.push({
    type: 'hr'
  });

  return true;
});

// blockquote
lexers.push(function blockquote(self, state) {
  var cap = self.rules.blockquote.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);

  self.tokens.push({
    type: 'blockquote_start'
  });

  cap = cap[0].replace(/^ *> ?/gm, '');

  // Pass `top` to keep the current "toplevel" state.
  // This is exactly how markdown.pl works.
  self.token(cap, state.top, true);
  self.tokens.push({
    type: 'blockquote_end'
  });

  return true;
});

// list
lexers.push(function list(self, state) {
  var cap = self.rules.list.exec(state.src);

  if (!cap) {
    return false;
  }

  var bull, i, l, next, space, item, b, loose;

  state.src = state.src.substring(cap[0].length);
  bull = cap[2];
  self.tokens.push({
    type: 'list_start',
    ordered: bull.length > 1
  });

  // Get each top-level item.
  cap = cap[0].match(self.rules.item);
  next = false;
  l = cap.length;
  i = 0;
  for (; i < l; i += 1) {
    item = cap[i];

    // Remove the list item's bullet
    // so it is seen as the next token.
    space = item.length;
    item = item.replace(/^ *([*+-]|\d+\.) +/, '');

    // Outdent whatever the list item contains. Hacky.
    if (~item.indexOf('\n ')) {
      space -= item.length;
      item = !self._options.pedantic
        ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
        : item.replace(/^ {1,4}/gm, '');
    }

    // Determine whether the next list item belongs here.
    // Backpedal if it does not belong in this list.
    if (self._options.smartLists && i !== l - 1) {
      b = block.bullet.exec(cap[i + 1])[0];
      if (bull !== b && !(bull.length > 1 && b.length > 1)) {
        state.src = cap.slice(i + 1).join('\n') + state.src;
        i = l - 1;
      }
    }

    var looseRe = function (item, opts) {
      var re = /\n\n(?!\s*$)/;
      // Use discount behavior.
      if (opts.discountItems) {
        re = /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/;
      }
      return re.test(item);
    };

    // Determine whether item is loose or not.
    loose = next || looseRe(item, self._options);

    if (i !== l - 1) {
      next = item.charAt(item.length - 1) === '\n';
      if (!loose) {
        loose = next;
      }
    }

    self.tokens.push({
      type: loose ? 'loose_item_start' : 'list_item_start'
    });

    // Recurse.
    self.token(item, false, state.bq);
    self.tokens.push({
      type: 'list_item_end'
    });
  }

  self.tokens.push({
    type: 'list_end'
  });

  return true;
});

// html
lexers.push(function html(self, state) {
  var cap = self.rules.html.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  self.tokens.push({
    type: self._options.sanitize
      ? 'paragraph'
      : 'html',
    pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
    text: cap[0]
  });

  return true;
});

// def
lexers.push(function def(self, state) {
  var cap = self.rules.def.exec(state.src);

  if (state.bq || !state.top || !cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  self.tokens.links[cap[1].toLowerCase()] = {
    href: cap[2],
    title: cap[3]
  };

  return true;
});

// table (gfm)
lexers.push(function table(self, state) {
  var cap = self.rules.table.exec(state.src);

  if (!cap || !state.top) {
    return false;
  }

  var item;

  state.src = state.src.substring(cap[0].length);
  item = {
    type: 'table',
    header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
    align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
    cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
  };

  for (var i = 0; i < item.align.length; i += 1) {
    if (/^ *-+: *$/.test(item.align[i])) {
      item.align[i] = 'right';
    } else if (/^ *:-+: *$/.test(item.align[i])) {
      item.align[i] = 'center';
    } else if (/^ *:-+ *$/.test(item.align[i])) {
      item.align[i] = 'left';
    } else {
      item.align[i] = null;
    }
  }

  for (i = 0; i < item.cells.length; i += 1) {
    item.cells[i] = item.cells[i]
      .replace(/^ *\| *| *\| *$/g, '')
      .split(/ *\| */);
  }

  self.tokens.push(item);

  return true;
});

// top-level paragraph
lexers.push(function paragraph(self, state) {
  var cap = self.rules.paragraph.exec(state.src);

  if (!state.top || !cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  self.tokens.push({
    type: 'paragraph',
    text: cap[1].charAt(cap[1].length - 1) === '\n'
      ? cap[1].slice(0, -1)
      : cap[1]
  });

  return true;
});

// text
lexers.push(function text(self, state) {
  var cap = self.rules.text.exec(state.src);

  if (!cap) {
    return false;
  }

  // Top-level should never reach here.
  state.src = state.src.substring(cap[0].length);
  self.tokens.push({
    type: 'text',
    text: cap[0]
  });

  return true;
});


/**
 * Block BlockLexer
 */

function BlockLexer(options) {
  this.tokens = [];
  this.tokens.links = {};

  this._options = options || defaults;
  this.rules = block.normal;

  if (this._options.gfm) {
    if (this._options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }

  this.lexers = [];

  for (var i = 0; i < lexers.length; i++) {
    this.after(null, lexers[i]);
  }
}


/**
 * ## .findByName
 *
 * Find lexer function by name
 *
 * @param  {String} `name` Function name.
 * @return {Number} Index of function in array or -1 if not found
 */
BlockLexer.prototype.findByName = function (name) {
  for (var i = 0; i < this.lexers.length; i++) {
    if (this.lexers[i].name === name) {
      return i;
    }
  }

  return -1;
};


/**
 * ## .at
 *
 * Replace/delete lexer function
 *
 * @param  {String} `name` Function name for replace.
 * @param  {Function} `fn` Lexer function or null to delete.
 */
BlockLexer.prototype.at = function (name, fn) {
  var index = this.findByName(name);
  if (index === -1) {
    throw new Error('Lexer not found: ' + name);
  }

  if (fn) {
    this.lexers[index] = fn;
  } else {
    this.lexers = this.lexers.slice(0, index).concat(this.lexers.slice(index + 1));
  }
};


/**
 * ## .before
 *
 * Add function to lexer chain before one with given name. Or add to start, if name not defined
 *
 * @param  {String} `name` Function name for insert before or null to insert at start.
 * @param  {Function} `fn` Lexer function.
 */
BlockLexer.prototype.before = function (name, fn) {
  if (!name) {
    this.lexers.unshift(fn);
    return;
  }

  var index = this.findByName(name);
  if (index === -1) {
    throw new Error('Lexer not found: ' + name);
  }

  this.lexers.splice(index, 0, fn);
};


/**
 * ## .after
 *
 * Add function to lexer chain after one with given name. Or add to end, if name not defined
 *
 * @param  {String} `name` Function name for insert after or null to insert at end.
 * @param  {Function} `fn` Lexer function.
 */
BlockLexer.prototype.after = function (name, fn) {
  if (!name) {
    this.lexers.push(fn);
    return;
  }

  var index = this.findByName(name);
  if (index === -1) {
    throw new Error('Lexer not found: ' + name);
  }

  this.lexers.splice(index + 1, 0, fn);
};

/**
 * ## .rules
 *
 * Expose block lexing rules
 *
 * @static
 * @type {Object}
 */

BlockLexer.rules = block;


/**
 * ## .lex
 *
 * Block lexer preprocessing method.
 *
 * @param  {String} `src` Markdown string.
 * @return {String}
 */

BlockLexer.prototype.lex = function (src) {
  src = src
    .replace(/\r\n?/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');
  return this.token(src, true);
};


/**
 * ## .token
 *
 * Block lexing method.
 *
 * @param  {String} `src` Raw markdown string.
 * @param  {Boolean} `top` Pass `top` to keep the current "toplevel" state.
 * @param  {Boolean} `bq`
 * @return {Object} Object of tokenized strings.
 */

BlockLexer.prototype.token = function (src, top, bq) {
  src = src.replace(/^ +$/gm, '');

  var i, modified;
  var state = {
    src: src,
    top: top,
    bq: bq
  };

  while (state.src) {
    modified = false;

    for (i = 0; i < this.lexers.length; i++) {
      if (modified = this.lexers[i](this, state)) {
        break;
      }
    }

    if (modified) {
      continue;
    }

    if (state.src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

module.exports = BlockLexer;
