const { e: element, h: html, u: useState } = window.adequate;

customElements.define(
  'x-todo-list',
  element(() => {
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
    return html`
      <h1>Todo List</h1>
      <form onSubmit="${onSubmit}">
        <input
          name="text"
          value="${state.newTodoText}"
          onInput="${event => setState({ ...state, newTodoText: event.target.value })}"
        />
        <button type="submit">Add todo</button>
      </form>
      <strong>
        completed: ${state.todos.filter(todo => todo.completed).length} / ${state.todos.length}
      </strong>
      ${state.todos.map(
        todo =>
          html`
            <div>
              <input
                type="checkbox"
                ${todo.completed ? 'checked' : ''}
                onInput="${() => toggleTodo(todo)}"
              />
              ${todo.label}
            </div>
          `
      )}
    `;
  })
);

document.body.innerHTML = '<x-todo-list></x-todo-list>';
