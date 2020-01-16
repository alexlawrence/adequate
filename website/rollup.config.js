import css from 'rollup-plugin-import-css';
import { string } from 'rollup-plugin-string';

module.exports = [
  {
    input: './website/index.js',
    output: {
      format: 'iife',
      file: 'dist/website/index.js',
    },
    plugins: [css({ output: 'index.css' })],
  },
  {
    input: './website/repl.js',
    output: {
      format: 'iife',
      file: 'dist/website/repl.js',
    },
    plugins: [css({ output: 'repl.css' }), string({ include: 'examples/**/*.js' })],
  },
];
