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
 * emphasis
 */

describe('strong', function () {
  describe('basic strong', function () {
    it('should convert basic strong', function () {
      var actual = remarked('**simple**');
      var expected = '<p><strong>simple</strong></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('multiple strong tags', function () {
    it('should convert multiple strong tags with both ** and __', function () {
      var actual = remarked('__**simple**__');
      var expected = '<p><strong><strong>simple</strong></strong></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('uneven strong tags', function () {
    it('should convert uneven strong tags', function () {
      var actual = remarked('____**simple**__');
      var expected = '<p><strong>__<strong>simple</strong></strong></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
    it('should convert uneven strong tags', function () {
      var actual = remarked('____**simple****__');
      var expected = '<p><strong>__<strong>simple**</strong></strong></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('improperly nested strong tags', function () {
    it('should ignore improperly nested strong tags.', function () {
      var actual = remarked('__**simple__**');
      var expected = '<p><strong>**simple</strong>**</p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('nested strong', function () {
    it('should convert nested strong tags', function () {
      var actual = remarked('**test** **test**** test**\n\n__test ____test____ test__');
      var expected = '<p><strong>test</strong> <strong>test**</strong>test**</p><p><strong>test__</strong>test<strong>__test</strong></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('multiline strong', function () {
    it('should convert nested strong tags', function () {
      var actual = remarked('**this is a multiline \nemphasis test**');
      var expected = '<p><strong>this is a multiline \nemphasis test</strong></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });

    it('should convert nested strong tags', function () {
      var actual = remarked('**this is a\n multiline \nemphasis test**');
      var expected = '<p><strong>this is a\n multiline \nemphasis test</strong></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('multiline strong', function () {
    it('should convert nested strong tags', function () {
      var actual = remarked('__a_________b_________c_________d_________e_________f__');
      var expected = '<p><strong>a<strong>___</strong></strong>b<strong><strong>_</strong></strong>c<strong><strong>_</strong></strong>d<strong><strong>_</strong></strong>e<strong><strong>_</strong></strong>f__</p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });
});