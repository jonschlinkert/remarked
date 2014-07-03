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
var normalize = helper.normalize;


/**
 * complex
 */

describe('complex', function () {
  describe('complex_mixture', function () {
    it('should convert complex_mixture', function (done) {
      var testfile = 'complex_mixture';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual('extras', testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
      done();
    });
  });

  describe('markdown_documentation_basics', function () {
    it('should convert markdown_documentation_basics', function (done) {
      var testfile = 'markdown_documentation_basics';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual('extras', testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
      done();
    });
  });

  describe('markdown_documentation_syntax', function () {
    it('should convert markdown_documentation_syntax', function (done) {
      var testfile = 'markdown_documentation_syntax';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual('extras', testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
      done();
    });
  });
});