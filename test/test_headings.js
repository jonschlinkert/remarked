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
 * headings
 */

describe('headings', function () {
  describe('headings', function () {
    it('should convert headings', function () {
      var markdown = '# Heading\n\nText';
      var html =     '<h1 id="heading">Heading</h1>\n<p>Text</p>\n';

      var actual = remarked(markdown);
      expect(actual).to.deep.equal(html);
    });

    it('should convert custom headings', function () {
      var markdown = '# Heading\n\nText';
      var actual = remarked(markdown);
      expect(actual).to.deep.equal('<h1 id="heading">Heading</h1>\n<p>Text</p>\n');
    });
  });
});
