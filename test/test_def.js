/**
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const expect = require('chai').expect;
const pretty = require('js-beautify').html;
const marked = require('../');
const helper = require('./helpers/utils');
const normalize = helper.normalize;
const prettify = !!~process.argv.indexOf('foo');

var arr = ['one', 'two', 'three'];
!!~arr.indexOf('two')

// var value;
// for (var index in process.argv) {
//   var str = process.argv[index];
//   if (str.indexOf("--apiKey") == 0) {
//     value = str.substr(9);
//   }
// }


/**
 * Def
 */

xdescribe('def_blocks', function () {
  it('should convert def_blocks', function (done) {
    var fixture = helper.readFile('def_blocks' + '.md');
    var actual = marked(fixture);

    helper.writeActual('extras', 'def_blocks', actual);
    var expected = helper.readFile('def_blocks' + '.html');
    expect(normalize(actual)).to.equal(normalize(expected));
  });
});