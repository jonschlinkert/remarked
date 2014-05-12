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
 * headings
 */


describe('headings', function () {
  describe('headings', function () {
    it('should convert headings', function (done) {
      var markdown = '# Heading\n\nText';
      var html =     '<h1 id="heading">Heading</h1>\n<p>Text</p>\n';

      var actual = marked(markdown);
      expect(actual).to.deep.equal(html);
      done();
    });
  });


  describe('custom headings', function () {
    xit('should convert custom headings', function (done) {
      var markdown = '# Heading\n\nText';
      var html = [
        '<h1>',
        '  <a name="heading" class="anchor" href="#heading">',
        '    <span class="header-link"></span>',
        '  </a>Heading',
        '</h1><p>Text</p>\n'
      ].join('\n');

      var actual = marked(markdown);
      expect(actual).to.deep.equal(html);
      done();
    });
  });
});
