/**
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const marked = require('../');
const helper = require('./helpers/utils');
const normalize = helper.normalize;


/**
 * Blockquotes
 */

describe('blockquotes:', function () {

  describe('when an angle bracket is the first thing on a line', function () {
    it('should convert to a blockquote', function (done) {
      var fixture = '> This is a blockquote';
      var actual = marked(fixture);

      var expected = '<blockquote>\n<p>This is a blockquote</p>\n</blockquote>\n';
      expect(normalize(actual)).to.equal(normalize(expected));
      done();
    });
  });

  describe('blockquote_list_item', function () {
    it('should convert blockquote_list_item', function (done) {
      var testfile = 'blockquote_list_item';
      var fixture = helper.readFile(testfile + '.md');
      var actual = marked(fixture);

      helper.writeActual('extras', testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
      done();
    });
  });

  describe('blockquotes_with_code_blocks', function () {
    it('should convert blockquotes_with_code_blocks', function (done) {
      var testfile = 'blockquotes_with_code_blocks';
      var fixture = helper.readFile(testfile + '.md');
      var actual = marked(fixture);

      helper.writeActual('extras', testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
      done();
    });
  });

  describe('lazy_blockquotes', function () {
    it('should convert lazy_blockquotes', function (done) {
      var testfile = 'lazy_blockquotes';
      var fixture = helper.readFile(testfile + '.md');
      var actual = marked(fixture);

      helper.writeActual('extras', testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
      done();
    });
  });

  describe('nested_blockquotes', function () {
    it('should convert nested_blockquotes', function (done) {
      var testfile = 'nested_blockquotes';
      var fixture = helper.readFile(testfile + '.md');
      var actual = marked(fixture);

      helper.writeActual('extras', testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
      done();
    });
  });


  describe('blockquotes_embedded_lists', function () {
    it('should convert blockquotes_embedded_lists', function (done) {
      var testfile = 'blockquotes_embedded_lists';
      var fixture = helper.readFile(testfile + '.md');
      var actual = marked(fixture);

      helper.writeActual('extras', testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
      done();
    });
  });
});