const css = require('rollup-plugin-css-only');

module.exports = [
  {
    input: './website/index.js',
    output: {
      format: 'iife',
      file: './dist/website/index.js',
    },
    plugins: [css({ output: './dist/website/index.css' })],
  },
  {
    input: './website/repl.js',
    output: {
      format: 'iife',
      file: './dist/website/repl.js',
    },
    plugins: [css({ output: './dist/website/repl.css' })],
  },
];
