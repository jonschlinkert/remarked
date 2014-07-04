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
 * smatypants
 */

describe('smartypants', function () {
  it('should convert text', function () {
    var testfile = 'smartypants_text';
    var fixture = helper.readFile(testfile + '.md');
    var actual = remarked(fixture, {smartypants: true});

    helper.writeActual(testfile, actual);
    var expected = helper.readFile(testfile + '.html');
    expect(normalize(actual)).to.equal(normalize(expected));
  });
});
