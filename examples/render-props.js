customElements.define(
  'x-app',
  element(() => {
    const [counter, setCounter] = useState(0);
    return html`
      <x-card
        title="${() => html`Current counter value: ${counter}`}"
        body="${() => html`
          <button onclick="${() => setCounter(counter + 1)}">Increment</button>
        `}"
      ></x-card>
    `;
  }),
);

customElements.define(
  'x-card',
  element(({ title, body }) => {
    return html`
      <section style="border: 1px solid black">
        <h3>${title()}</h3>
        <hr />
        <div>${body()}</div>
      </section>
    `;
  }),
);

document.body.innerHTML = '<x-app></x-app>';
