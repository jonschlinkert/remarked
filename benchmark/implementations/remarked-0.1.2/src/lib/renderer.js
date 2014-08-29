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

var template = require('template');
var templates = require('./templates');
var slugify = require('./utils/slugify');
var utils = require('./utils/helpers');


/**
 * Renderer
 *
 * @param {String} `options`
 * @api public
 */

var Renderer = function Renderer(options) {
  this.options = options || {};
};

/**
 * ## .code
 *
 * @param  {String} `code`
 * @param  {String} `lang`
 * @param  {Boolean} `escaped`
 * @return {String}
 */

Renderer.prototype.code = function (code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>' + (escaped ? code : utils._escape(code, true)) + '\n</code></pre>';
  }

  return '<pre><code class="' + this.options.langPrefix + utils._escape(lang, true) + '">' + (escaped ? code : utils._escape(code, true)) + '\n</code></pre>\n';
};


/**
 * ## .blockquote
 *
 * @param  {String} `quote`
 * @return {String}
 */

Renderer.prototype.blockquote = function (quote) {
  return template(templates.blockquote, {quote: quote});
};


/**
 * ## .html
 *
 * @param  {String} `html`
 * @return {String}
 */

Renderer.prototype.html = function (html) {
  return html;
};


/**
 * ## .heading
 *
 * @param  {String} `quote` The heading text.
 * @param  {Number} `level` Heading level (e.g. h1, h2, h3...)
 * @param  {Boolean} `raw`
 * @return {String}
 */

Renderer.prototype.heading = function (text, level, raw) {
  // var obj = {
  //   slugify: slugify,
  //   tag: 'h' + level,
  //   level: level,
  //   text: text,
  //   raw: raw
  // };
  // console.log(makeTag(obj));

  return template(templates.heading, {
    slugify: slugify,
    level: level,
    text: text,
    raw: raw
  });
};


/**
 * ## .hr
 *
 * Define `xhtml: true` in the options to generate xhtml, e.g. `<hr/>`.
 *
 * @return {String} `<hr>` | `<hr/>`
 */

Renderer.prototype.hr = function () {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};


/**
 * ## .list
 *
 * @param  {String} `body`
 * @param  {Boolean} `ordered` List type. Set to `true` for ordered lists.
 * @return {String}
 */

Renderer.prototype.list = function (body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};


/**
 * ## .listitme
 *
 * @param  {String} `text`
 * @return {String}
 */

Renderer.prototype.listitem = function (text) {
  return '<li>' + text + '</li>\n';
};


/**
 * ## .paragraph
 *
 * @param  {String} `txt`
 * @return {String}
 */

Renderer.prototype.paragraph = function (text) {
  return '<p>' + text + '</p>\n';
};


/**
 * ## .table
 *
 * @param  {String} `header`
 * @param  {String} `body`
 * @return {String}
 */

Renderer.prototype.table = function (header, body) {
  return '<table>\n' + '<thead>\n' + header + '</thead>\n' + '<tbody>\n' + body + '</tbody>\n' + '</table>\n';
};


/**
 * ## .tablerow
 *
 * @param  {String} `content`
 * @return {String}
 */

Renderer.prototype.tablerow = function (content) {
  return '<tr>\n' + content + '</tr>\n';
};


/**
 * ## .tablecell
 *
 * @param  {String} `content`
 * @param  {String} `flags`
 * @return {String}
 */

Renderer.prototype.tablecell = function (content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align ? '<' + type + ' style="text-align:' + flags.align + '">' : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};


/**
 * ## .strong
 *
 * Span level renderer.
 *
 * @param  {String} `txt`
 * @return {String}
 */

Renderer.prototype.strong = function (text) {
  if (!text) {
    return '';
  }
  return '<strong>' + text + '</strong>';
};


/**
 * ## .em
 *
 * Span level renderer.
 *
 * @param  {String} `txt`
 * @return {String}
 */

Renderer.prototype.em = function (text) {
  if (text.length > 0) {
    return '<em>' + text + '</em>';
  }
  return '';
};


/**
 * ## .codespan
 *
 * Span level renderer.
 *
 * @param  {String} `txt`
 * @return {String}
 */

Renderer.prototype.codespan = function (text) {
  return '<code>' + text + '</code>';
};


/**
 * ## .br
 *
 * Span level renderer.
 *
 * @return {String} `<br/>` | `<br>`
 */

Renderer.prototype.br = function () {
  return this.options.xhtml ? '<br/>' : '<br>';
};


/**
 * ## .del
 *
 * Span level renderer.
 *
 * @param {String} `text`
 * @return {String}
 */

Renderer.prototype.del = function (text) {
  return '<del>' + text + '</del>';
};


/**
 * ## .link
 *
 * Span level renderer.
 *
 * @param {String} `href`
 * @param {String} `title`
 * @param {String} `text`
 * @return {String}
 */

Renderer.prototype.link = function (href, title, text) {
  var prot;
  if (this.options.sanitize) {
    try {
      prot = decodeURIComponent(utils._unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
      text = utils._unescape(text);
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript\\:') === 0) {
      return '';
    }
  }
  var html = '<a href="' + href + '"';
  if (title) {
    html += ' title="' + title + '"';
  }
  html += '>' + text + '</a>';
  return html;
};


/**
 * ## .image
 *
 * Span level renderer.
 *
 * @param {String} `href`
 * @param {String} `title`
 * @param {String} `alt`
 * @return {String}
 */

Renderer.prototype.image = function (href, title, alt) {
  var html = '<img src="' + href + '" alt="' + alt + '"';
  if (title) {
    html += ' title="' + title + '"';
  }
  html += this.options.xhtml ? '/>' : '>';
  return html;
};


/**
 * Expose `Renderer`
 */

module.exports = Renderer;
