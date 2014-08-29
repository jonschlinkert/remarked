/**
 * ## makeTag()
 *
 * Generate HTML tags.
 *
 * **Example**:
 *
 * ```js
 * makeTag('a', {href: 'https://assemble.io'}, 'Assemble');
 * ```
 *
 * Results in:
 *
 * ```
 * <a href="https://assemble.io">Assemble</a>
 * ```
 *
 * @param {String} `tag`
 * @param {Object} `attrs`
 * @param {String} `text`
 * @return {String}
 */

module.exports = function (config) {

  var tag = config.tag;
  var attrs = config.attrs;
  var text = config.text;

  var result = '<' + tag;

  if (attrs && Object.keys(attrs).length) {
    for (var i in attrs) {
      if (attrs[i] && attrs.hasOwnProperty(i)) {
        result += ' ' + i + '="' + attrs[i] + '"';
      }
    }
  }
  result += (text == null) ? '>' : '>' + text + '</' + tag + '>';
  return result;
};