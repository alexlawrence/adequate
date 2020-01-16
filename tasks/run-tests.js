const childProcess = require('child_process');

const chromeExecutableByPlatform = {
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  linux: 'google-chrome',
};

childProcess.execSync(
  `./node_modules/.bin/rollup --no-strict -f iife -i ./dist/src/index.test.js -o ./dist/adequate.test.js`,
  { stdio: 'inherit' }
);

childProcess.execSync('node ./test-runner.js ./dist/adequate.test.js', {
  stdio: 'inherit',
  env: {
    ...process.env,
    CHROME_BIN: chromeExecutableByPlatform[process.platform],
  },
});
