function TodoList(container, todos, updateTodoCallback, deleteTodoCallback) {
  this.container = container;
  this.todos = todos;
  this.updateTodoCallback = updateTodoCallback;
  this.deleteTodoCallback = deleteTodoCallback;

  this.init = () => {
    this.render();
  };

  this.render = () => {
    if (this.todos.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>등록된 할 일이 없습니다.</p>
          <p>새로운 할 일을 추가해보세요:)</p>
        </div>
      `;
      return;
    }

    const todoListHTML = this.todos
      .map((todo, index) => {
        return `
        <div class="todo-item ${todo.isCompleted ? "completed" : ""}">
          <span 
            class="todo-title ${todo.isCompleted ? "completed-text" : ""}" 
            data-index="${index}"
            onclick="window.todoListInstance.toggleComplete(${index})"
          >
            ${todo.name}
          </span>
          <button 
            class="delete-button" 
            data-index="${index}"
            onclick="window.todoListInstance.deleteTodo(${index})"
          >
            삭제
          </button>
        </div>
      `;
      })
      .join("");

    this.container.innerHTML = `
      <div class="todo-list-container">
        ${todoListHTML}
      </div>
    `;
  };

  this.toggleComplete = (index) => {
    this.updateTodoCallback(index, {
      ...this.todos[index],
      isCompleted: !this.todos[index].isCompleted,
    });
  };

  this.deleteTodo = (index) => {
    if (confirm("정말로 이 할 일을 삭제하시겠습니까?")) {
      this.deleteTodoCallback(index);
    }
  };

  this.update = (newTodos) => {
    this.todos = newTodos;
    this.render();
  };

  window.todoListInstance = this;

  this.init();
}

export default TodoList;
