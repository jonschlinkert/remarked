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
 * smatypants
 */

describe('smartypants', function () {
  it('should convert text', function (done) {
    var testfile = 'smartypants_text';
    var fixture = helper.readFile(testfile + '.md');
    var actual = marked(fixture, {smartypants: true});

    helper.writeActual('extras', testfile, actual);
    var expected = helper.readFile(testfile + '.html');
    expect(normalize(actual)).to.equal(normalize(expected));
    done();
  });
});
