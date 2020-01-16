customElements.define(
  'x-hello-world',
  element(() => {
    return html`<p>Hello World!</p>`;
  }),
);
document.body.innerHTML = '<x-hello-world></x-hello-world>';
