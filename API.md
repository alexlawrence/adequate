# API

### `element(render, BaseClass = HTMLElement)`

The operation `element()` creates a Custom Element class. As arguments, it expects a render function and an optional base class (defaults to `HTMLElement`). The return value is a constructor that can be passed to `customElements.define()`. Note that the Custom Element types returned from this operation may not work as expected outside of adequate. Check the [REPL](https://adequatejs.org/repl.html) for an example on how to build a general purpose Custom Element.

The passed in function `render()` is called every time an element instance needs to update. Upon invocation, it receives an object that contains all HTML attributes of the associated DOM element and the operation `dispatch()`. As return value the operation must provide a list of Template Literal tokens (typically created with `html()`). Every function expression that is used as HTML event attribute value is extracted and replaced with a reference. The helper operation `dispatch()` can be used inside a render function to dispatch DOM events. Effectively, it is a thin wrapper around the operation `dispatchEvent()` on the according element.

While adequate takes care re-rendering elements whenever needed, there is also manual option. Every instance of a Custom Element type exposes the function `update()`.

### `html(strings, ...values)`

The operation `html()` is a tag function that transforms a Template Literal into a flattened and ordered list of tokens. Such a literal can contain an arbitrary combination of strings and expressions, including nested calls to the `html()` function itself. 

### `useState(initialState)`

The hook `useState()` works almost identical as the implementation in [React](https://reactjs.org/docs/hooks-reference.html#usestate). As single argument, it expects an initial state value. The return value is a tuple with the current state as first item and an update function as the second one. Performing an update inside a render function of an element causes it to be re-rendered automatically. 

One notable difference from the React implementation is that there is no support for the function updater form.