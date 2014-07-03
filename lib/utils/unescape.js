/**
 * Unescape HTML
 *
 * @param   {String} `html`
 * @return  {String}
 */

module.exports = function (html) {
  return html.replace(/&([#\w]+);/g, function (_, str) {
    str = str.toLowerCase()

      // use heuristics to preserve escaped chars
      .replace(/\\</g, '__lt__')
      .replace(/\\>/g, '__gt__;')
      .replace(/\\"/g, '__quot__')
      .replace(/\\'/g, '__39__')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/__lt__/g, '\\<')
      .replace(/__gt__/g, '\\>')
      .replace(/__quot__/g, '"')
      .replace(/__39__/g, '\'');

    if (str.charAt(0) === '#') {
      return str.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(str.substring(2), 16))
        : String.fromCharCode(+str.substring(1));
    }

    return '';
  });
};