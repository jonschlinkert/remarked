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
 * lists
 */

describe('lists', function () {
  describe('hard_wrapped_paragraphs_with_list_like_lines', function () {
    it('should convert hard_wrapped_paragraphs_with_list_like_lines', function () {
      var testfile = 'hard_wrapped_paragraphs_with_list_like_lines.nogfm';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture, {gfm: false});

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('loose_lists', function () {
    it('should convert loose_lists', function () {
      var testfile = 'loose_lists';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('list_item_text', function () {
    it('should convert list_item_text', function () {
      var testfile = 'list_item_text';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('ordered_and_unordered_lists', function () {
    it('should convert ordered_and_unordered_lists', function () {
      var testfile = 'ordered_and_unordered_lists';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });


  describe('tricky_list', function () {
    it('should convert tricky_list', function () {
      var testfile = 'tricky_list';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });


  describe('same_bullet', function () {
    it('should convert same_bullet', function () {
      var testfile = 'same_bullet';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });
});
