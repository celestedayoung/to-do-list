import { DateUtils } from "../utils/dateUtils.js";

function TodoActions(
  container,
  todos,
  completeAllCallback,
  deleteAllCallback,
  currentDateFilter,
  goToPreviousDate,
  goToNextDate,
  goToToday,
  showAllTodos
) {
  this.container = container;
  this.todos = todos;
  this.completeAllCallback = completeAllCallback;
  this.deleteAllCallback = deleteAllCallback;
  this.currentDateFilter = currentDateFilter;
  this.goToPreviousDate = goToPreviousDate;
  this.goToNextDate = goToNextDate;
  this.goToToday = goToToday;
  this.showAllTodos = showAllTodos;

  this.init = () => {
    this.render();
    this.bindEvents();
  };

  this.render = () => {
    const hasAnyTodos = this.todos.length > 0;
    const hasIncompleteTodos = this.todos.some((todo) => !todo.isCompleted);
    const currentDisplayText = DateUtils.getFilterDisplayText(
      this.currentDateFilter
    );

    this.container.innerHTML = `
      <div class="date-navigation-section">
        <div class="date-navigation">
          <button class="nav-button prev-button" id="prev-date">‹</button>
          <span class="current-date-display" id="current-date">${currentDisplayText}</span>
          <button class="nav-button next-button" id="next-date">›</button>
        </div>
        <div class="date-actions">
          <button class="date-action-button" id="today-button">오늘</button>
          <button class="date-action-button" id="all-button">전체</button>
        </div>
      </div>
      <div class="todo-actions-section">
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
      </div>
    `;
  };

  this.bindEvents = () => {
    const completeAllButton = this.container.querySelector(
      ".complete-all-button"
    );
    const deleteAllButton = this.container.querySelector(".delete-all-button");
    const prevButton = this.container.querySelector("#prev-date");
    const nextButton = this.container.querySelector("#next-date");
    const todayButton = this.container.querySelector("#today-button");
    const allButton = this.container.querySelector("#all-button");

    completeAllButton.addEventListener("click", this.handleCompleteAll);
    deleteAllButton.addEventListener("click", this.handleDeleteAll);
    prevButton.addEventListener("click", this.goToPreviousDate);
    nextButton.addEventListener("click", this.goToNextDate);
    todayButton.addEventListener("click", this.goToToday);
    allButton.addEventListener("click", this.showAllTodos);
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

  this.update = (newTodos, currentDateFilter) => {
    this.todos = newTodos;
    this.currentDateFilter = currentDateFilter;
    this.render();
    this.bindEvents();
  };

  this.init();
}

export default TodoActions;
