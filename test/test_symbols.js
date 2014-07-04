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
 * Language tests
 */

describe('amps_and_angles_encoding', function () {
  it('should convert amps_and_angles_encoding', function () {
    var testfile = 'amps_and_angles_encoding';
    var fixture = helper.readFile(testfile + '.md');
    var actual = remarked(fixture);

    helper.writeActual(testfile, actual);
    var expected = helper.readFile(testfile + '.html');
    expect(normalize(actual)).to.equal(normalize(expected));
  });
});
