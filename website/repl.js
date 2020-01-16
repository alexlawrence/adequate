import './vendor/codemirror-5.51.0/lib/codemirror.css';
import './vendor/codemirror-5.51.0/lib/codemirror.js';
import './vendor/codemirror-5.51.0/theme/ambiance.css';
import './vendor/codemirror-5.51.0/mode/javascript/javascript.js';

import '../dist/adequate.min';

const counterCode = `
  customElements.define('x-counter', element(() => {
    const [value, setValue] = useState(0);

    return html\`
      <div>Counter: \${value}</div>
      <button onclick="\${() => setValue(value + 1)}">Increment</button>
      <button onclick="\${() => setValue(value - 1)}">Decrement</button>
    \`;
  }));

  document.body.innerHTML = '<x-counter></x-counter>';
`;

const codeMirror = CodeMirror.fromTextArea(document.querySelector('textarea'), {
  theme: 'ambiance',
  lineNumbers: true,
});
codeMirror.setValue(counterCode);
codeMirror.on('change', () => {
  const iframeElement = document.querySelector('.repl iframe');
  iframeElement.srcdoc = `
    <div id="main"></div>
    <script src="./adequate.min.js"></script>
    <script type="text/javascript" sandbox>
      const { e: element, h: html, u: useState } = window.adequate;
      ${codeMirror.getValue()}
    </script>
  `;
});
