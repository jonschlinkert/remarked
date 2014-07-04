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
 * GitHub flavored markdown
 */

describe('gfm:', function () {
  describe('gfm_toplevel_paragraphs', function () {
    it('should convert gfm_toplevel_paragraphs', function () {
      var testfile = 'gfm_toplevel_paragraphs';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('gfm_break', function () {
    it('should convert gfm_break', function () {
      var testfile = 'gfm_break.breaks';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('gfm_code', function () {
    it('should convert gfm_code', function () {
      var testfile = 'gfm_code';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('gfm_code_hr_list', function () {
    it('should convert gfm_code_hr_list', function () {
      var testfile = 'gfm_code_hr_list';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('gfm_del', function () {
    it('should convert gfm_del', function () {
      var testfile = 'gfm_del';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('gfm_em', function () {
    it('should convert gfm_em', function () {
      var testfile = 'gfm_em';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('gfm_links', function () {
    it('should convert gfm_links', function () {
      var testfile = 'gfm_links';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('gfm_tables', function () {
    it('should convert gfm_tables', function () {
      var testfile = 'gfm_tables';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });
});