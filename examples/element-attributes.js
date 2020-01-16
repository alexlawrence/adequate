customElements.define(
  'x-greeter',
  element(({ firstName, lastName }) => {
    return html`<p>Hello, ${firstName} ${lastName}</p>`;
  }),
);
document.body.innerHTML = '<x-greeter firstname="John" lastname="Doe"></x-greeter>';
