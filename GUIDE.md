# Guide

<p class="subtitle">Step-by-step usage guide</p>

## Installation

adequate is available as an ES Module (`adequate.module.js`) and as a standalone file (`adequate.js` or `adequate.min.js`). The ES Module defines named exports, while the standalone file creates the global object `adequate` on the `window` object.

### npm

The best approach is to install the library via `npm` (or `yarn`) as a local project dependency:

```text
npm i --save --save-exact adequate
```

The npm package also includes TypeScript definitions.

### Github Releases

Another installation possibility is to download adequate from the [Github Repository Releases page](https://github.com/alexlawrence/adequate/releases). Note that the release assets only contain the ES Module and the standalone files, without any TypeScript definitions.

### CDNs

Furthermore, the library can also be loaded directly into the browser via a CDN, such as [unpkg](https://unpkg.com/adequate/dist/adequate.min.js). Similar to the Github Releases, this approach lacks TypeScript support.

## IDE configuration

adequate does not require any compilation or tooling. However, it is recommended to have HTML syntax highlighting for Tagged Template Literals. There are various IDE and code editor plugins to enable this functionality. For VSCode, one possibility is to use the [lit-html plugin](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html).

## Importing the module

The ESM version can be imported both via ESM `import` or CJS `require()`:

```javascript
// ESM
import { element, html, useEffect, useState } from 'adequate';
// CJS
const { element, html, useEffect, useState } = require('adequate');
```

The standalone file does not export members, but defines a global object on the `window`:

```javascript
// Non-minified
import './node_modules/adequate/dist/adequate.js';
// Minified
import './node_modules/adequate/dist/adequate.min.js';

const { element, html, useEffect, useState } = window.adequate;
```

## Creating an element

Creating a Custom Element type is done by invoking the `element()` function:

```javascript
const HelloWorldElement = element(() => {
  return html`<p>Hello World!</p>`;
});
```

As only argument, the function expects a render operation. The render operation is called every time an element instance needs to update its DOM content. The DOM content of an element is defined with the help of the `html()` tag function.

The return value of the `element()` function is a constructor that can be passed to the Custom Element registry:

```javascript
customElements.define('x-hello-world', HelloWorldElement);
```

The name for a Custom Element must contain a dash (as defined by the [specification](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)). One common approach is to use a general prefix, such as `x-`. After creating and registering the Custom Element class, it can be used in the markup and in the DOM:

```javascript
document.body.innerHTML = '<x-hello-world></x-hello-world>';
```

**Note:** Custom Elements may not be written as self-closing tags. 

Nothing more is required to bootstrap an UI written with adequate. The following example combines all the previous steps into one:

```javascript
customElements.define('x-hello-world', element(() => {
  return html`<p>Hello World!</p>`;
}));
document.body.innerHTML = '<x-hello-world></x-hello-world>';
```

[Run in REPL](https://adequatejs.org/repl.html?id=creating-an-element)

## Rendering basics

The DOM content of a Custom Element is defined with the `html()` function:

```javascript
customElements.define('x-favorite-fruits', element(() => {
  return html`<h1>My favorite fruits</h1>`;
}));
```

This operation is a tag function that accepts a Template Literal. Template Literals can contain any combination of strings and expressions:

```javascript
customElements.define('x-favorite-fruits', element(() => {
  const fruits = ['apple', 'mango', 'orange'];
  return html`
    <h1>My ${fruits.length} favorite fruits are: ${fruits.join(',')}</h1>
  `;
}));
```

The expressions may yield arrays, which are automatically flattened:

```javascript
customElements.define('x-favorite-fruits', element(() => {
  const fruits = ['apple', 'mango', 'orange'];
  return html`
    <h1>My ${fruits.length} favorite fruits</h1>
    <ul>
      ${fruits.map(fruit => '<li>' + fruit + '</li>')}
    </ul>
  `;
}));
```

The Template Literals passed to `html()` can even contain nested calls to the `html()` function:

```javascript
customElements.define('x-favorite-fruits', element(() => {
  const fruits = ['apple', 'mango', 'orange'];
  return html`
    <h1>My ${fruits.length} favorite fruits</h1>
    <ul>
      ${fruits.map(fruit => html`<li>${fruit}</li>`)}
    </ul>
  `;
}));
```

With regard to the rendered output, the two previous examples are equivalent. However, when using function attributes inside nested Template Literals, the use of the `html()` function is mandatory.

[Run example in REPL](https://adequatejs.org/repl.html?id=rendering-basics)

## Element attributes

The render operation receives an object that exposes all HTML attributes of the respective DOM element:

```javascript
customElements.define('x-id-logger', element(({id}) => {
  return html`The id attribute has the value ${id}`;
}));
document.body.innerHTML = '<x-id-logger id="my-element"></x-id-logger>';
```

This also includes attributes with custom names:

```javascript
customElements.define('x-repeat', element(({text, times}) => {
  return html`${text.repeat(times)}`;
}));
document.body.innerHTML = '<x-repeat text="go " times="3"></x-repeat>';
```

adequate does **not** transform attribute names. Specifically, there is no conversion from kebab-case to camel case:

```javascript
customElements.define('x-greeter', element((attributes) => {
  return html`Hello, ${attributes['first-name']} ${attributes['last-name']}`;
}));
document.body.innerHTML =
  '<x-greeter first-name="John" last-name="Doe"></x-greeter>';
```

For camel case variable names, the attributes can be renamed upon destructuring:

```javascript
customElements.define('x-greeter', element(
  ({'first-name': firstName, 'last-name': lastName}) => {
    return html`<p>Hello, ${firstName} ${lastName}</p>`;
  },
));
document.body.innerHTML =
  '<x-greeter first-name="John" last-name="Doe"></x-greeter>';
```

Another possibility is to rely on the case insensitivity of HTML attributes:

```javascript
customElements.define('x-greeter', element(({firstName, lastName}) => {
  return html`<p>Hello, ${firstName} ${lastName}</p>`;
}));
document.body.innerHTML =
  '<x-greeter firstname="John" lastname="Doe"></x-greeter>';
```

[Run example in REPL](https://adequatejs.org/repl.html?id=element-attributes)

## Event handlers

Event handler functions for built-in DOM events can be passed to the according event attributes:

```javascript
customElements.define('x-alert-section', element(() => {
  return html`
    <section onclick="${() => alert('clicked')}">
      Click me
    </section>
  `;
}));
```

**Important:** Function attributes must be surrounded by quotes. This is different from other libraries, such as React or Preact.

The event mechanism works for every native DOM event with an according on* attribute:

```javascript
customElements.define('x-alert-section', element(() => {
  return html`
    <section onmouseout="${() => alert('mouse out')}">
      Hover out
    </section>
  `;
}));
```

Event attributes are a native browser functionality. Everything works as with standard event handlers, such as accessing the event object:

```javascript
customElements.define('x-alert-section', element(() => {
  return html`
    <section onclick="${(event) => event.target.nodeName}">
      Click me
    </section>
  `;
}));
```

[Run example in REPL](https://adequatejs.org/repl.html?id=event-handlers)

**Note:** There are no built-in event attributes for Custom Events. This guide contains a separate section on how to dispatch and listen to Custom Events.

## State management

State management can be done with the `useState()` hook:

```javascript
customElements.define('x-counter', element(({ start }) => {
  const [value, setValue] = useState(parseInt(start));

  return html`
    <div>Counter: ${value}</div>
    <button onclick="${() => setValue(value + 1)}">Increment</button>
    <button onclick="${() => setValue(value - 1)}">Decrement</button>
  `;
}));
```

[Run example in REPL](https://adequatejs.org/repl.html?id=state-management)

The function `useState()` expects an initial state as argument. Its return value is a tuple with the current state as first item and an update function as the second one. Performing a state update causes the according element to be re-rendered automatically.

This hook is almost identical to the implementation in React or Preact. Please refer to the [React documentation](https://reactjs.org/docs/hooks-reference.html#usestate) or the [Preact documentation](https://preactjs.com/guide/v10/hooks/#usestate) for a more detailed explanation. One difference is the missing support for the function updater form.

## Side effects

One-time operations are setup by executing the `useEffect()` hook with an empty dependencies array:

```javascript
customElements.define('x-confirm', element(({text}) => {
  const [isConfirmed, setConfirmStatus] = useState(null);
  useEffect(() => {
    setConfirmStatus(confirm(text));
  }, []);
  if (isConfirmed == null) return html`waiting for input`;
  return html`${isConfirmed ? 'yes' : 'no'}`;
}));
document.body.innerHTML = '<x-confirm text="Are you sure?"></x-confirm>';
```

Operations that should be re-executed when certain values change must define according dependencies:

```javascript
customElements.define('x-last-commit', element(({ owner, repo }) => {
  const [commit, setCommit] = useState();
  useEffect(async () => {
    const {commit} = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/HEAD`,
    ).then((response) => response.json());
    setCommit(commit);
  }, [owner, repo]);

  if (!commit) return html`<p>Loading...</p>`;
  return html`
    <h1>${owner}/${repo}</h1>
    <p>Last commit message: ${commit.message}</p>
  `;
}));
```

[Run example in REPL](https://adequatejs.org/repl.html?id=side-effects)

The hook `useEffect()` expects an effect function and a dependencies array as arguments. The effect function is called once initially and every time a dependency changes. An empty dependency array causes the function to be only executed once.

This hook is almost identical to the implementation in React or Preact. Please refer to the [React documentation](https://reactjs.org/docs/hooks-reference.html#useeffect) or the [Preact documentation](https://preactjs.com/guide/v10/hooks/#useeffect) for a more detailed explanation. One difference is the missing support for an invocation without dependencies.

## Element composition

Elements can be composed and nested in any way:

```javascript
customElements.define('x-settings', element(() => {
  return html`
    <x-toggle name="sound" a="on" b="off"></x-toggle>
    <x-toggle name="Vibration" a="on" b="off"></x-toggle>
  `;
}));

customElements.define('x-toggle', element(({name, a, b}) => {
  const [activeValue, setActivePart] = useState(a);
  return html`
    ${name}:
    <input
      readonly
      style="cursor: pointer"
      name="${name}"
      onclick="${() => setActivePart(activeValue == a ? b : a)}"
      value="${activeValue}"
    />
  `;
}));
```

[Run example in REPL](https://adequatejs.org/repl.html?id=element-composition)

When a parent element is rendered, child elements are only re-rendered if their attributes changed:

```javascript
let childRenderCount = 0;
customElements.define('x-child', element(() => {
  return html`child render count: ${++childRenderCount}`;
}));

let parentRenderCount = 0;
customElements.define('x-parent', element(() => {
  const [counter, setCounter] = useState(0);
  setTimeout(() => setCounter(counter + 1), 1000);
  return html`
    parent render count: ${++parentRenderCount}
    <br>
    <x-child counter="${Math.floor(counter / 2)}"></x-child>
  `;
}));
```

[Run example in REPL](https://adequatejs.org/repl.html?id=child-rendering)

One notable exception is when an attribute is a function. In this case, the child element is always re-rendered.

## Function attributes

Custom Elements can pass functions as attributes to other elements:

```javascript
customElements.define('x-app', element(() => {
  return html`<x-executor fn="${() => alert('was executed')}"></x-executor>`;
}));

customElements.define('x-executor', element(({ fn }) => {
  fn();
  return html`executing function: ${fn}`;
}));
```

[Run example in REPL](https://adequatejs.org/repl.html?id=function-attributes)

This mechanism can be used for different patterns, which are explained in the following sections.

## Custom callbacks

Function attributes can be used as custom callbacks:

```javascript
customElements.define('x-game', element(() => {
  return html`
    <x-question
      text="What is 3 + 4?"
      solution="7"
      onsolve="${() => alert('solved!')}"
    ></x-question>
  `;
}));

customElements.define('x-question', element(({ onSolve, solution, text }) => {
  return html`
    ${text}
    <input
      type="text"
      oninput="${(event) => event.target.value == solution && onSolve()}"
    />
  `;
}));
```

[Run example in REPL](https://adequatejs.org/repl.html?id=custom-callbacks)

Custom callbacks are different from DOM event handler functions. Native event attributes are mapped to event handlers. Custom callbacks are plain functions that are passed from one element to another.

**Warning:** Using a native event attribute as a custom callback results in an unexpected behavior:

```javascript
customElements.define('x-app', element(() => {
  return html`
    <x-button onclick="${() => alert('was clicked')}"></x-button>
  `;
}));

customElements.define('x-button', element(({ onclick }) => {
  return html`
    <button type="button" onclick="${onclick}">Click me</button>
  `;
}));
```

The above example executes `alert()` two times in case of a click event. The Custom Element `<x-button>` receives a function as "onclick" attribute, which causes to register a native event handler. The same function is also forwarded to the "onclick" attribute of the native button, which causes to create a second handler.

In general, native event attributes should not be used inside the render function of an element.

## Render Props

Function attributes can be used to forward dynamic DOM content to other Custom Elements:

```javascript
customElements.define('x-app', element(() => {
  const [counter, setCounter] = useState(0);
  return html`
    <x-card
      title="${() => html`Current counter value: ${counter}`}"
      body="${() => html`
        <button onclick="${() => setCounter(counter + 1)}">
          Increment
        </button>
      `}"
    ></x-card>
  `;
}));

customElements.define('x-card', element(({ title, body }) => {
  return html`
	<section style="border: 1px solid black">
    <h3>${title()}</h3>
    <hr>
    <div>${body()}</div>
	</section>
  `;
}));
```

[Run example in REPL](https://adequatejs.org/repl.html?id=render-props)

The card element only renders a frame, which is populated by the function attributes `title()` and `body()`. From the outside, any dynamic DOM content can be passed in. This technique is called Render Props. Please refer to the according [React documentation](https://reactjs.org/docs/render-props.html) for a more detailed explanation.

## Large datasets

Passing large datasets from one element to another via a function attribute avoids bloated markup:

```javascript
customElements.define('x-app', element(() => {
  const [input, setInput] = useState('');
  return html`
    <input
      type="text"
      oninput="${(event) => setInput(event.target.value)}"
      value="${input}"
    />
    <hr>
    <x-character-count text="${input}"></x-character-count>
    <hr>
    <x-character-count-fn text="${() => input}"></x-character-count-fn>
  `;
}));

customElements.define('x-character-count', element(({ text }) => {
  return html`Characters: ${text.length}`;
}));

customElements.define('x-character-count-fn', element(({ text }) => {
  return html`Characters: ${text().length}`;
}));
```

[Run example in REPL](https://adequatejs.org/repl.html?id=large-datasets)

The Custom Element `<x-character-count>` receives the input text as plain attribute. Therefore, the attribute value in the DOM grows with every character. In contrast, the Custom Element `<x-character-count-fn>` expects the text to be given as function attribute. In this case, the DOM attribute only contains a function reference, which is constant in length.

## Keyed elements

Elements inside a collection can be equipped with a data-key attribute for identification:

```javascript
customElements.define('x-list', element(() => {
  const [list, setList] = useState([]);
  const [input, setInput] = useState('');
  return html`
    <ul>
      ${list.map(item => html`<li data-key="${item}">${item}</li>`)}
    </ul>
    <input
      value="${input}"
      oninput="${(event) => setInput(event.target.value)}"
    />
    <button
      type="button"
      onclick="${() => !list.includes(input) && setList([input, ...list])}"
    >Add to top</button>
  `;
}));
```

[Run example in REPL](https://adequatejs.org/repl.html?id=keyed-elements)

When adding a new item in the above example, the existing nodes remain unmodified. Without the data-key attributes, an addition would cause to modify every node.

## Accessing the DOM

The DOM node of a Custom Element instance can be accessed via `this` when using a regular function:

```javascript
customElements.define('x-card', element(function({ title, content }) {
  useEffect(() => {
    this.style.display = 'block';
    this.style.border = '1px solid black';
  }, []);
  return html`
    <h3>${title}</h3>
    <hr>
    <section>${content}</section>
  `;
}));

document.body.innerHTML =
  '<x-card title="Test card" content="Hello World!"></x-card>';
```

[Run example in REPL](https://adequatejs.org/repl.html?id=dom-access)

## Custom Events

Custom Events can be dispatched and listened to by utilizing the native DOM API:

```javascript
customElements.define('x-child', element(function() {
  setTimeout(() => {
    this.dispatchEvent(new CustomEvent('child-message', {bubbles: true}));
  }, 1000);
  return html`sending a message in 1 second`;
}));

customElements.define('x-parent', element(function() {
  const [wasMessageReceived, setMessageReceived] = useState(false);
  useEffect(() => {
    this.addEventListener('child-message', () => setMessageReceived(true));
  }, []);
  return html`
	  <x-child></x-child>
	  <br>
	  message received: ${wasMessageReceived ? 'yes' : 'no'}
  `;
}));
```

[Run example in REPL](https://adequatejs.org/repl.html?id=custom-events)

## Standalone Custom Elements

adequate can also be used to create standalone Custom Elements:

```javascript
const AdequateGreeter = element(
  ({'first-name': firstName, 'last-name': lastName}) => {
    return html`<p>Hello, ${firstName} ${lastName}</p>`;
  },
);

class Greeter extends AdequateGreeter {
  static get observedAttributes() {
    return ['first-name', 'last-name'];
  }
  attributeChangedCallback() {
    this.update();
  }
}

customElements.define('x-greeter', Greeter);
document.body.innerHTML =
  '<x-greeter first-name="Jim" last-name="Doe"></x-greeter>';

document.querySelector('x-greeter').setAttribute('first-name', 'James');
// Try changing the attributes directly in the Browser Dev Tools
```

[Run example in REPL](https://adequatejs.org/repl.html?id=standalone-custom-element)

The Custom Element `Greeter` reacts to attribute changes by calling the `update()` function of the element created with adequate.

## Typescript usage

The usage with TypeScript only requires type annotations when working with function attributes:

```typescript
customElements.define('x-app', element(() => {
  const [input, setInput] = useState('');
  return html`
    <input
      type="text"
      oninput="${(event) => setInput(event.target.value)}"
      value="${input}"
    />
    <hr>
    <x-character-count text="${input}"></x-character-count>
  `;
}));

// with typed argument
customElements.define(
  'x-character-count',
  element(({ text }: { text: () => string }) => {
    return html`Characters: ${text().length}`;
  }),
);

// with type parameter
customElements.define(
  'x-character-count',
  element<{ text: () => string }>(({ text }) => {
    return html`Characters: ${text().length}`;
  }),
);
```