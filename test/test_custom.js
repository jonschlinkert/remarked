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
 * Custom
 */

describe('custom', function () {
  describe('when a string is passed', function () {
    it('should be parsed as markdown and return HTML', function () {
      var fixture = 'foo';
      var actual = remarked(fixture);
      helper.writeActual('inline/string', actual);
      expect(actual).to.deep.equal('<p>foo</p>\n');
    });
  });

  describe('when a heading is passed', function () {
    it('should return HTML with standard ', function () {
      var fixture = '**foo**';
      var actual = remarked(fixture);
      helper.writeActual('inline/bold', actual);
      expect(actual).to.deep.equal('<p><strong>foo</strong></p>\n');
    });
  });

  describe('when a custom heading with random junk is passed', function () {
    it('should return customized HTML', function () {
      var fixture = '# One (Two) | Three';
      var actual = remarked(fixture);
      helper.writeActual('inline/heading-with-junk', actual);
      expect(actual).to.deep.equal('<h1 id="one-two-three">One (Two) | Three</h1>\n');
    });
  });

  describe('when code is passed with an explicitly defined language', function () {
    it('should append the defined language to the class in the `code` tag', function () {
      var fixture = '```css\n.foo {color: red;}```';
      var actual = remarked(fixture);
      var expected = '<pre><code class="lang-css">.foo {color: red;}\n</code></pre>\n';
      expect(actual).to.deep.equal(expected);
    });

    it('should append the defined language to the class in the `code` tag', function () {
      var fixture = '```zzz\n.foo {color: red;}```';
      var actual = remarked(fixture);
      var expected = '<pre><code class="lang-zzz">.foo {color: red;}\n</code></pre>\n';
      expect(actual).to.deep.equal(expected);
    });
  });
});