'use strict';

/**
 * Helpers
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

exports._replace = function (regex, opt) {
  regex = regex.source;
  opt = opt || '';

  return function self(name, val) {
    if (!name) {
      return new RegExp(regex, opt);
    }
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
};

exports._noop = function () {};
exports._noop.exec = exports._noop;

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