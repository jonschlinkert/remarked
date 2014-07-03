/*!
 * remarked <https://github.com/jonschlinkert/remarked>
 *
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT license.
 *
 * The code for slugifying was sourced from underscore.string:
 * https://github.com/epeli/underscore.string
 */

var escapeRe = function (str) {
  if (str == null) {
    return '';
  }
  return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};

var defaultToWhiteSpace = function (chars) {
  if (chars == null) {
    return '\\s';
  } else if (chars.source) {
    return chars.source;
  } else {
    return '[' + escapeRe(chars) + ']';
  }
};

var trim = function (str, chars) {
  if (str == null) {return ''; }
  if (!chars && String.prototype.trim) {
    return String.prototype.trim.call(str);
  }
  chars = defaultToWhiteSpace(chars);
  return String(str).replace(new RegExp('^' + chars + '+|' + chars + '+$', 'g'), '');
};

var dasherize = function(str){
  return trim(str).replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
};


module.exports = function (str) {
  if (str == null) {
    return '';
  }
  var from = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź";
  var to = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz";
  var regex = new RegExp(defaultToWhiteSpace(from), 'g');
  str = String(str).toLowerCase().replace(regex, function (c) {
    var index = from.indexOf(c);
    return to.charAt(index) || '-';
  });
  return dasherize(str.replace(/[^\w\s-]/g, ''));
};