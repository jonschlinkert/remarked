/**
 * Escape HTML.
 *
 * @param   {String} `html`
 * @param   {String} `encode`
 * @return  {String}
 */

module.exports = function (html, encode) {
  var amp = !encode ? new RegExp('&(?!#?\\w+;)', 'g') : /&/g;
  return html
    .replace(/\\&/, '__amp__')
    .replace(amp, '&amp;')
    // use heuristics to preserve escaped chars
    .replace(/\\</g, '__lt__')
    .replace(/\\>/g, '__gt__')
    .replace(/\\"/g, '__quot__')
    .replace(/\\'/g, '__39__')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/__amp__/g, '\\&')
    .replace(/__lt__/g, '\\<')
    .replace(/__gt__/g, '\\>')
    .replace(/__quot__/g, '"')
    .replace(/__39__/g, '\'');
};