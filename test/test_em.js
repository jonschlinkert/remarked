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

describe('emphasis', function () {

  describe('em', function () {
    it('should convert basic em', function () {
      var actual = remarked('*simple*');
      var expected = '<p><em>simple</em></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('multiple ems', function () {
    it('should convert multiple ems with both * and _', function () {
      var actual = remarked('_*simple*_');
      var expected = '<p><em><em>simple</em></em></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('uneven ems', function () {
    it('should convert uneven ems', function () {
      var actual = remarked('__*simple*_');
      var expected = '<p><em>_<em>simple</em></em></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
    it('should convert uneven ems', function () {
      var actual = remarked('__*simple**_');
      var expected = '<p><em>_<em>simple*</em></em></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('improperly nested ems', function () {
    it('should ignore improperly nested ems.', function () {
      var actual = remarked('_*simple_*');
      var expected = '<p><em>*simple</em>*</p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('nested em', function () {
    it('should convert nested_em', function () {
      var actual = remarked('*test **test** test*\n\n_test __test__ test_');
      var expected = '<p><em>test <strong>test</strong> test</em></p>\n<p><em>test <strong>test</strong> test</em></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('multiline em', function () {
    it('should convert nested_em', function () {
      var actual = remarked('*this is a multiline \nemphasis test*');
      var expected = '<p><em>this is a multiline \nemphasis test</em></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });

    it('should convert nested_em', function () {
      var actual = remarked('*this is a\n multiline \nemphasis test*');
      var expected = '<p><em>this is a\n multiline \nemphasis test</em></p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('multiline em', function () {
    it('should convert nested_em', function () {
      var actual = remarked('_a__________b__________c__________d__________e__________f');
      var expected = '<p>_a<strong><strong>__</strong></strong>b<strong><strong>__</strong></strong>c<strong><strong>__</strong></strong>d<strong><strong>__</strong></strong>e<strong><strong>__</strong></strong>f</p>';
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });
});