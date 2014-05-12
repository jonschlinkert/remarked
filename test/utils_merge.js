/**
 * slapdash <https://github.com/jonschlinkert/slapdash>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const utils = require('../lib/utils');


describe('utils', function () {
  describe('merge', function () {
    it('should merge objects', function (done) {
      var fixture = {a: 'a', b: 'b', c: 'c'};

      var actual =  utils._merge({}, fixture);
      expect(actual).to.eql(fixture);
      done();
    });

    it('should merge objects from left to right', function (done) {
      var one = {a: 'a', b: 'b', c: 'c'};
      var two = {a: 'b', b: 'c', c: 'd'};

      var actual =  utils._merge({}, one, two);
      expect(actual).to.eql(two);
      done();
    });

    it('should merge objects from left to right', function (done) {
      var one = {a: 'a', b: 'b', c: 'c'};
      var two = {a: 'b', b: 'c', c: 'd'};

      var actual =  utils._merge(one, two);
      expect(actual).to.eql(two);
      done();
    });
  });
});
