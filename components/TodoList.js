import { DateUtils } from "../utils/dateUtils.js";

function TodoList(
  container,
  todos,
  updateTodoCallback,
  deleteTodoCallback,
  allTodos = []
) {
  this.container = container;
  this.todos = todos;
  this.allTodos = allTodos; // 원본 전체 데이터
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
      .map((todo, displayIndex) => {
        // 원본 데이터에서 실제 인덱스 찾기
        const originalIndex = this.allTodos.findIndex(
          (originalTodo) =>
            originalTodo.name === todo.name &&
            originalTodo.createdDate === todo.createdDate &&
            originalTodo.isCompleted === todo.isCompleted
        );
        const isEditing = this.editingIndex === originalIndex;

        return `
        <div class="todo-item ${todo.isCompleted ? "completed" : ""}">
          <input 
            type="checkbox" 
            class="todo-checkbox"
            data-index="${originalIndex}"
            ${todo.isCompleted ? "checked" : ""}
            onchange="window.todoListInstance.toggleComplete(${originalIndex})"
          />
          ${
            isEditing
              ? `
            <div class="todo-edit-container">
              <input 
                type="text" 
                class="todo-edit-input" 
                value="${todo.name}"
                data-index="${originalIndex}"
                onkeypress="window.todoListInstance.handleEditKeypress(event, ${originalIndex}, this.value)"
              />
              <button 
                class="save-button"
                onclick="window.todoListInstance.saveEdit(${originalIndex})"
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
            <div class="todo-content">
              <span 
                class="todo-title ${todo.isCompleted ? "completed-text" : ""}" 
                data-index="${originalIndex}"
                onclick="window.todoListInstance.handleTitleClick(${originalIndex})"
              >
                ${todo.name}
              </span>
              ${
                todo.createdDate
                  ? `<span class="todo-date">${DateUtils.formatWithWeekday(
                      todo.createdDate
                    )}</span>`
                  : ""
              }
            </div>
            <button 
              class="delete-button" 
              data-index="${originalIndex}"
              onclick="window.todoListInstance.deleteTodo(${originalIndex})"
            >
              X
            </button>
          `
          }
        </div>
      `;
      })
      .join("");

    this.container.innerHTML = `
      <div class="todo-list-container">
        ${todoListHTML}
      </div>
    `;

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
      ...this.allTodos[index],
      isCompleted: !this.allTodos[index].isCompleted,
    });
  };

  this.handleTitleClick = (index) => {
    const todo = this.allTodos[index];
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

    if (trimmedValue !== this.allTodos[index].name) {
      this.updateTodoCallback(index, {
        ...this.allTodos[index],
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
    const todoToDelete = this.allTodos[index];
    if (confirm(`'${todoToDelete.name}'을(를) 삭제하시겠습니까?`)) {
      this.deleteTodoCallback(index);
    }
  };

  this.update = (newTodos, allTodos = []) => {
    this.todos = newTodos;
    this.allTodos = allTodos.length > 0 ? allTodos : newTodos;
    if (
      this.editingIndex !== null &&
      this.editingIndex >= this.allTodos.length
    ) {
      this.editingIndex = null;
    }
    this.render();
  };

  window.todoListInstance = this;

  this.init();
}

export default TodoList;
