/*!
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT license.
 *
 * The code for slugifying was sourced from underscore.string:
 * https://github.com/epeli/underscore.string
 */

var specialChars = require('regexp-special-chars');

function escapeRe (str) {
  if (str == null) {
    return '';
  }
  return String(str)
    .replace(specialChars, '\\$1');
}

function defaultToWhiteSpace (chars) {
  if (chars == null) {
    return '\\s';
  } else if (chars.source) {
    return chars.source;
  } else {
    return '[' + escapeRe(chars) + ']';
  }
}

var trim = function (str, chars) {
  if (str == null) {return ''; }
  if (!chars && String.prototype.trim) {
    return String.prototype.trim.call(str);
  }
  chars = defaultToWhiteSpace(chars);
  var re = new RegExp('^' + chars + '+|' + chars + '+$', 'g');
  return String(str).replace(re, '');
};

var dasherize = function(str){
  return trim(str)
    .replace(/([A-Z])/g, '-$1')
    .replace(/[-_\s]+/g, '-')
    .toLowerCase();
};

var from = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź";
var to = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz";

module.exports = function (str) {
  if (str == null) {
    return '';
  }

  var regex = new RegExp(defaultToWhiteSpace(from), 'g');
  str = String(str).toLowerCase().replace(regex, function (c) {
    var index = from.indexOf(c);
    return to.charAt(index) || '-';
  });
  str = str.replace(/[^\w\s-]/g, '');
  return dasherize(str);
};