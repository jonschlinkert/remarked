### Renderer

An object containing functions to render tokens to HTML.

**Example**:

```js
var renderer = new marked.Renderer();
```

Type: `object`

Default: `new Renderer()`


#### Customize renderers

The renderer option allows you to render tokens in a custom manor.

**Example**

Here is an example of overriding the default heading token rendering by adding an embedded anchor tag like on GitHub:

```javascript
var marked = require('marked');
var renderer = new marked.Renderer();

renderer.heading = function (text, level) {
  var slug = text.toLowerCase().replace(/[^\w]+/g, '-');
  return [
    '<h' + level + '>',
    '  <a name="' + slug + '" class="anchor" href="#' + slug + '">',
    '    <span class="header-link"></span>',
    '  </a>' + text,
    '</h' + level + '>'
  ].join('\n');
};

console.log(marked('# heading+', { renderer: renderer }));
```

Results in:

```html
<h1>
  <a name="heading-" class="anchor" href="#heading-">
    <span class="header-link"></span>
  </a>
  heading+
</h1>
```
