customElements.define(
  'x-game',
  element(() => {
    return html`
    <x-question
      text="What is 3 + 4?"
      solution="7"
      onsolve="${() => alert('solved!')}"
    ></x-question>
  `;
  }),
);

customElements.define(
  'x-question',
  element(({ onSolve, solution, text }) => {
    return html`
      ${text}
      <input
        type="text"
        oninput="${(event) => {
          if (event.target.value == solution) {
            onSolve();
          }
        }}"
      />
    `;
  }),
);

document.body.innerHTML = '<x-game></x-game>';
