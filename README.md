# adequate

<p class="subtitle">An adequate UI library with minimal size</p>

<div class="badges">
<a href="https://npmjs.com/package/adequate">
  <img alt="Package Size" src="https://badgen.net/npm/v/adequate">
</a>
&nbsp;
<a href="https://bundlephobia.com/result?p=adequate@latest">
  <img alt="Package Size" src="https://badgen.net/bundlephobia/minzip/adequate@latest">
</a>
</div>

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

- **Instant loading:** adequate has a standalone size of **0.99kb** (minzipped). This is 43x smaller than React (17.0) and 5x smaller than Preact (10.5).
- **Declarative views:** HTML Template Literals are rendered as Template Elements and only the changed DOM parts are updated.
- **Custom Elements:** Custom Elements are used as component model and enable to control state boundaries and render performance.
- **Hooks API:** Elements can make use of a React-like Hooks API for state management and side effects.
- **Event handling:** Inline functions can be used as native DOM event handlers and as custom callbacks.
- **Zero tooling:** The library requires no compilation or tooling. HTML syntax highlighting can be enabled via a [plugin](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html).

## Non-goals

- **Maximum Performance:** The library is not optimized for render performance or memory usage.
- **Semantic markup:** HTML attributes are used in a way that may deteriorate semantic markup quality.
- **Complete Hooks API:** The offered Hooks API is only a subset of what React/Preact offers.
- **Shadow DOM:** The library does not support Shadow DOM for individual elements.

## Size comparison

adequate is a perfect fit when size is important, such as when dealing with limited bandwidth or storage capacity restrictions. The following compares the sizes of adequate, React and Preact on their own and together with a simplified todo list. This comparison is exclusively concerned with size, not with functionalities or render performance. The numbers demonstrate the key advantage of adequate. Even when bundled with a basic todo list, the size is still multiple times smaller than Preact itself. 

<!-- size-comparison -->

- React + ReactDOM @ 17.0.1
  - library: 42.52kb
  - library + todo list: 42.84kb
- Preact + Hooks @ 10.5.12
  - library: 4.87kb
  - library + todo list: 5.19kb
- adequate @ latest
  - library: 0.99kb
  - library + todo list: 1.37kb

<!-- /size-comparison -->

## Browser support

adequate works in most of the latest major browsers, both on desktop and mobile. For browsers without support for the `:scope` pseudo query selector, a [polyfill](https://github.com/jonathantneal/element-qsa-scope) can be used.

## Resources

The following list is a collection of concepts and technologies that are related to adequate.
Some of them served as inspiration for the library, others merely share similar ideas.

- [dom-tagged-template](https://github.com/caub/dom-tagged-template)
- [htm](https://github.com/developit/htm)
- [hyperHTML](https://github.com/WebReflection/hyperHTML)
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

## Showcases

As the library is relatively new, there are currently no known showcase projects. If you use adequate in one of your projects, please [let me know](https://www.alex-lawrence.com/contact/) and I'll add it to this page.