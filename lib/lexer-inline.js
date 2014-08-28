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
var inline = require('./grammar/inline');
var Renderer = require('./renderer');
var utils = require('./utils/helpers');


/**
 * Inline lexers
 */

var lexers = [];

// escape
lexers.push(function escape(self, state) {
  var cap = self.rules.escape.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  state.out += cap[1];

  return true;
});

// autolink
lexers.push(function autolink(self, state) {
  var cap = self.rules.autolink.exec(state.src);

  if (!cap) {
    return false;
  }

  var text, href;

  state.src = state.src.substring(cap[0].length);
  if (cap[2] === '@') {
    text = cap[1].charAt(6) === ':'
      ? self.mangle(cap[1].substring(7))
      : self.mangle(cap[1]);

    href = self.mangle('mailto:') + text;
  } else {
    text = utils._escape(cap[1]);
    href = text;
  }
  state.out += self.renderer.link(href, null, text);

  return true;
});

// url (gfm)
lexers.push(function url(self, state) {
  var cap = self.rules.url.exec(state.src);

  if (!cap || self.inLink) {
    return false;
  }

  var text, href;

  state.src = state.src.substring(cap[0].length);
  text = utils._escape(cap[1]);
  href = text;
  state.out += self.renderer.link(href, null, text);

  return true;
});

// tag
lexers.push(function tag(self, state) {
  var cap = self.rules.tag.exec(state.src);

  if (!cap) {
    return false;
  }

  if (!self.inLink && /^<a /i.test(cap[0])) {
    self.inLink = true;
  } else if (self.inLink && /^<\/a>/i.test(cap[0])) {
    self.inLink = false;
  }

  state.src = state.src.substring(cap[0].length);
  state.out += self._options.sanitize
    ? utils._escape(cap[0])
    : cap[0];

  return true;
});

// link
lexers.push(function link(self, state) {
  var cap = self.rules.link.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  self.inLink = true;
  state.out += self.outputLink(cap, {
    href: cap[2],
    title: cap[3]
  });
  self.inLink = false;

  return true;
});

// reflink, nolink
lexers.push(function reflink(self, state) {
  var cap = self.rules.reflink.exec(state.src) || self.rules.nolink.exec(state.src);

  if (!cap) {
    return false;
  }

  var link;

  state.src = state.src.substring(cap[0].length);
  link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
  link = self.links[link.toLowerCase()];
  if (!link || !link.href) {
    state.out += cap[0].charAt(0);
    state.src = cap[0].substring(1) + state.src;
    return true;
  }

  self.inLink = true;
  state.out += self.outputLink(cap, link);
  self.inLink = false;

  return true;
});

// strong
lexers.push(function strong(self, state) {
  var cap = self.rules.strong.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  state.out += self.renderer.strong(self.output(cap[2] || cap[1]));

  return true;
});

// em
lexers.push(function em(self, state) {
  var cap = self.rules.em.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  state.out += self.renderer.em(self.output(cap[2] || cap[1]));

  return true;
});

// code
lexers.push(function code(self, state) {
  var cap = self.rules.code.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  state.out += self.renderer.codespan(utils._escape(cap[2], true));

  return true;
});

// br
lexers.push(function br(self, state) {
  var cap = self.rules.br.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  state.out += self.renderer.br();

  return true;
});

// del (gfm)
lexers.push(function del(self, state) {
  var cap = self.rules.del.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);
  state.out += self.renderer.del(self.output(cap[1]));

  return true;
});

// text
lexers.push(function text(self, state) {
  var cap = self.rules.text.exec(state.src);

  if (!cap) {
    return false;
  }

  state.src = state.src.substring(cap[0].length);

  // options.smartypants?
  if (self._options.smartypants) {
    state.out += utils._escape(self.smartypants(cap[0]));
  } else {
    state.out += utils._escape(cap[0]);
  }

  return true;
});

