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
var Renderer = require('./renderer');
var InlineLexer = require('./lexer-inline');


/**
 * ## Parser
 *
 * The main parsing and compiling class in remarked.
 *
 * @class `Parser`
 * @constructor
 */

var Parser = module.exports = function Parser(options) {
  this.tokens = [];
  this.token = null;

  this._options = options || defaults;
  this._options.renderer = this._options.renderer || new Renderer(this._options);

  this.renderer = this._options.renderer;
  this.renderer.options = this._options;
};


/**
 * ## .parse
 *
 * @static `parse` method
 */

Parser.parse = function (src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};


/**
 * Parse Loop
 */

Parser.prototype.parse = function (src) {
  this.inline = new InlineLexer(src.links, this._options, this.renderer);
  this.tokens = src.reverse();
  var out = '';
  while (this.next()) {
    out += this.tok();
  }
  return out;
};


/**
 * Next Token
 */

Parser.prototype.next = function () {
  return this.token = this.tokens.pop();
};


/**
 * Preview Next Token
 */

Parser.prototype.peek = function () {
  return this.tokens[this.tokens.length - 1] || 0;
};


/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function () {
  var body = this.token.text;
  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }
  return this.inline.output(body);
};


/**
 * Parse Current Token
 */

Parser.prototype.tok = function () {
  var body, header;

  switch (this.token.type) {
    case 'space':
      return '';
    case 'hr':
      return this.renderer.hr();
    case 'heading':
      return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);
    case 'code':
      return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
    case 'table':
      var i, row, cell, flags, j;
      header = '';
      body = '';

      // Table headers
      cell = '';
      for (i = 0; i < this.token.header.length; i += 1) {
        flags = {
          header: true,
          align: this.token.align[i]
        };
        cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), {
          header: true,
          align: this.token.align[i]
        });
      }

      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i += 1) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j += 1) {
          cell += this.renderer.tablecell(this.inline.output(row[j]), {
            header: false,
            align: this.token.align[j]
          });
        }
        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);

    case 'blockquote_start':
      body = '';
      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }
      return this.renderer.blockquote(body);
    case 'list_start':
      var ordered = this.token.ordered;
      body = '';
      while (this.next().type !== 'list_end') {
        body += this.tok();
      }
      return this.renderer.list(body, ordered);
    case 'list_item_start':
      body = '';
      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text' ? this.parseText() : this.tok();
      }
      return this.renderer.listitem(body);
    case 'loose_item_start':
      body = '';
      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }
      return this.renderer.listitem(body);
    case 'html':
      var html = !this.token.pre
        && !this._options.pedantic
          ? this.inline.output(this.token.text)
          : this.token.text;
      return this.renderer.html(html);
    case 'paragraph':
      return this.renderer.paragraph(this.inline.output(this.token.text));
    case 'text':
      return this.renderer.paragraph(this.parseText());
      break;
  }
};