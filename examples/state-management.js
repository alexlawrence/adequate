customElements.define(
  'x-counter',
  element(({ start }) => {
    const [value, setValue] = useState(parseInt(start));

    return html`
      <div>Counter: ${value}</div>
      <button onclick="${() => setValue(value + 1)}">Increment</button>
      <button onclick="${() => setValue(value - 1)}">Decrement</button>
    `;
  }),
);

document.body.innerHTML = '<x-counter start="0"></x-counter>';
