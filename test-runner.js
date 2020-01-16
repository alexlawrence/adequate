const { spawn } = require('child_process');
const { readFile } = require('fs').promises;
const CDP = require('chrome-remote-interface');

const testLibrary = () => {
  let indentationLevel = 0;
  const indent = input => ' '.repeat(indentationLevel) + input;

  window.describe = (description, fn) => {
    console.log(indent(description));
    indentationLevel += 2;
    fn();
    indentationLevel -= 2;
  };
  window.it = (description, fn) => {
    try {
      fn();
      console.info(indent('✅  ' + description));
    } catch (error) {
      console.error(indent('❌  ' + description + '\n  -> ' + error.toString()));
    }
  };
  window.expect = fn => {
    if (!fn()) throw new Error(fn.toString());
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
      expression: testLibrary.toString().replace(/.*?\{([\s\S]*)\}.*?/gm, '$1') + testCode,
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
