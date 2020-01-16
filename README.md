# adequate

<p class="subtitle">An adequate UI library with minimal size</p>

<!-- bundlephobia badges -->
<!-- travis CI -->

```javascript
customElements.define('x-counter', element(() => {
  const [value, setValue] = useState(0);

  return html`
    <div>Counter: ${value}</div>
    <button onclick="${() => setValue(value + 1)}">Increment</button>
    <button onclick="${() => setValue(value - 1)}">Decrement</button>
  `;
}));
document.body.innerHTML = '<x-counter></x-counter>';
```

Head to the [REPL](https://adequatejs.org/repl.html) for interactive examples

## Features

- **Instant loading:** adequate has a minzipped size of **1.1kb**. This is 37 times smaller than React (16.12.0) and 4 times smaller than Preact (10.2.1).
- **Declarative views:** HTML Template Literals are rendered as Template Elements and only the changed DOM parts are updated.
- **Custom Elements:** Custom Elements are used as component model and enable to control state boundaries and render performance.
- **State management:** Stateful elements can be implemented with a minimal React-like Hooks API.
- **Event handling:** Function expressions are translated into HTML event attributes for processing built-in and custom DOM events.
- **Zero tooling:** The library requires no compilation or tooling. HTML syntax highlighting in Template Literals can be enabled via a [plugin](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html).

## Non-goals

- **High Performance:** The library is not optimized for render performance or memory usage.
- **Semantic markup:** Some used HTML attributes may deteriorate semantic markup quality.
- **Standalone Components:** adequate can be ill-suited for implementing standalone Web Components.
- **Full Hooks API:** While the State Hook is React-compatible, there is no support for a full Hook API.
- **Shadow DOM:** The library does not support Shadow DOM for individual elements.

## Size comparison

adequate is a perfect fit when bundle size is a critical aspect. This may be due to limited bandwidth or storage capacity restrictions. This section compares the sizes of adequate, React and Preact on their own and together with a todo list. Overall, the result numbers demonstrate the key advantage of this library. Even when bundled with a basic todo list, the size is still multiple times smaller than the Preact library itself. 

<!-- size-comparison -->

- React + ReactDOM @ 16.12.0
  - library: 41.58kb
  - library + todo list: 41.88kb
- Preact + Hooks @ 10.2.1
  - library: 4.48kb
  - library + todo list: 4.69kb
- adequate @ latest
  - library: 1.11kb
  - library + todo list: 1.49kb

<!-- /size-comparison -->

<!--
## Performance test

tbd

-->

## Browser support

adequate works in most of the latest major browsers, both on desktop and mobile. However, Microsoft Edge requires a [polyfill](https://github.com/jonathantneal/element-qsa-scope) for the `:scope` pseudo query selector.

## Resources

The following list is a collection of concepts and technologies that are related to adequate.
Some of them served as inspiration for the library, others merely share similar ideas.

- [dom-tagged-template](https://github.com/caub/dom-tagged-template)
- [htm](https://github.com/developit/htm)
- [hyperHTML](https://viperhtml.js.org/)
- [lighterhtml](https://github.com/WebReflection/lighterhtml)
- [lit-html](https://lit-html.polymer-project.org/)
- [LitElement](https://lit-element.polymer-project.org/)
- [nanohtml](https://github.com/choojs/nanohtml)
- [Preact](https://preactjs.com/)
- [pureact](https://github.com/fbedussi/pureact)
- [React](https://reactjs.org/)
  - [Hooks](https://reactjs.org/docs/hooks-overview.html)
  - [JSX](https://reactjs.org/docs/introducing-jsx.html)
  - [Virtual DOM](https://reactjs.org/docs/faq-internals.html)

## Feedback & Contact

For feedback & contact check the [Github Repository](https://github.com/alexlawrence/adequate).