import './vendor/codemirror-5.51.0/lib/codemirror.css';
import './vendor/codemirror-5.51.0/lib/codemirror.js';
import './vendor/codemirror-5.51.0/theme/ambiance.css';
import './vendor/codemirror-5.51.0/mode/javascript/javascript.js';

import '../dist/adequate.min';

import examples from './examples';

const codeMirror = CodeMirror.fromTextArea(document.querySelector('textarea'), {
  theme: 'ambiance',
  lineNumbers: true,
});
codeMirror.on('change', () => {
  const iframeElement = document.querySelector('iframe');
  iframeElement.srcdoc = `
    <html>
      <head>
        <link rel="stylesheet" href="./repl-iframe.css">
      </head>
      <body style="padding: 10px">
        <div id="main"></div>
        <script src="./adequate.min.js"></script>
        <script type="text/javascript" sandbox>
          const { e: element, h: html, u: useState } = window.adequate;
          ${codeMirror.getValue()}
        </script>
      </body>
    </html>
  `;
});

const selectElement = document.querySelector('select');
examples.forEach(({ name, code }) => {
  const option = document.createElement('option');
  option.innerText = name;
  option.addEventListener('click', () => {
    codeMirror.setValue(code.trim());
  });
  selectElement.appendChild(option);
});

const firstOptionElement = selectElement.querySelectorAll('option').item(1);
firstOptionElement.click();
firstOptionElement.selected = true;