/**
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var expect = require('chai').expect;
var remarked = require('../');
var utils = require('./helpers/utils');
var normalize = utils.stripSpaces;


/**
 * options.highlight
 */

describe('highlight', function () {
  var highlight;

  beforeEach(function() {
    highlight = function (code) {
      return require('highlight.js').highlightAuto(code).value;
    };
  });

  describe('when code is passed with an explicitly defined custom language', function () {
    it('should return customized HTML', function () {
      var fixture = '```css\n.foo {color: red;}```';
      var actual = remarked(fixture, {highlight: highlight});
      utils.writeActual('inline/highlight-explicit-lang-css', actual);

      var expected = utils.readExpected('inline/highlight-explicit-lang-css.html');
      expect(actual).to.deep.equal(expected);
    });

    it('should return customized HTML', function () {
      var fixture = '```less\n.foo {color: red;}```';
      var actual = remarked(fixture, {highlight: highlight});

      utils.writeActual('inline/highlight-explicit-lang-less', actual);
      var expected = utils.readExpected('inline/highlight-explicit-lang-less.html');

      expect(actual).to.deep.equal(expected);
    });
  });
});