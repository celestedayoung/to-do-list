function TodoActions(container, todos, completeAllCallback, deleteAllCallback) {
  this.container = container;
  this.todos = todos;
  this.completeAllCallback = completeAllCallback;
  this.deleteAllCallback = deleteAllCallback;

  this.init = () => {
    this.render();
    this.bindEvents();
  };

  this.render = () => {
    const hasAnyTodos = this.todos.length > 0;
    const hasIncompleteTodos = this.todos.some((todo) => !todo.isCompleted);

    this.container.innerHTML = `
      <div class="todo-actions">
        <button 
          class="complete-all-button" 
          ${!hasAnyTodos || !hasIncompleteTodos ? "disabled" : ""}
        >
          모두 완료
        </button>
        <button 
          class="delete-all-button"
          ${!hasAnyTodos ? "disabled" : ""}
        >
          모두 삭제
        </button>
      </div>
    `;
  };

  this.bindEvents = () => {
    const completeAllButton = this.container.querySelector(
      ".complete-all-button"
    );
    const deleteAllButton = this.container.querySelector(".delete-all-button");

    completeAllButton.addEventListener("click", this.handleCompleteAll);
    deleteAllButton.addEventListener("click", this.handleDeleteAll);
  };

  this.handleCompleteAll = () => {
    const hasIncompleteTodos = this.todos.some((todo) => !todo.isCompleted);

    if (!hasIncompleteTodos) {
      return;
    }

    if (confirm("모든 할 일을 완료 하시겠습니까?")) {
      this.completeAllCallback();
    }
  };

  this.handleDeleteAll = () => {
    if (this.todos.length === 0) {
      return;
    }

    if (confirm("모든 할 일을 삭제하시겠습니까?")) {
      this.deleteAllCallback();
    }
  };

  this.update = (newTodos) => {
    this.todos = newTodos;
    this.render();
    this.bindEvents();
  };

  this.init();
}

export default TodoActions;
