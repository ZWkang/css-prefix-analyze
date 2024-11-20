# @zwkang-dev/analyze-css-dirty

> description: to analyze css dirty global style

## Example

```bash
pnpm add @zwkang-dev/analyze-css-dirty

```

```ts
import { analyzeCssFileContent } from '@zwkang-dev/analyze-css-dirty';

const result = analyzeCssFileContent(`
  .a {
    color: red;
  }
  .b {
    color: blue;
  }
`, {
    prefix: 't-',
    ignoreCss: []
});

console.log(result);

// [
//   { selector: '.a', path: '', source: '' },
//   { selector: '.b', path: '', source: '' }
// ]

const result = analyzeCssFileContent(`
  .a {
    color: red;
  }
  .b {
    color: blue;
  }
  .t-icon {
    color: yellow;
  }
`, {
    prefix: 't-',
    ignoreCss: [],
    detail: true,
    source: 'test.css'
});

console.log(result);

// [
//   { selector: '.a', path: 'test.css:2:3', source: 'test.css' },
//   { selector: '.b', path: 'test.css:5:3', source: 'test.css' }
// ]

```

## LICENSE

[MIT](./LICENSE) License © 2022 [zwkang](https://github.com/zwkang)
