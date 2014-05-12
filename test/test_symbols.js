/**
 * slapdash <https://github.com/jonschlinkert/slapdash>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const marked = require('../');
const helper = require('./helpers/utils');
var normalize = helper.normalize;


/**
 * Language tests
 */

describe('amps_and_angles_encoding', function () {
  it('should convert amps_and_angles_encoding', function (done) {
    var testfile = 'amps_and_angles_encoding';
    var fixture = helper.readFile(testfile + '.md');
    var actual = marked(fixture);

    helper.writeActual('extras', testfile, actual);
    var expected = helper.readFile(testfile + '.html');
    expect(normalize(actual)).to.equal(normalize(expected));
    done();
  });
});
