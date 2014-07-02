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

var slugify = require('./utils/slugify');
var utils = require('./utils/helpers');
var templates = require('./templates');
var template = require('template');


/**
 * Renderer
 *
 * @param {String} `options`
 * @api public
 */

function Renderer(options) {
  options = options || {};
  this.options = options;
}


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


Renderer.prototype.blockquote = function (quote) {
  return template(templates.blockquote, {quote: quote});
};


Renderer.prototype.html = function (html) {
  return html;
};


Renderer.prototype.heading = function (text, level, raw) {
  return template(templates.heading, {
    slugify: slugify,
    level: level,
    text: text,
    raw: raw
  });
};


Renderer.prototype.hr = function () {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};


Renderer.prototype.list = function (body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};


Renderer.prototype.listitem = function (text) {
  return '<li>' + text + '</li>\n';
};


Renderer.prototype.paragraph = function (text) {
  return '<p>' + text + '</p>\n';
};


Renderer.prototype.table = function (header, body) {
  return '<table>\n' + '<thead>\n' + header + '</thead>\n' + '<tbody>\n' + body + '</tbody>\n' + '</table>\n';
};


Renderer.prototype.tablerow = function (content) {
  return '<tr>\n' + content + '</tr>\n';
};


Renderer.prototype.tablecell = function (content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align ? '<' + type + ' style="text-align:' + flags.align + '">' : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};


// span level renderer
Renderer.prototype.strong = function (text) {
  return '<strong>' + text + '</strong>';
};


Renderer.prototype.em = function (text) {
  return '<em>' + text + '</em>';
};


Renderer.prototype.codespan = function (text) {
  return '<code>' + text + '</code>';
};


Renderer.prototype.br = function () {
  return this.options.xhtml ? '<br/>' : '<br>';
};


Renderer.prototype.del = function (text) {
  return '<del>' + text + '</del>';
};


Renderer.prototype.link = function (href, title, text) {
  var prot;

  if (this.options.sanitize) {
    try {
      prot = decodeURIComponent(utils._unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript\\:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};


Renderer.prototype.image = function (href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

module.exports = Renderer;