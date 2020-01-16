# API

<p class="subtitle">Brief API description</p>

**Note:** The standalone file of adequate exports the following functions as properties `e`, `h` and `u` on the object `window.adequate`. The ES Module file exports the operations as properties with their full name.

`element(renderFunction, BaseClass = HTMLElement)`

The operation `element()` is responsible for creating a Custom Element type. As arguments, it expects a render function and an optional base class, which defaults to `HTMLElement`. The return value is a class that can be passed to `customElements.define()`. The provided render function is called every time an element instance needs to update. As argument, it receives an object that contains all HTML attributes from the associated DOM element the `dispatch()` function. The return value of a render function must be a list of Template Literal tokens (typically created though `html()`). Every function expression that is used as HTML attribute value is automatically correctly converted.

The helper function `dispatch()` can be used inside an element render function to dispatch DOM events, both built-in and custom. Effectively, it is only a thin wrapper around the operation `dispatchEvent()` on the DOM element of the respective instance. The main advantage is that it is easy to use in arrow functions.

`html(strings, ...values)`

The operation `html()` is a Template Literal tag function that expects an HTML Template Literal. This may consist of arbitrary strings and expressions, including nested calls to `html()`. The return value is a flattened and ordered list of Template Literal tokens. 

`useState(initialState)`

The hook `useState()` works very similar to the implementation of [React](https://reactjs.org/docs/hooks-reference.html#usestate). One notable difference is that it only supports simple values for state updates, but not the function updater form.