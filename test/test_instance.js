/**
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var expect = require('chai').expect;
var Remarked = require('../');
var helper = require('./helpers/utils');
var normalize = helper.stripSpaces;

describe('instance', function () {
  it('should convert complex_mixture', function () {
    var remarked = new Remarked();

    var testfile = 'complex_mixture';
    var fixture = helper.readFile(testfile + '.md');
    var actual = remarked.parse(fixture);

    helper.writeActual(testfile, actual);
    var expected = helper.readFile(testfile + '.html');
    expect(normalize(actual)).to.equal(normalize(expected));
  });
});
