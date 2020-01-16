import childProcess from 'child_process';

childProcess.execSync(
  `./node_modules/.bin/rollup --no-strict -f iife -i ./dist/src/index.test.js -o ./dist/adequate.test.js`,
  { stdio: 'inherit' }
);

childProcess.execSync('node ./test-runner.js ./dist/adequate.test.js', { stdio: 'inherit' });
