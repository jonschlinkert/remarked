/**
 * Unescape HTML
 *
 * @param   {String} `html`
 * @return  {String}
 */

module.exports = function (html) {
  return html.replace(/&([#\w]+);/g, function (_, text) {
    text = text.toLowerCase();
    text = text
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    if (text.charAt(0) === '#') {
      return text.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(text.substring(2), 16))
        : String.fromCharCode(+text.substring(1));
    }
    return '';
  });
};