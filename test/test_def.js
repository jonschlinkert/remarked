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
 * Def
 */

xdescribe('def_blocks', function () {
  it('should convert def_blocks', function () {
    var fixture = helper.readFile('def_blocks' + '.md');
    var actual = remarked(fixture);

    helper.writeActual('def_blocks', actual);
    var expected = helper.readFile('def_blocks' + '.html');
    expect(normalize(actual)).to.equal(normalize(expected));
  });
});