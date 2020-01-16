const childProcess = require('child_process');
const fs = require('fs');

const exec = command => childProcess.execSync(command, { stdio: 'inherit' });

fs.rmdirSync('./dist/src', { recursive: true });
exec('./node_modules/.bin/tsc');
exec('./node_modules/.bin/tsc --declaration --emitDeclarationOnly --out dist/adequate.js');
exec(`./node_modules/.bin/rollup --no-strict -f iife -i ./dist/src/index.js -o ./dist/adequate.js`);
exec(
  `./node_modules/.bin/rollup --no-strict -f esm -i ./dist/src/index.module.js -o ./dist/adequate.module.js`
);
exec(
  './node_modules/.bin/terser -cm --mangle-props regex=/_$/ -o ./dist/adequate.min.js ./dist/adequate.js'
);

fs.writeFileSync(
  './dist/adequate.min.js',
  fs.readFileSync('./dist/adequate.min.js', 'utf-8').replace(/const /g, 'let ')
);

fs.copyFileSync('./dist/adequate.min.js', './comparison/adequate@latest/adequate.min.js');
