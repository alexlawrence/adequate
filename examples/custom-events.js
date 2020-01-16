customElements.define(
  'x-child',
  element(function () {
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('child-message', { bubbles: true }));
    }, 1000);
    return html`sending a message in 1 second`;
  }),
);

customElements.define(
  'x-parent',
  element(function () {
    const [wasMessageReceived, setMessageReceived] = useState(false);
    useEffect(() => {
      this.addEventListener('child-message', () => setMessageReceived(true));
    }, []);
    return html`
      <x-child></x-child>
      <br />
      message received: ${wasMessageReceived ? 'yes' : 'no'}
    `;
  }),
);

document.body.innerHTML = '<x-parent></x-parent>';
