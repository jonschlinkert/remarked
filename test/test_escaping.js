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
 * escaping
 */

describe('escaping', function () {
  describe('backslash_escapes', function () {
    it('should convert backslash_escapes', function (done) {
      var testfile = 'backslash_escapes';
      var fixture = helper.readFile(testfile + '.md');
      var actual = remarked(fixture);

      helper.writeActual(testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
      done();
    });
  });

  describe('when an angle bracket is escaped', function () {
    it('it should be preserved in the rendered HTML', function (done) {
      var actual = remarked('\\>');
      expect(actual).to.deep.equal('<p>></p>\n');
      done();
    });

    it('it should be preserved in the rendered HTML', function (done) {
      var actual = remarked('\\<');
      expect(actual).to.deep.equal('<p><</p>\n');
      done();
    });

    it('it should be preserved in the rendered HTML', function (done) {
      var actual = remarked('\\<\\>');
      expect(actual).to.deep.equal('<p><></p>\n');
      done();
    });
  });
});
