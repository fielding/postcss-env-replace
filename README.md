# PostCSS Env Replace [![Build Status][ci-img]][ci]

[PostCSS] plugin that will replace Templates with environment-specific content.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/stehefan/postcss-env-replace.svg
[ci]:      https://travis-ci.org/stehefan/postcss-env-replace

```css
.foo {
    background-image: url(env_replace(BASE_URL)/myAwesomeImage.jpg);
}
```

```css
.foo {
    background-image: url(http://localhost/myAwesomeImage.jpg);
}
```

## Installation
```
npm install postcss-env-replace --save-dev
```

## Usage

```js
postcss([ require('postcss-env-replace')({
    environment: process.env.ENVIRONMENT || 'dev',
    replacements: {
        BASE_URL: {
            prod: 'http://my.site',
            stage: 'http://stage.my.site',
            ci: 'http://ci.my.site',
            dev: 'http://localhost'
        }
    }
}) ])
```