/**
 * ## InlineLexer
 *
 * Inline Lexer & Compiler.
 *
 * **Example:**
 *
 * ```js
 * var lexer = new InlineLexer(links, options);
 * ```
 *
 * @class `InlineLexer`
 * @param {Object} `links` Example: `{foo: href: '', title: ''}`.
 *                         Each `link` object may consist of:
 *     @property {String} `href`
 *     @property {String} `title`
 *     @property {String} `alt`
 * @param {Object} `options` Remarked options.
 * @constructor
 * @api private
 */

var InlineLexer = function InlineLexer(links, options) {
  if (!options) {
    options = links;
    links = null;
  }

  this.rules = inline.normal;

  this._options = options || defaults;
  this.renderer = this._options.renderer || new Renderer(this._options);
  this.renderer.options = this._options;

  if (this._options.gfm) {
    if (this._options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this._options.pedantic) {
    this.rules = inline.pedantic;
  }

  this.lexers = [];

  for (var i = 0; i < lexers.length; i++) {
    this.after(null, lexers[i]);
  }

  if (links) {
    this.setup(links);
  }
};


/**
 * ## .setup
 *
 * Setup lexer before usage
 *
 * @param {Object} `links` Example: `{foo: href: '', title: ''}`.
 *                         Each `link` object may consist of:
 *     @property {String} `href`
 *     @property {String} `title`
 *     @property {String} `alt`
 * @api public
 */
InlineLexer.prototype.setup = function (links) {
  this.links = links;
  this.inLink = false;
};


/**
 * ## .findByName
 *
 * Find lexer function by name
 *
 * @param  {String} `name` Function name.
 * @return {Number} Index of function in array or -1 if not found
 */
InlineLexer.prototype.findByName = function (name) {
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
InlineLexer.prototype.at = function (name, fn) {
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
InlineLexer.prototype.before = function (name, fn) {
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
InlineLexer.prototype.after = function (name, fn) {
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
 * Expose inline lexing rules
 *
 * @static
 * @type {Object}
 */

InlineLexer.rules = inline;


/**
 * ## .output
 *
 * Expose static lexing method.
 *
 * @static
 * @param  {String} `src` Markdown string.
 * @param  {String} `links`
 * @param  {String} `options`
 * @return {String}
 * @api public
 */

InlineLexer.output = function (src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};


/**
 * ## .output
 *
 * Lexer output method.
 *
 * @param  {String} `src`
 * @return {String}
 */

InlineLexer.prototype.output = function (src) {
  var i, modified;

  var state = {
    src: src,
    out: ''
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

  return state.out;
};


/**
 * ## .outputLink
 *
 * Compile markdown links and reference links.
 *
 * @param  {Array} `cap` Array of link parts.
 * @param  {String} `link`
 * @return {String}
 */

InlineLexer.prototype.outputLink = function (cap, link) {
  var href = utils._escape(link.href);
  var title = link.title ? utils._escape(link.title) : null;

  if (cap[0].charAt(0) !== '!') {
    return this.renderer.link(href, title, this.output(cap[1]));
  }
  return this.renderer.image(href, title, utils._escape(cap[1]));
};


/**
 * ## .smartypants
 *
 * Smartypants Transformations.
 *
 * @param  {String} `str` Markdown string to transform.
 * @return {String}
 */

InlineLexer.prototype.smartypants = function (str) {
  return str
    .replace(/--/g, '\u2014')                              // em-dashes
    .replace(/(^|[-\u2014\/(\[{"\s])'/g, '$1\u2018')       // opening singles
    .replace(/'/g, '\u2019')                               // closing singles & apostrophes
    .replace(/(^|[-\u2014\/(\[{\u2018\s])"/g, '$1\u201c')  // opening doubles
    .replace(/"/g, '\u201d')                               // closing doubles
    .replace(/\.{3}/g, '\u2026');                          // ellipses
};


/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function (str) {
  var out = '';
  var l = str.length;
  var i = 0;
  var ch;
  for (; i < l; i += 1) {
    ch = str.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }
  return out;
};

module.exports = InlineLexer;
