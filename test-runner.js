const { spawn } = require('child_process');
const { readFile } = require('fs').promises;
const CDP = require('chrome-remote-interface');

const testLibrary = () => {
  const testsToExecute = [];
  let descriptionStack = [];

  window.describe = (description, fn) => {
    descriptionStack.push(description);
    fn();
    descriptionStack.pop();
  };
  window.it = (description, fn) => {
    testsToExecute.push({
      label: `${descriptionStack.concat(description).join(' - ')}`,
      fn,
    });
  };
  window.expect = fn => {
    if (!fn()) throw new Error(fn.toString());
  };

  const runTests = async () => {
    while (testsToExecute.length) {
      let test = testsToExecute.shift();
      try {
        await test.fn();
        console.info('✅  ' + test.label);
      } catch (error) {
        console.error('❌  ' + test.label + '\n  -> ' + error.toString());
      }
    }
  };
};

(async () => {
  let chromeProcess,
    exitCode = 0;
  try {
    chromeProcess = spawn(process.env.CHROME_BIN, ['--headless', '--remote-debugging-port=9222']);
    await new Promise(resolve =>
      chromeProcess.stderr.on('data', data => {
        if (data.toString().includes('listening')) setTimeout(resolve, 200);
      })
    );
    const client = await CDP();
    const { Page, Runtime } = client;
    const testCode = await readFile(process.argv[2], 'utf-8');
    await Promise.all([Page.enable(), Runtime.enable()]);
    const consoleEntries = [];
    Runtime.consoleAPICalled(entry => consoleEntries.push(entry));
    await Runtime.evaluate({
      expression: `new Promise((resolve) => {
        ${testLibrary.toString().replace(/.*?\{([\s\S]*)\}.*?/gm, '$1')}
        ${testCode}
        runTests().then(resolve);
      })`,
      awaitPromise: true,
    });
    console.log(consoleEntries.map(entry => entry.args[0].value).join('\n'));
    exitCode = consoleEntries.some(entry => entry.type == 'error') ? 1 : 0;
  } catch (error) {
    console.log(error);
    exitCode = 1;
  } finally {
    chromeProcess.kill('SIGINT');
    process.exit(exitCode);
  }
})();
