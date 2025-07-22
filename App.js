import TodoList from "./components/TodoList.js";
import TodoInput from "./components/TodoInput.js";
import { model } from "./model/model.js";

function App() {
  this.data = [];
  this.todoList = null;
  this.todoInput = null;
  this.$todoList = document.querySelector("#todo-list");

  this.init = () => {
    this.data = [...model];
    this.render();
  };

  this.setState = (newData) => {
    this.data = newData;
    this.todoList.update(this.data);
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

  this.render = () => {
    this.$todoList.innerHTML = `
      <div class="app-container">
        <h1>Todo List</h1>
        <div id="todo-input"></div>
        <div id="todo-list-content"></div>
      </div>
    `;

    const todoInputContainer = document.querySelector("#todo-input");
    const todoListContainer = document.querySelector("#todo-list-content");

    this.todoInput = new TodoInput(todoInputContainer, this.addTodo);

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
