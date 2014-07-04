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
 * escaping
 */

describe('escaping', function () {
  describe('backslash_escapes', function () {
    it('should convert backslash_escapes', function () {
      var fixture = helper.readFile('backslash_escapes.md');
      var expected = helper.readFile('backslash_escapes.html');

      var actual = remarked(fixture);
      helper.writeActual('backslash_escapes', actual);

      expect(normalize(actual)).to.equal(normalize(expected));
    });
  });

  describe('when an angle bracket is escaped', function () {
    it('it should be preserved in the rendered HTML', function () {
      var actual = remarked('\\>');
      expect(actual).to.deep.equal('<p>></p>\n');
    });

    it('it should be preserved in the rendered HTML', function () {
      var actual = remarked('\\<');
      expect(actual).to.deep.equal('<p><</p>\n');
    });

    it('it should be preserved in the rendered HTML', function () {
      var actual = remarked('\\<\\>');
      expect(actual).to.deep.equal('<p><></p>\n');
    });
  });
});
