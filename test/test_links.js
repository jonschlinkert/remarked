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


/**
 * links
 */

describe('links', function () {
  describe('autolinks', function () {
    it('should convert autolinks to a tags, wrapped in paragraph tags', function () {
      var actual = remarked('<http://example.com>');
      var expected = '<p><a href="http://example.com">http://example.com</a></p>\n';
      expect(normalize(actual)).to.equal(normalize(expected));
    });

    it('should preserve newlines when converting mixed paragraph text and autolinks', function () {
      var actual = remarked('hello world\n<http://example.com>');
      var expected = '<p>hello world\n<a href="http://example.com">http://example.com</a></p>\n';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('auto_links', function () {
    it('should convert auto_links', function () {
      var testfile = 'auto_links';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('case_insensitive_refs', function () {
    it('should convert case_insensitive_refs', function () {
      var testfile = 'links_case_insensitive_refs';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });


  describe('double_link', function () {
    it('should convert double_link', function () {
      var testfile = 'double_link';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });


  describe('links_inline_style', function () {
    it('should convert links_inline_style', function () {
      var testfile = 'links_inline_style';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('links_reference_style', function () {
    it('should convert links_reference_style', function () {
      var testfile = 'links_reference_style';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('links_shortcut_references', function () {
    it('should convert links_shortcut_references', function () {
      var testfile = 'links_shortcut_references';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });


  describe('nested_square_link', function () {
    it('should convert nested_square_link', function () {
      var testfile = 'nested_square_link';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('not_a_link', function () {
    it('should convert not_a_link', function () {
      var testfile = 'not_a_link';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('literal_quotes_in_titles', function () {
    it('should convert literal_quotes_in_titles', function () {
      var testfile = 'links_literal_quotes_in_titles';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('when a link reference is in parentheses', function () {
    it('should convert ref_paren', function () {
      var testfile = 'links_ref_paren';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });
});

