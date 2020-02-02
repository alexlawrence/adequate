# Guide

<p class="subtitle">Step-by-step instructions</p>

## Installation

### Via NPM

The most useful approach is to install adequate via `npm` as local project dependency:

```bash
npm i --save --save-exact adequate
```

By default, the package exposes an ES Module as `main` entry-point:

```javascript
// ESM
import { element, html, useState } from 'adequate';
// CJS
const { element, html, useState } = require('adequate');
```

As alternative, it also contains standalone files for direct use in the browser (both minified and non-minified):

```javascript
// Non-minified
import './node_modules/adequate/dist/adequate.js';
// Minified
import './node_modules/adequate/dist/adequate.min.js';
```

The standalone files define the object `adequate` on `window`, which contains the properties `e`, `h` and `u`. These are abbreviated references to the functions `element`, `html` and `useState`, which can be renamed when de-structuring the object:

```javascript
// De-structure and rename exported properties
const { e: element, h: html, u: useState } = window.adequate;
```

For both the ES Module and the standalone files, **TypeScript** definitions are included with the package.

### Via Github Releases

Another installation possibility is to download adequate from the [Github Repository Releases page](https://github.com/alexlawrence/adequate/releases). Note that the release assets only contain the ES Module and the standalone file, without any TypeScript definitions.

### Via CDN

Finally, the package can be included directly in a browser via a CDN, such as [unpkg](https://unpkg.com/adequate@0.2.0/dist/adequate.min.js). Similar to Github Releases, this approach lacks TypeScript support. Also, most free CDNs lack any availability guarantee.

## IDE configuration

adequate does not require any compilation or tooling. However, it can be helpful to have HTML syntax highlighting in Tagged Template Literals. There are various IDE and code editor plugins to enable this functionality. For VSCode, one recommendable plugin is [lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html).

## Creating an element

The first step is to create a Custom Element type using the `element()` function:

```javascript
const HelloWorldElement = element(() => {
  return html`<p>Hello World!</p>`;
});
```

As arguments, it expects a render function and an optional base class (defaults to `HTMLElement`). The passed in function `render()` is called every time an element needs to update. As return value, it must provide a list of Template Literal tokens, which are created with `html()`. The return value of the function `element()` is a constructor that can be directly passed to `customElements.define()`:

```javascript
customElements.define('x-hello-world', HelloWorldElement);
```

The name for a Custom Element must contain a dash (as defined by the [specification](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)). One common approach is to use a general prefix followed by dash, such as `x-`. After defining an element, it can be used in the markup and in the DOM:

```javascript
document.body.innerHTML = '<x-hello-world></x-hello-world>';
```

Nothing more is required to bootstrap an application with adequate. The following example combines all previous steps into one:

```javascript
customElements.define('x-hello-world', element(() => {
  return html`<p>Hello World!</p>`;
}));
document.body.innerHTML = '<x-hello-world></x-hello-world>';
```

[Run in REPL](https://adequatejs.org/repl.html?id=guide:hello-world)

## Rendering elements


## Using state

what needs to go into the API docs?

- create element, render basic
- manual update?
- state hook thrashing
- custom events
- dispatch function
- handle events
- handle custom events
- attributes, attribute parsing
  - can access event handlers, but useless
- templating basics
  - looping
  - what must be returned ~ fragment
- state
  - advanced patterns
    - use reducer
    - use effect like
- manual update
- standalone web components
- data fetching
- dealing with large data sets
  - helpers
- state boundaries / render performance
- when something is updated
  - attr, state, update
  - however attr nothing starting with on
- keys
- stateless vs stateful component
- disclaimer for people with react knowledge


slash out, re-write API afterwards, add comment to better check guide

### `element(render, BaseClass = HTMLElement)`

The operation `element()` creates a Custom Element class. As arguments, it expects a render function and an optional base class (defaults to `HTMLElement`). The return value is a constructor that can be passed to `customElements.define()`. Note that the Custom Element types returned from this operation may not work as expected outside of adequate. Check the [REPL](https://adequatejs.org/repl.html) for an example on how to build a general purpose Custom Element.

The passed in function `render()` is called every time an element instance needs to update. Upon invocation, it receives an object that contains all HTML attributes of the associated DOM element and the operation `dispatch()`. As return value the operation must provide a list of Template Literal tokens (typically created with `html()`). Every function expression that is used as HTML event attribute value is extracted and replaced with a reference. The helper operation `dispatch()` can be used inside a render function to dispatch DOM events. Effectively, it is a thin wrapper around the operation `dispatchEvent()` on the according element.

While adequate takes care re-rendering elements whenever needed, there is also manual option. Every instance of a Custom Element type exposes the function `update()`.

### `html(strings, ...values)`

The operation `html()` is a tag function that transforms a Template Literal into a flattened and ordered list of tokens. Such a literal can contain an arbitrary combination of strings and expressions, including nested calls to the `html()` function itself. 

### `useState(initialState)`

The hook `useState()` works almost identical as the implementation in [React](https://reactjs.org/docs/hooks-reference.html#usestate). As single argument, it expects an initial state value. The return value is a tuple with the current state as first item and an update function as the second one. Performing an update inside a render function of an element causes it to be re-rendered automatically. 

One notable difference from the React implementation is that there is no support for the function updater form.