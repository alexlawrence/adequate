let childRenderCount = 0;
customElements.define(
  'x-child',
  element(() => {
    return html`child render count: ${++childRenderCount}`;
  }),
);

let parentRenderCount = 0;
customElements.define(
  'x-parent',
  element(() => {
    const [counter, setCounter] = useState(0);
    setTimeout(() => setCounter(counter + 1), 1000);
    return html`
      parent render count: ${++parentRenderCount}
      <br />
      <x-child counter="${Math.floor(counter / 2)}"></x-child>
    `;
  }),
);

document.body.innerHTML = `<x-parent></x-parent>`;
