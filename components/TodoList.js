import { DateUtils } from "../utils/dateUtils.js";

/**
 * 할일 목록을 표시하고 편집 기능을 제공하는 컴포넌트
 * @param {HTMLElement} container - 컴포넌트가 렌더링될 DOM 요소
 * @param {Array} todos - 표시할 할일 목록 (필터링된 데이터)
 * @param {Function} updateTodoCallback - 할일을 업데이트할 때 호출되는 콜백
 * @param {Function} deleteTodoCallback - 할일을 삭제할 때 호출되는 콜백
 * @param {Array} allTodos - 원본 전체 할일 데이터
 */
function TodoList(
  container,
  todos,
  updateTodoCallback,
  deleteTodoCallback,
  allTodos = []
) {
  this.container = container;
  this.todos = todos;
  this.allTodos = allTodos;
  this.updateTodoCallback = updateTodoCallback;
  this.deleteTodoCallback = deleteTodoCallback;
  this.editingIndex = null;

  /**
   * 컴포넌트를 초기화하고 렌더링
   */
  this.init = () => {
    this.render();
  };

  /**
   * 할일 목록을 렌더링 (빈 상태 포함)
   */
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

  /**
   * 할일의 완료 상태를 토글
   * @param {number} index - 토글할 할일의 인덱스
   */
  this.toggleComplete = (index) => {
    this.updateTodoCallback(index, {
      ...this.allTodos[index],
      isCompleted: !this.allTodos[index].isCompleted,
    });
  };

  /**
   * 할일 제목 클릭 시 편집 모드로 전환
   * @param {number} index - 편집할 할일의 인덱스
   */
  this.handleTitleClick = (index) => {
    const todo = this.allTodos[index];
    if (todo.isCompleted) {
      alert("완료된 할 일은 수정할 수 없습니다.");
      return;
    }
    this.editingIndex = index;
    this.render();
  };

  /**
   * 편집 모드에서 키보드 입력 처리
   * @param {KeyboardEvent} event - 키보드 이벤트
   * @param {number} index - 편집 중인 할일의 인덱스
   * @param {string} value - 현재 입력값
   */
  this.handleEditKeypress = (event, index, value) => {
    if (event.key === "Enter") {
      this.saveEdit(index, value);
    } else if (event.key === "Escape") {
      this.cancelEdit();
    }
  };

  /**
   * 편집된 할일을 저장
   * @param {number} index - 저장할 할일의 인덱스
   * @param {string} newValue - 새로운 할일 내용
   */
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

  /**
   * 편집 모드를 취소
   */
  this.cancelEdit = () => {
    this.editingIndex = null;
    this.render();
  };

  /**
   * 할일을 삭제
   * @param {number} index - 삭제할 할일의 인덱스
   */
  this.deleteTodo = (index) => {
    const todoToDelete = this.allTodos[index];
    if (confirm(`'${todoToDelete.name}'을(를) 삭제하시겠습니까?`)) {
      this.deleteTodoCallback(index);
    }
  };

  /**
   * 새로운 데이터로 컴포넌트를 업데이트
   * @param {Array} newTodos - 새로운 할일 목록 (필터링된 데이터)
   * @param {Array} allTodos - 새로운 전체 할일 데이터
   */
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
