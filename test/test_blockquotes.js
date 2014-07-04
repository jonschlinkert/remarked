/**
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var expect = require('chai').expect;
var remarked = require('../');
var helper = require('./helpers/utils');
var normalize = helper.stripSpaces;

// console.log(remarked)


/**
 * Blockquotes
 */

describe('blockquotes:', function () {
  describe('when an angle bracket is the first thing on a line', function () {
    it('should convert to a blockquote', function () {
      var fixture = '> This is a blockquote';
      var actual = remarked(fixture);

      var expected = '<blockquote>\n<p>This is a blockquote</p>\n</blockquote>\n';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('blockquote_list_item', function () {
    it('should convert blockquote_list_item', function () {
      var testfile = 'blockquote_list_item';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('blockquotes_with_code_blocks', function () {
    it('should convert blockquotes_with_code_blocks', function () {
      var testfile = 'blockquotes_with_code_blocks';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('lazy_blockquotes', function () {
    it('should convert lazy_blockquotes', function () {
      var testfile = 'lazy_blockquotes';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('nested_blockquotes', function () {
    it('should convert nested_blockquotes', function () {
      var testfile = 'nested_blockquotes';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });


  describe('blockquotes_embedded_lists', function () {
    it('should convert blockquotes_embedded_lists', function () {
      var testfile = 'blockquotes_embedded_lists';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });
});