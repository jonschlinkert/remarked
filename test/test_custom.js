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
 * Custom
 */


describe('slapdash', function () {
  describe('when a string is passed', function () {
    it('should be parsed as markdown and return HTML', function (done) {
      var fixture = 'foo';
      var actual = marked(fixture);
      helper.writeActual('extras/inline', 'string', actual);
      expect(actual).to.deep.equal('<p>foo</p>\n');
      done();
    });
  });

  describe('when a heading is passed', function () {
    it('should return HTML with standard ', function (done) {
      var fixture = '**foo**';
      var actual = marked(fixture);
      helper.writeActual('extras/inline', 'bold', actual);
      expect(actual).to.deep.equal('<p><strong>foo</strong></p>\n');
      done();
    });
  });

  describe('when a custom heading with random junk is passed', function () {
    it('should return customized HTML', function (done) {
      var fixture = '# One (Two) | Three';
      var actual = marked(fixture);
      helper.writeActual('extras/inline', 'heading-with-junk', actual);
      expect(actual).to.deep.equal('<h1 id="one-two-three">One (Two) | Three</h1>\n');
      done();
    });
  });

  describe('when code is passed with an explicitly defined language', function () {
    xit('should return customized HTML', function (done) {
      var fixture = '```css\n.foo {color: red;}```';
      var actual = marked(fixture);
      helper.writeActual('extras/inline', 'code-block-css', actual);
      expect(actual).to.deep.equal('.foo {color: red;}');
      done();
    });
  });

  describe('when code is passed with an explicitly defined language', function () {
    xit('should return customized HTML', function (done) {
      var highlight = function (code) {
        return require('highlight.js').highlightAuto(code).value;
      };

      var fixture = '```css\n.foo {color: red;}```';
      var actual = marked(fixture, {highlight: highlight});
      helper.writeActual('extras/inline', 'highlight-explicit-lang-css', actual);
      expect(actual).to.deep.equal('.foo {color: red;}');
      done();
    });
  });

  describe('when code is passed with an explicitly defined custom language', function () {
    xit('should return customized HTML', function (done) {
      var fixture = '```less\n.foo {color: red;}```';
      var actual = marked(fixture);
      helper.writeActual('extras/inline', 'highlight-explicit-lang-less', actual);
      expect(actual).to.deep.equal('.foo {color: red;}');
      done();
    });
  });
});