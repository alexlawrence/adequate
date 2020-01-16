customElements.define(
  'x-card',
  element(function ({ title, content }) {
    useEffect(() => {
      this.style.display = 'block';
      this.style.border = '1px solid black';
    }, []);
    return html`
      <h3>${title}</h3>
      <hr />
      <section>${content}</section>
    `;
  }),
);

document.body.innerHTML = '<x-card title="Test card" content="Hello World!"></x-card>';
