import '../../dist/adequate';

const { e: element, h: html } = window.adequate;

const counterCode = `
  customElements.define('x-counter', element(() => {
    const [value, setValue] = useState(0);

    return html\`
      <div>Counter: \${value}</div>
      <button onClick="\${() => setValue(value + 1)}">Increment</button>
      <button onClick="\${() => setValue(value - 1)}">Decrement</button>
    \`;
  }));

  document.body.innerHTML = '<x-counter></x-counter>';
`;

customElements.define(
  'x-repl',
  element(function() {
    const onCodeChange = event => {
      const iframeElement = this.querySelector('iframe');
      iframeElement.srcdoc = `
        <div id="main"></div>
        <script src="../../adequate.min.js"></script>
        <script type="text/javascript" sandbox>
          const { e: element, h: html, u: useState } = window.adequate;
          ${event.target.value}
        </script>
      `;
    };
    return html`
      <textarea oninput="${onCodeChange}">${counterCode}</textarea>
      <iframe></iframe>
    `;
  })
);
