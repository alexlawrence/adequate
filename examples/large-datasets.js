customElements.define(
  'x-app',
  element(() => {
    const [input, setInput] = useState('');
    return html`
      <input type="text" oninput="${(event) => setInput(event.target.value)}" value="${input}" />
      <hr />
      <x-character-count text="${input}"></x-character-count>
      <hr />
      <x-character-count-fn text="${() => input}"></x-character-count-fn>
    `;
  }),
);

customElements.define(
  'x-character-count',
  element(({ text }) => {
    return html`Characters: ${text.length}`;
  }),
);

customElements.define(
  'x-character-count-fn',
  element(({ text }) => {
    return html`Characters: ${text().length}`;
  }),
);

document.body.innerHTML = '<x-app></x-app>';
