const { Fragment, h, render } = window.preact;
const { useState } = window.preactHooks;

const TodoList = () => {
  const [state, setState] = useState({ newTodoText: '', todos: [] });
  const addTodo = event => {
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
  return h(
    Fragment,
    null,
    h('h1', null, 'Todo List'),
    h(
      'form',
      { onSubmit: addTodo },
      h('input', {
        type: 'text',
        value: state.newTodoText,
        onChange: event => setState({ newTodoText: event.target.value, todos: state.todos }),
      }),
      h('button', { type: 'submit' }, 'Add todo')
    ),
    h(
      'strong',
      null,
      `completed: ${state.todos.filter(todo => todo.completed).length} / ${state.todos.length}`
    ),
    ...state.todos.map(todo =>
      h(
        'div',
        null,
        h('input', {
          type: 'checkbox',
          checked: todo.completed,
          onInput: () => toggleTodo(todo),
        }),
        todo.label
      )
    )
  );
};

render(h(TodoList), document.body);
