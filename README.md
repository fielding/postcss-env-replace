# PostCSS Env Replace [![Build Status][ci-img]][ci]

[PostCSS] plugin that will replace Templates with environment-specific content.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/stehefan/postcss-env-replace.svg
[ci]:      https://travis-ci.org/stehefan/postcss-env-replace

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

```js
postcss([ require('postcss-env-replace') ])
```

See [PostCSS] docs for examples for your environment.
