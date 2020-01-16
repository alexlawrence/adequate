customElements.define(
  'x-settings',
  element(() => {
    return html`
      <x-toggle name="sound" a="on" b="off"></x-toggle>
      <x-toggle name="Vibration" a="on" b="off"></x-toggle>
    `;
  }),
);

customElements.define(
  'x-toggle',
  element(({ name, a, b }) => {
    const [activeValue, setActiveValue] = useState(a);
    return html`
      ${name}:
      <input
        readonly
        name="${name}"
        onclick="${() => setActiveValue(activeValue == a ? b : a)}"
        value="${activeValue}"
      />
    `;
  }),
);

document.body.innerHTML = `<x-settings></x-settings>`;
