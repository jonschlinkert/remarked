/**
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var expect = require('chai').expect;
var utils = require('../lib/utils/helpers');


describe('utils', function () {
  describe('merge', function () {
    it('should merge objects', function () {
      var fixture = {a: 'a', b: 'b', c: 'c'};

      var actual =  utils._merge({}, fixture);
      expect(actual).to.eql(fixture);
    });

    it('should merge objects from left to right', function () {
      var one = {a: 'a', b: 'b', c: 'c'};
      var two = {a: 'b', b: 'c', c: 'd'};

      var actual =  utils._merge({}, one, two);
      expect(actual).to.eql(two);
    });

    it('should merge objects from left to right', function () {
      var one = {a: 'a', b: 'b', c: 'c'};
      var two = {a: 'b', b: 'c', c: 'd'};

      var actual =  utils._merge(one, two);
      expect(actual).to.eql(two);
    });
  });
});
