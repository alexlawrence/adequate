const childProcess = require('child_process');
const fs = require('fs');

const exec = command => childProcess.execSync(command, { stdio: 'inherit' });

const buildExample = name => {
  exec(
    `./node_modules/.bin/rollup --no-strict -f iife -i ./examples/${name}/index.js -o ./dist/examples/${name}/index.js`
  );
  fs.copyFileSync(`./examples/${name}/index.html`, `./dist/examples/${name}/index.html`);
};

fs.rmdirSync('./dist/examples', { recursive: true });
buildExample('counting-game');
buildExample('repl');
