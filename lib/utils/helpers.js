/*!
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT license.
 */

'use strict';

exports._noop = function () {};
exports._noop.exec = exports._noop;


/**
 * Escape HTML.
 *
 * @param   {String} `html`
 * @param   {String} `encode`
 * @return  {String}
 */

exports._escape = function (html, encode) {
  html = html
    .replace(!encode ? new RegExp('&(?!#?\\w+;)', 'g') : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  return html;
};


/**
 * Unescape HTML
 *
 * @param   {String} `html`
 * @return  {String}
 */

exports._unescape = function (html) {
  return html.replace(/&([#\w]+);/g, function (_, n) {
    n = n.toLowerCase();
    if (n === 'colon') {
      return ':';
    }
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
};


exports._replace = function (regex, options) {
  regex = regex.source;
  options = options || '';

  return function self(name, val) {
    if (!name) {
      return new RegExp(regex, options);
    }
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
};


/**
 * Merge `obj` into the given objects.
 *
 * @param {Object} `obj`
 * @return {Object}
 * @api public
 */

exports._merge = function (obj) {
  var i = 1;
  var target;
  var key;
  var len = arguments.length;

  for (; i < len; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
};