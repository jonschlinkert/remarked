/**
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var expect = require('chai').expect;
var remarked = require('../');

describe('.setOptions', function () {
  it('should set options', function () {
    var renderer = new remarked.Renderer();

    remarked.setOptions({
      renderer: renderer,
      gfm: false,
      tables: false,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: false,
      smartypants: false,
      laxSpacing: false
    });

    remarked('');

    // Get options from renderer because no direct access to remarked instance
    var actualOptions = renderer.options;

    expect(actualOptions).to.have.property('gfm', false);
    expect(actualOptions).to.have.property('tables', false);
    expect(actualOptions).to.have.property('breaks', false);
    expect(actualOptions).to.have.property('pedantic', false);
    expect(actualOptions).to.have.property('sanitize', false);
    expect(actualOptions).to.have.property('smartLists', false);
    expect(actualOptions).to.have.property('smartypants', false);
    expect(actualOptions).to.have.property('laxSpacing', false);
  });
});
