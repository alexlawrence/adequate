import { element } from './element';
import { html } from './template-literal-processor';
import { useState } from './state-hook';

const { describe, expect, it } = <any>window;

let elementNameCounter = 0;
const generateElementName = () => `x-element-${elementNameCounter++}`;

describe('element()', () => {
  it('should return a class that extends HTMLElement by default', () => {
    const CustomElement = element(() => []);
    expect(() => CustomElement.prototype instanceof HTMLElement);
  });

  it('should return a class that extends the class provided as second argument', () => {
    const CustomElement = element(() => [], HTMLTableRowElement);
    expect(() => CustomElement.prototype instanceof HTMLTableRowElement);
  });

  describe('new element()', () => {
    it('should receives a "scope" attribute when appended to the DOM', () => {
      const elementName = generateElementName();
      customElements.define(
        elementName,
        element(() => [])
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      expect(() => customElement.hasAttribute('scope'));
    });

    it('should execute and process the passed in render function when appended to the DOM', () => {
      const elementName = generateElementName();
      customElements.define(
        elementName,
        element(
          () =>
            // prettier-ignore
            html`<p>Hello World!</p>`
        )
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      expect(() => customElement.querySelector('p')?.innerHTML == 'Hello World!');
    });

    it('should pass all non-event-related attributes to its render function', () => {
      const elementName = generateElementName();
      customElements.define(
        elementName,
        element(
          ({ hello, world }) =>
            // prettier-ignore
            html`<p>${hello} ${world}!</p>`
        )
      );
      const customElement = document.createElement(elementName);
      customElement.setAttribute('hello', 'Hello');
      customElement.setAttribute('world', 'World');
      document.body.appendChild(customElement);
      expect(() => customElement.querySelector('p')?.innerHTML == 'Hello World!');
    });

    it('should process inline function expressions as event handler in the render function', () => {
      const elementName = generateElementName();
      const receivedEvents: Event[] = [];
      customElements.define(
        elementName,
        element(
          () =>
            // prettier-ignore
            html`
            <button
              onclick="${(event: MouseEvent) => {
                receivedEvents.push(event);
              }}"
              onfocus="${(event: FocusEvent) => {
                receivedEvents.push(event);
              }}"
            ></button>
          `
        )
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      customElement.querySelector('button')?.click();
      customElement.querySelector('button')?.focus();
      expect(() => receivedEvents[0] instanceof MouseEvent);
      expect(() => receivedEvents[1] instanceof FocusEvent);
    });

    it('should re-render its child nodes when executing its update() function', () => {
      const elementName = generateElementName();
      let renderCount = 0;
      customElements.define(
        elementName,
        element(
          () =>
            // prettier-ignore
            html`<p>${++renderCount}</p>`
        )
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      // @ts-ignore
      customElement.update();
      expect(() => customElement.innerHTML == '<p>2</p>');
    });

    it('should be capable of using useState() inside its render function', async () => {
      const elementName = generateElementName();
      customElements.define(
        elementName,
        element(() => {
          const [state, setState] = useState('');
          if (!state) setState('Hello World!');
          // prettier-ignore
          return html`<p>${state}</p>`;
        })
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      await new Promise(resolve => requestAnimationFrame(resolve));
      expect(() => customElement.querySelector('p')?.innerHTML == 'Hello World!');
    });

    it('should be able to use other elements as child nodes in its render function', async () => {
      const elementName = generateElementName();
      const childElementName = generateElementName();
      customElements.define(
        childElementName,
        // prettier-ignore
        element(() => html`<p>Hello World!</p>`)
      );
      customElements.define(
        elementName,
        element(() => html`<${childElementName}></${childElementName}>`)
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
        // prettier-ignore
        element(function () {
          return html`<div onclick="${() => {
            this.dispatchEvent(customEvent);
          }}"></div>`;
        })
      );
      customElements.define(
        elementName,
        element(
          () =>
            html`<${childElementName} oncustom-click="${(event: CustomEvent) => {
              receivedEvent = event;
            }}"></${childElementName}>`
        )
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      customElement.querySelector('div')?.click();
      expect(() => receivedEvent == customEvent);
    });

    it('should pass in a dispatch operation to its render function for dispatching events', () => {
      let receivedEvent: any = null;
      const customEvent = new CustomEvent('custom-click', { bubbles: true });
      const elementName = generateElementName();
      customElements.define(
        elementName,
        // prettier-ignore
        element(({ dispatch }) => html`<div onclick="${() => dispatch(customEvent)}"></div>`)
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      document.addEventListener('custom-click', event => (receivedEvent = event));
      customElement.querySelector('div')?.click();
      expect(() => receivedEvent == customEvent);
    });

    it('should pass in a dispatch operation to its render function for dispatching events', () => {
      let receivedEvent: any = null;
      const customEvent = new CustomEvent('custom-click', { bubbles: true });
      const elementName = generateElementName();
      customElements.define(
        elementName,
        // prettier-ignore
        element(({ dispatch }) => html`<div onclick="${() => dispatch(customEvent)}"></div>`)
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      document.addEventListener('custom-click', event => (receivedEvent = event));
      customElement.querySelector('div')?.click();
      expect(() => receivedEvent == customEvent);
    });

    it('should not throw an exception when its update function is called before being added to the DOM', () => {
      const elementName = generateElementName();
      customElements.define(
        elementName,
        // prettier-ignore
        element(() => html`<div></div>`)
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
    })
  });
});
