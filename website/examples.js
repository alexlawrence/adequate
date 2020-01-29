const examples = [
  {
    name: 'Counter',
    code: `
customElements.define('x-counter', element(({ start }) => {
  const [value, setValue] = useState(parseInt(start));

  return html\`
    <div>Counter: \${value}</div>
    <button onclick="\${() => setValue(value + 1)}">Increment</button>
    <button onclick="\${() => setValue(value - 1)}">Decrement</button>
  \`;
}));

document.body.innerHTML = '<x-counter start="3"></x-counter>';
`,
  },
  {
    name: 'Todo List',
    code: `
customElements.define('x-todo-list',element(() => {
  const [state, setState] = useState({
    todos: [],
    newTodoText: '',
  });
  const onSubmit = event => {
    event.preventDefault();
    setState({
      newTodoText: '',
      todos: [...state.todos, { label: state.newTodoText, completed: false }],
    });
  };
  const toggleTodo = todo => {
    todo.completed = !todo.completed;
    setState({ ...state });
  };
  return html\`
    <h1>Todo List</h1>
    <form onSubmit="\${onSubmit}">
      <input
        name="text"
        value="\${state.newTodoText}"
        onInput="\${event => setState({ ...state, newTodoText: event.target.value })}"
      />
      <button type="submit">Add todo</button>
    </form>
    <strong>
      completed: \${state.todos.filter(todo => todo.completed).length} / \${state.todos.length}
    </strong>
    \${state.todos.map(
      todo =>
        html\`
          <div>
            <input
              type="checkbox"
              \${todo.completed ? 'checked' : ''}
              onInput="\${() => toggleTodo(todo)}"
            />
            \${todo.label}
          </div>
        \`
    )}
  \`;
}));

document.body.innerHTML = '<x-todo-list></x-todo-list>';
`,
  },
  {
    name: 'useReducer()',
    code: `

const useReducer = (reducer, initialState) => {
  const [state, setState] = useState(initialState);
  const dispatch = (action) => setState(reducer(state, action));
  return [state, dispatch];
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;    
  }
}

customElements.define('x-counter', element(() => {
  const [value, dispatch] = useReducer(reducer, 0);

  return html\`
    <div>Counter: \${value}</div>
    <button onclick="\${() => dispatch({type: 'INCREMENT'})}">Increment</button>
    <button onclick="\${() => dispatch({type: 'DECREMENT'})}">Decrement</button>
  \`;
}));

document.body.innerHTML = '<x-counter></x-counter>';
`,
  },
  {
    name: 'Data fetching',
    code: `
const useResource = (url) => {
  const [data, setData] = useState();
  if (!data) fetch(url).then(response => response.json()).then(setData);
  return [data];
};

customElements.define('x-last-commit', element(({ owner, repo }) => {
  const [data] = useResource(
    \`https://api.github.com/repos/\${owner}/\${repo}/commits/HEAD\`
  );
  if (!data) return html\`<p>Loading...</p>\`;

  return html\`
  <h1>\${owner}/\${repo}</h1>
    <p>Last commit message: \${data.commit.message}</p>
  \`;
}));

document.body.innerHTML = 
  '<x-last-commit owner="alexlawrence" repo="adequate"></x-last-commit>';
`,
  },
  {
    name: 'Standalone Custom Element',
    code: `
class Calculator extends element(({a, b, operator}) => {
  const expression = \`\${a} \${operator} \${b}\`;
  const result = new Function('return ' + expression)();
  return html\`
    <p>\${expression} = \${result}</p>
  \`;
}) {
  static get observedAttributes() { return ['a', 'b', 'operator']; }
  attributeChangedCallback() { this.update(); }
}

customElements.define('x-calculator', Calculator);

document.body.innerHTML = '<x-calculator a="3" operator="+" b="5"></x-calculator>';
// Try changing the attributes directly in the Browser Dev Tools
`,
  },
];

export default examples;
