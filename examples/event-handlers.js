customElements.define(
  'x-alert-section',
  element(() => {
    return html` <section onclick="${(event) => alert(event.target.nodeName)}">Alert</section> `;
  }),
);
document.body.innerHTML = '<x-alert-section></x-alert-section>';
