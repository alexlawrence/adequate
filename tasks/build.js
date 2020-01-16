import childProcess from 'child_process';
import fs from 'fs';

const exec = (command) => childProcess.execSync(command, { stdio: 'inherit' });

fs.rmdirSync('./dist', { recursive: true, force: true });
exec('npx tsc --declaration --declarationDir dist/types');
exec('npx rollup --no-strict -f iife -i ./dist/src/index.js -o ./dist/adequate.js');
exec('npx rollup --no-strict -f esm -i dist/src/index.module.js -o ./dist/adequate.module.js');
exec('npx terser -cm --mangle-props regex=/_$/ -o dist/adequate.min.js dist/adequate.js');

fs.writeFileSync(
  'dist/adequate.min.js',
  fs
    .readFileSync('dist/adequate.min.js', 'utf-8')
    .replace(/const /g, 'let ')
    .replace(/!function\(\)\{(.*)\}\(\)/m, '(()=>{$1})()')
);
