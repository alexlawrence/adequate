customElements.define(
  'x-favorite-fruits',
  element(() => {
    const fruits = ['apple', 'mango', 'orange'];
    return html` <h1>My ${fruits.length} favorite fruits</h1>
      <ul>
        ${fruits.map((fruit) => `<li>${fruit}</li>`).join('')}
      </ul>`;
  }),
);
document.body.innerHTML = '<x-favorite-fruits></x-favorite-fruits>';
