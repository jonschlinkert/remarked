/**
 * Headings template
 *
 * @type {String}
 */

module.exports = '<h<%= level %> id="<%= slugify(raw) %>"><%= text %></h<%= level %>>\n';
