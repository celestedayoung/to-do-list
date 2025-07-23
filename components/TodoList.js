function TodoList(container, todos, updateTodoCallback, deleteTodoCallback) {
  this.container = container;
  this.todos = todos;
  this.updateTodoCallback = updateTodoCallback;
  this.deleteTodoCallback = deleteTodoCallback;
  this.editingIndex = null;

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
        const isEditing = this.editingIndex === index;

        return `
        <div class="todo-item ${todo.isCompleted ? "completed" : ""}">
          <input 
            type="checkbox" 
            class="todo-checkbox"
            data-index="${index}"
            ${todo.isCompleted ? "checked" : ""}
            onchange="window.todoListInstance.toggleComplete(${index})"
          />
          ${
            isEditing
              ? `
            <div class="todo-edit-container">
              <input 
                type="text" 
                class="todo-edit-input" 
                value="${todo.name}"
                data-index="${index}"
                onkeypress="window.todoListInstance.handleEditKeypress(event, ${index}, this.value)"
              />
              <button 
                class="save-button"
                onclick="window.todoListInstance.saveEdit(${index})"
              >
                저장
              </button>
              <button 
                class="cancel-button"
                onclick="window.todoListInstance.cancelEdit()"
              >
                취소
              </button>
            </div>
          `
              : `
            <span 
              class="todo-title ${todo.isCompleted ? "completed-text" : ""}" 
              data-index="${index}"
              onclick="window.todoListInstance.handleTitleClick(${index})"
            >
              ${todo.name}
            </span>
            <button 
              class="delete-button" 
              data-index="${index}"
              onclick="window.todoListInstance.deleteTodo(${index})"
            >
              X
            </button>
          `
          }
        </div>
      `;
      })
      .join("");

    this.container.innerHTML = todoListHTML;

    if (this.editingIndex !== null) {
      const editInput = this.container.querySelector(".todo-edit-input");
      if (editInput) {
        editInput.focus();
        editInput.select();
      }
    }
  };

  this.toggleComplete = (index) => {
    this.updateTodoCallback(index, {
      ...this.todos[index],
      isCompleted: !this.todos[index].isCompleted,
    });
  };

  this.handleTitleClick = (index) => {
    const todo = this.todos[index];
    if (todo.isCompleted) {
      alert("완료된 할 일은 수정할 수 없습니다.");
      return;
    }
    this.editingIndex = index;
    this.render();
  };

  this.handleEditKeypress = (event, index, value) => {
    if (event.key === "Enter") {
      this.saveEdit(index, value);
    } else if (event.key === "Escape") {
      this.cancelEdit();
    }
  };

  this.saveEdit = (index, newValue) => {
    if (newValue === undefined) {
      const editInput = this.container.querySelector(".todo-edit-input");
      newValue = editInput ? editInput.value : "";
    }

    const trimmedValue = newValue.trim();

    if (trimmedValue === "") {
      alert("할 일 내용을 입력해주세요!");
      return;
    }

    if (trimmedValue !== this.todos[index].name) {
      this.updateTodoCallback(index, {
        ...this.todos[index],
        name: trimmedValue,
      });
    }

    this.editingIndex = null;
    this.render();
  };

  this.cancelEdit = () => {
    this.editingIndex = null;
    this.render();
  };

  this.deleteTodo = (index) => {
    const todoToDelete = this.todos[index];
    if (confirm(`'${todoToDelete.name}'을(를) 삭제하시겠습니까?`)) {
      this.deleteTodoCallback(index);
    }
  };

  this.update = (newTodos) => {
    this.todos = newTodos;
    if (this.editingIndex !== null && this.editingIndex >= this.todos.length) {
      this.editingIndex = null;
    }
    this.render();
  };

  window.todoListInstance = this;

  this.init();
}

export default TodoList;
