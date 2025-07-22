function TodoInput(container, addTodoCallback) {
  this.container = container;
  this.addTodoCallback = addTodoCallback;
  this.inputElement = null;
  this.buttonElement = null;

  this.init = () => {
    this.render();
    this.bindEvents();
  };

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

  this.bindEvents = () => {
    this.buttonElement.addEventListener("click", this.handleAddTodo);

    // 엔터키 이벤트
    this.inputElement.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleAddTodo();
      }
    });
  };

  this.handleAddTodo = () => {
    const todoText = this.inputElement.value.trim();

    if (todoText === "") {
      alert("할 일을 입력해주세요!");
      return;
    }

    const newTodo = {
      name: todoText,
      isCompleted: false,
    };

    this.addTodoCallback(newTodo);

    this.inputElement.value = "";
    this.inputElement.focus();
  };

  this.init();
}

export default TodoInput;
