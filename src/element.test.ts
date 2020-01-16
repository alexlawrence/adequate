import { element } from './element';
import html from './template-literal-processor';
import { useEffect, useState } from './hooks';
import { AttributeProxy } from './attribute-proxy-factory';

const { describe, expect, it } = <any>window;

let elementNameCounter = 0;
const uniqueElementName = () => `x-element-${elementNameCounter++}`;

describe('element()', () => {
  it('should return a custom element class that extends HTMLElement by default', () => {
    const AdequateHTMLElement = element(() => html``);
    expect(() => AdequateHTMLElement.prototype instanceof HTMLElement);
  });

  describe('custom element instance', () => {
    it('should execute and process the defined render function when appended to the DOM', () => {
      const elementName = uniqueElementName();
      customElements.define(
        elementName,
        element(() => html`<p>Hello World!</p>`),
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      expect(() => customElement.querySelector('p')?.innerHTML == 'Hello World!');
    });

    it('should expose HTML attributes as named arguments to the render function', () => {
      let exposedAttributes: AttributeProxy;
      const elementName = uniqueElementName();
      customElements.define(
        elementName,
        element((attributes) => {
          exposedAttributes = attributes;
          return html``;
        }),
      );
      const customElement = document.createElement(elementName);
      customElement.setAttribute('class', 'bordered');
      customElement.setAttribute('data-foo', 'bar');
      document.body.appendChild(customElement);
      expect(() => exposedAttributes.class == 'bordered');
      expect(() => exposedAttributes['data-foo'] == 'bar');
    });

    it('should provide access to the actual DOM element via the this binding', () => {
      const elementName = uniqueElementName();
      let accessedObject: HTMLElement;
      customElements.define(
        elementName,
        element(function () {
          accessedObject = this;
          return html``;
        }),
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      expect(() => customElement == accessedObject);
    });

    it('should process inline function expressions as event handler in the render function', () => {
      const elementName = uniqueElementName();
      const receivedEvents: Event[] = [];
      customElements.define(
        elementName,
        element(
          () => html`
            <button
              onclick="${(event: MouseEvent) => {
                receivedEvents.push(event);
              }}"
              onfocus="${(event: FocusEvent) => {
                receivedEvents.push(event);
              }}"
            ></button>
          `,
        ),
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      customElement.querySelector('button')?.click();
      customElement.querySelector('button')?.focus();
      expect(() => receivedEvents[0] instanceof MouseEvent);
      expect(() => receivedEvents[1] instanceof FocusEvent);
    });

    it('should be capable of using other elements as child nodes in its render function', async () => {
      const elementName = uniqueElementName();
      const childElementName = uniqueElementName();
      customElements.define(
        childElementName,
        element(() => html`<p>Hello World!</p>`),
      );
      customElements.define(
        elementName,
        element(() => html`<${childElementName}></${childElementName}>`),
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(() => customElement.querySelector('p')?.innerHTML == 'Hello World!');
    });

    it('should be capable of receiving function attributes from parent elements', async () => {
      const elementName = uniqueElementName();
      const childElementName = uniqueElementName();
      let wasExecuted = false;
      customElements.define(
        childElementName,
        element<{ onrender: Function }>(({ onrender }) => {
          onrender();
          return html`<p>Hello World!</p>`;
        }),
      );
      customElements.define(
        elementName,
        element(
          () =>
            html`<${childElementName} onrender="${() =>
              (wasExecuted = true)}"></${childElementName}>`,
        ),
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(() => wasExecuted == true);
    });

    it('should be capable of using the state hook inside its render function', async () => {
      const elementName = uniqueElementName();
      customElements.define(
        elementName,
        element(() => {
          const [state, setState] = useState('');
          if (!state) setState('Hello World!');
          return html`<p>${state}</p>`;
        }),
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      expect(() => customElement.querySelector('p')?.innerHTML == 'Hello World!');
    });

    it('should be capable of using the effect hook inside its render function', async () => {
      const elementName = uniqueElementName();
      customElements.define(
        elementName,
        element(() => {
          const [state, setState] = useState('');
          useEffect(() => {
            setState('Hello World!');
          }, []);
          return html`<p>${state}</p>`;
        }),
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
      await new Promise((resolve) => queueMicrotask(() => resolve(true)));
      await new Promise((resolve) => requestAnimationFrame(resolve));
      expect(() => customElement.querySelector('p')?.innerHTML == 'Hello World!');
    });

    it('should not throw an exception when its update function is called before being added to the DOM', () => {
      const elementName = uniqueElementName();
      customElements.define(
        elementName,
        element(() => html`<div></div>`),
      );
      const customElement = document.createElement(elementName);
      document.body.appendChild(customElement);
    });
  });
});
