const { createElement, Fragment, useState } = React;

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
  return createElement(
    Fragment,
    null,
    createElement('h1', null, 'Todo List'),
    createElement(
      'form',
      { onSubmit: addTodo },
      createElement('input', {
        type: 'text',
        value: state.newTodoText,
        onChange: event => setState({ newTodoText: event.target.value, todos: state.todos }),
      }),
      createElement('button', { type: 'submit' }, 'Add todo')
    ),
    createElement(
      'strong',
      null,
      `completed: ${state.todos.filter(todo => todo.completed).length} / ${state.todos.length}`
    ),
    ...state.todos.map(todo =>
      createElement(
        'div',
        null,
        createElement('input', {
          type: 'checkbox',
          checked: todo.completed,
          onChange: () => toggleTodo(todo),
        }),
        todo.label
      )
    )
  );
};

ReactDOM.render(createElement(TodoList), document.body);
