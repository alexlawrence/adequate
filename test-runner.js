import { spawn } from 'child_process';
import { readFile } from 'fs/promises';

import CDP from 'chrome-remote-interface';

const testLibrary = () => {
  const testsToExecute = [],
    descriptionStack = [];

  window.describe = (description, fn) => {
    descriptionStack.push(description);
    fn();
    descriptionStack.pop();
  };
  window.it = (description, fn) =>
    testsToExecute.push({
      label: `${descriptionStack.concat(description).join(' - ')}`,
      fn,
    });
  window.expect = (fn) => {
    if (!fn()) throw new Error(fn.toString());
  };

  const runTests = async () => {
    let test;
    while ((test = testsToExecute.shift())) {
      try {
        await test.fn();
        console.info('✅  ' + test.label);
      } catch (error) {
        console.error('❌  ' + test.label + '\n  -> ' + error.toString());
      }
    }
  };
};

let chromeProcess;
let exitCode = 0;
try {
  const chromeExecutable =
    process.platform == 'darwin'
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : 'google-chrome';
  chromeProcess = spawn(chromeExecutable, ['--headless', '--remote-debugging-port=9222']);
  await new Promise((resolve) =>
    chromeProcess.stderr.on('data', (data) => {
      if (data.toString().includes('listening')) setTimeout(resolve, 200);
    })
  );
  const client = await CDP();
  const testCode = await readFile(process.argv[2], 'utf-8');
  await Promise.all([client.Page.enable(), client.Runtime.enable()]);
  let encounteredError = false;
  client.Runtime.consoleAPICalled((entry) => {
    console[entry.type == 'error' ? 'error' : 'info'](entry.args[0].value);
    encounteredError = encounteredError || entry.type == 'error';
  });
  await client.Runtime.evaluate({
    expression: `new Promise((resolve) => {
      ${testLibrary.toString().replace(/.*?\{([\s\S]*)\}.*?/gm, '$1')}
      ${testCode}
      runTests().then(resolve);
    })`,
    awaitPromise: true,
  });
  exitCode = encounteredError ? 1 : 0;
} catch (error) {
  console.log(error);
  exitCode = 1;
} finally {
  chromeProcess.kill('SIGINT');
  process.exit(exitCode);
}
