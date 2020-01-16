customElements.define(
  'x-list',
  element(() => {
    const [list, setList] = useState([]);
    const [input, setInput] = useState('');
    return html`
      <ul>
        ${list.map((item) => html`<li data-key="${item}">${item}</li>`)}
      </ul>
      <input value="${input}" oninput="${(event) => setInput(event.target.value)}" />
      <button type="button" onclick="${() => !list.includes(input) && setList([input, ...list])}">
        Add to top
      </button>
    `;
  }),
);

document.body.innerHTML = '<x-list></x-list>';
