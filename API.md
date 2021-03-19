# API

<p class="subtitle">Basic API description</p>

### `element(render)`

The function `element()` creates a Custom Element class. As only argument, it expects a render operation. The return value is a constructor that can be passed to `customElements.define()`. Note that the Custom Element classes returned from this function may not work as expected outside of adequate. Check the [Guide](https://adequatejs.org/guide.html) for an explanation on how to build a general-purpose Custom Element.

The provided render operation is called every time an element instance needs to update. As argument, it receives an object that contains all HTML attributes of the associated DOM element. Also, for regular functions, `this` is bound to the DOM element. The render operation must yield a list of tokens created via `html()`. Functions that are used as HTML attribute are extracted and replaced with a reference. If an element receives a function from a parent, it is correctly serialized and de-serialized.

adequate takes care of re-rendering elements when needed. For this purpose, every instance of a Custom Element type exposes the function `update()`. This function should normally not be called manually. One exception is when building Standalone Custom Elements.

### `html(strings, ...expressions)`

The operation `html()` is a tag function that transforms a Template Literal into a flattened and ordered list of tokens. Such a literal can contain an arbitrary combination of strings and expressions, including nested calls to the `html()` function itself.

### `useEffect(effectFn, dependencies)`

The hook `useEffect()` expects an effect function and a dependencies array as arguments. The effect function is called once initially and every time a dependency changes. An empty dependency array causes the function to be only executed once.

This hook is almost identical to the implementation in React or Preact. Please refer to the [React documentation](https://reactjs.org/docs/hooks-reference.html#useeffect) or the [Preact documentation](https://preactjs.com/guide/v10/hooks/#useeffect) for a more detailed explanation. One difference is the missing support for an invocation without dependencies.

### `useState(initialState)`

The function `useState()` expects an initial state as argument. The return value is a tuple with the current state as first item and an update function as the second one. Performing a state update causes the according element to be re-rendered automatically.

This hook is almost identical to the implementation in React or Preact. Please refer to the [React documentation](https://reactjs.org/docs/hooks-reference.html#usestate) or the [Preact documentation](https://preactjs.com/guide/v10/hooks/#usestate) for a more detailed explanation. One difference is the missing support for the function updater form.