const AdequateGreeter = element(({ 'first-name': firstName, 'last-name': lastName }) => {
  return html`<p>Hello, ${firstName} ${lastName}</p>`;
});

class Greeter extends AdequateGreeter {
  static get observedAttributes() {
    return ['first-name', 'last-name'];
  }
  attributeChangedCallback() {
    this.update();
  }
}

customElements.define('x-greeter', Greeter);
document.body.innerHTML = '<x-greeter first-name="Jim" last-name="Doe"></x-greeter>';

document.querySelector('x-greeter').setAttribute('first-name', 'James');
// Try changing the attributes directly in the Browser Dev Tools
