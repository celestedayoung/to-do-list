import TodoList from "./components/TodoList.js";
import TodoInput from "./components/TodoInput.js";
import TodoCounter from "./components/TodoCounter.js";
import TodoActions from "./components/TodoActions.js";
import { StorageUtil } from "./utils/storage.js";

function App() {
  this.data = [];
  this.todoList = null;
  this.todoInput = null;
  this.todoCounter = null;
  this.todoActions = null;
  this.$todoList = document.querySelector("#todo-list");

  this.init = () => {
    this.data = StorageUtil.getTodos();
    this.render();
  };

  this.setState = (newData) => {
    this.data = newData;
    StorageUtil.saveTodos(this.data);
    this.todoList.update(this.data);
    this.todoCounter.update(this.data);
    this.todoActions.update(this.data);
  };

  this.addTodo = (newTodo) => {
    const updatedData = [...this.data, newTodo];
    this.setState(updatedData);
  };

  this.updateTodo = (index, updatedTodo) => {
    const updatedData = this.data.map((todo, i) =>
      i === index ? updatedTodo : todo
    );
    this.setState(updatedData);
  };

  this.deleteTodo = (index) => {
    const updatedData = this.data.filter((_, i) => i !== index);
    this.setState(updatedData);
  };

  this.completeAllTodos = () => {
    const updatedData = this.data.map((todo) => ({
      ...todo,
      isCompleted: true,
    }));
    this.setState(updatedData);
  };

  this.deleteAllTodos = () => {
    this.setState([]);
  };

  this.render = () => {
    this.$todoList.innerHTML = `
      <div class="app-container">
        <h1>Todo List</h1>
        <div id="todo-input"></div>
        <div id="todo-counter"></div>
        <div id="todo-actions"></div>
        <div id="todo-list-content"></div>
      </div>
    `;

    const todoInputContainer = document.querySelector("#todo-input");
    const todoCounterContainer = document.querySelector("#todo-counter");
    const todoActionsContainer = document.querySelector("#todo-actions");
    const todoListContainer = document.querySelector("#todo-list-content");

    this.todoInput = new TodoInput(todoInputContainer, this.addTodo);

    this.todoCounter = new TodoCounter(todoCounterContainer, this.data);

    this.todoActions = new TodoActions(
      todoActionsContainer,
      this.data,
      this.completeAllTodos,
      this.deleteAllTodos
    );

    this.todoList = new TodoList(
      todoListContainer,
      this.data,
      this.updateTodo,
      this.deleteTodo
    );
  };

  this.init();
}

export default App;
