import { AdequateElement } from './element';
import { html } from './template-literal-processor';
import { useState } from './state-hook';

const { describe, expect, it } = <any>window;

let elementNameCounter = 0;
const generateElementName = () => `x-element-${elementNameCounter++}`;

describe('AdequateElement()', () => {
  it('should return a class that extends the given class', () => {
    const AdequateHTMLElement = AdequateElement(HTMLElement);
    expect(() => AdequateHTMLElement.prototype instanceof HTMLElement);
    const AdequateHTMLTableElement = AdequateElement(HTMLTableElement);
    expect(() => AdequateHTMLTableElement.prototype instanceof HTMLTableElement);
  });

  describe('new AdequateElement()', () => {
    it('should receive a "scope" attribute when appended to the DOM', () => {
      const elementName = generateElementName();
      customElements.define(elementName, AdequateElement(HTMLElement));
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      expect(() => customElement.hasAttribute('scope'));
    });

    it('should execute and process the passed in render function when appended to the DOM', () => {
      const elementName = generateElementName();
      customElements.define(
        elementName,
        class extends AdequateElement(HTMLElement) {
          render() {
            return html`
              <p>Hello World!</p>
            `;
          }
        }
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      expect(() => customElement.querySelector('p')?.innerHTML == 'Hello World!');
    });

    it('should provide access to the actual DOM element via the this binding', () => {
      const elementName = generateElementName();
      let accessedObject: Element;
      customElements.define(
        elementName,
        class extends AdequateElement(HTMLElement) {
          render() {
            accessedObject = this;
            return html``;
          }
        }
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      expect(() => customElement == accessedObject);
    });

    it('should process inline function expressions as event handler in the render function', () => {
      const elementName = generateElementName();
      const receivedEvents: Event[] = [];
      customElements.define(
        elementName,
        class extends AdequateElement(HTMLElement) {
          render() {
            // prettier-ignore
            return html`
              <button
                onclick="${(event: MouseEvent) => {
                  receivedEvents.push(event);
                }}"
                onfocus="${(event: FocusEvent) => {
                  receivedEvents.push(event);
                }}"
              ></button>
            `;
          }
        }
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      customElement.querySelector('button')?.click();
      customElement.querySelector('button')?.focus();
      expect(() => receivedEvents[0] instanceof MouseEvent);
      expect(() => receivedEvents[1] instanceof FocusEvent);
    });

    it('should be able to use other elements as child nodes in its render function', async () => {
      const elementName = generateElementName();
      const childElementName = generateElementName();
      customElements.define(
        childElementName,
        class extends AdequateElement(HTMLElement) {
          render() {
            return html`
              <p>Hello World!</p>
            `;
          }
        }
      );
      customElements.define(
        elementName,
        class extends AdequateElement(HTMLElement) {
          render() {
            return html`<${childElementName}></${childElementName}>`;
          }
        }
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(() => customElement.querySelector('p')?.innerHTML == 'Hello World!');
    });

    it('should correctly process custom event handler attributes inside its render function', () => {
      let receivedEvent: any = null;
      const customEvent = new CustomEvent('custom-click');
      const elementName = generateElementName();
      const childElementName = generateElementName();
      customElements.define(
        childElementName,
        class extends AdequateElement(HTMLElement) {
          render() {
            return html`
              <div
                onclick="${() => {
                  this.dispatchEvent(customEvent);
                }}"
              ></div>
            `;
          }
        }
      );
      customElements.define(
        elementName,
        class extends AdequateElement(HTMLElement) {
          render() {
            return html`<${childElementName} oncustom-click="${(event: CustomEvent) => {
              receivedEvent = event;
            }}"></${childElementName}>`;
          }
        }
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      customElement.querySelector('div')?.click();
      expect(() => receivedEvent == customEvent);
    });

    it('should be capable of using useState() inside its render function', async () => {
      const elementName = generateElementName();
      customElements.define(
        elementName,
        class extends AdequateElement(HTMLElement) {
          render() {
            const [state, setState] = useState('');
            if (!state) setState('Hello World!');
            // prettier-ignore
            return html`<p>${state}</p>`;
          }
        }
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      await new Promise(resolve => requestAnimationFrame(resolve));
      expect(() => customElement.querySelector('p')?.innerHTML == 'Hello World!');
    });

    it('should not throw an exception when its update function is called before being added to the DOM', () => {
      const elementName = generateElementName();
      customElements.define(
        elementName,
        class extends AdequateElement(HTMLElement) {
          render() {
            return html`
              <div></div>
            `;
          }
        }
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
    });
  });
});
