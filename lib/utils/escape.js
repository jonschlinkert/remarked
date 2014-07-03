/**
 * Escape HTML.
 *
 * @param   {String} `html`
 * @param   {String} `encode`
 * @return  {String}
 */

module.exports = function (html, encode) {
  html = html
    .replace(!encode ? new RegExp('&(?!#?\\w+;)', 'g') : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  return html;
};