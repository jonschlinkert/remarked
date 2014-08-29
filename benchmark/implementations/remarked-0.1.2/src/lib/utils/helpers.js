/*!
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT license.
 *
 * Based on marked <https://github.com/chjj/marked>
 * Copyright (c) 2011-2014, Christopher Jeffrey, contributors.
 * Released under the MIT License (MIT)
 */

'use strict';

exports._noop = function () {};
exports._noop.exec = function () {};
exports._escape = require('./escape');
exports._unescape = require('./unescape');
exports._merge = require('./merge');
