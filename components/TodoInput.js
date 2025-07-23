import { DateUtils } from "../utils/dateUtils.js";

/**
 * 새로운 할일을 입력하고 추가하는 컴포넌트
 * @param {HTMLElement} container - 컴포넌트가 렌더링될 DOM 요소
 * @param {Function} addTodoCallback - 새로운 할일을 추가할 때 호출되는 콜백 함수
 */
function TodoInput(container, addTodoCallback) {
  this.container = container;
  this.addTodoCallback = addTodoCallback;
  this.inputElement = null;
  this.buttonElement = null;

  /**
   * 컴포넌트를 초기화하고 렌더링
   */
  this.init = () => {
    this.render();
    this.bindEvents();
  };

  /**
   * 할일 입력 폼을 렌더링
   */
  this.render = () => {
    this.container.innerHTML = `
      <div class="todo-input-container">
        <input 
          type="text" 
          class="todo-input" 
          placeholder="할 일을 입력하세요"
          maxlength="100"
        />
        <button class="add-button">추가</button>
      </div>
    `;

    this.inputElement = this.container.querySelector(".todo-input");
    this.buttonElement = this.container.querySelector(".add-button");
  };

  /**
   * 이벤트 리스너를 바인딩
   */
  this.bindEvents = () => {
    this.buttonElement.addEventListener("click", this.handleAddTodo);

    this.inputElement.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleAddTodo();
      }
    });
  };

  /**
   * 새로운 할일을 추가하는 핸들러
   */
  this.handleAddTodo = () => {
    const todoText = this.inputElement.value.trim();

    if (todoText === "") {
      alert("할 일을 입력해주세요!");
      return;
    }

    const newTodo = {
      name: todoText,
      isCompleted: false,
      createdDate: DateUtils.getTodayString(),
    };

    this.addTodoCallback(newTodo);

    this.inputElement.value = "";
    this.inputElement.focus();
  };

  this.init();
}

export default TodoInput;
