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
 * paragraphs
 */

describe('paragraphs', function () {

  describe('when a simple string is passed', function () {
    it('it should be wrapped in paragraph tags, ending with a newline', function () {
      var actual = remarked('foo');
      expect(actual).to.deep.equal('<p>foo</p>\n');
    });
  });
});