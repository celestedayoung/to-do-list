import { DateUtils } from "../utils/dateUtils.js";

function TodoCounter(container, todos, currentDateFilter = null) {
  this.container = container;
  this.todos = todos;
  this.currentDateFilter = currentDateFilter;

  this.init = () => {
    this.render();
  };

  this.render = () => {
    const totalCount = this.todos.length;
    const completedCount = this.todos.filter((todo) => todo.isCompleted).length;

    const progressPercentage =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    this.container.innerHTML = `
      <div class="todo-counter">
        <div class="counter-info">
          <span class="count-display">${completedCount}/${totalCount}</span>
        </div>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
          </div>
          <span class="progress-percentage">${progressPercentage}%</span>
        </div>
      </div>
    `;
  };

  this.update = (newTodos, currentDateFilter = null) => {
    this.todos = newTodos;
    this.currentDateFilter = currentDateFilter;
    this.render();
  };

  this.init();
}

export default TodoCounter;
