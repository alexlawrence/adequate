customElements.define(
  'x-app',
  element(() => {
    return html`<x-executor fn="${() => alert('function executed')}"></x-executor>`;
  }),
);

customElements.define(
  'x-executor',
  element(({ fn }) => {
    fn();
    return html`executing function: ${fn}`;
  }),
);

document.body.innerHTML = '<x-app></x-app>';
