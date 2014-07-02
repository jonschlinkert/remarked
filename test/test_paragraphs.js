/**
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const marked = require('../');
const helper = require('./helpers/utils');
const normalize = helper.normalize;


/**
 * paragraphs
 */

describe('paragraphs', function () {

  describe('when a simple string is passed', function () {
    it('it should be wrapped in paragraph tags, ending with a newline', function (done) {
      var actual = marked('foo');
      expect(actual).to.deep.equal('<p>foo</p>\n');
      done();
    });
  });
});