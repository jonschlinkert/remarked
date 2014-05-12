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
 * escaping
 */

describe('escaping', function () {
  describe('backslash_escapes', function () {
    it('should convert backslash_escapes', function (done) {
      var testfile = 'backslash_escapes';
      var fixture = helper.readFile(testfile + '.md');
      var actual = marked(fixture);

      helper.writeActual('extras', testfile, actual);
      var expected = helper.readFile(testfile + '.html');
      expect(normalize(actual)).to.equal(normalize(expected));
      done();
    });
  });

  describe('when an angle bracket is escaped', function () {
    it('it should be preserved in the rendered HTML', function (done) {
      var actual = marked('\\>');
      expect(actual).to.deep.equal('<p>></p>\n');
      done();
    });

    xit('it should be preserved in the rendered HTML', function (done) {
      var actual = marked('\\<\\>');
      expect(actual).to.deep.equal('<p><></p>\n');
      done();
    });
  });
});
