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
  this.links = links;
  this.rules = inline.normal;

  this._options = options || defaults;
  this.renderer = this._options.renderer || new Renderer(this._options);
  this.renderer.options = this._options;

  if (!this.links) {
    throw new Error('Tokens array requires a `links` property.');
  }

  if (this._options.gfm) {
    if (this._options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this._options.pedantic) {
    this.rules = inline.pedantic;
  }
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
  var out = '', link, text, href, cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);

        href = this.mangle('mailto:') + text;
      } else {
        text = utils._escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = utils._escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }

      src = src.substring(cap[0].length);
      out += this._options.sanitize
        ? utils._escape(cap[0])
        : cap[0];

      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(utils._escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);

      // options.smartypants?
      if (this._options.smartypants) {
        out += utils._escape(this.smartypants(cap[0]));
      } else {
        out += utils._escape(cap[0]);
      }

      continue;
    }
    if (src) {
      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
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
