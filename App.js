import TodoList from "./components/TodoList.js";
import TodoInput from "./components/TodoInput.js";
import TodoCounter from "./components/TodoCounter.js";
import TodoActions from "./components/TodoActions.js";
import { StorageUtil } from "./utils/storage.js";
import { DateUtils } from "./utils/dateUtils.js";

function App() {
  this.data = [];
  this.filteredData = [];
  this.currentDateFilter = DateUtils.getTodayString(); // 기본값을 오늘로 설정
  this.todoList = null;
  this.todoInput = null;
  this.todoCounter = null;
  this.todoActions = null;
  this.$todoList = document.querySelector("#todo-list");

  this.init = () => {
    this.data = StorageUtil.getTodos();
    this.updateFilteredData();
    this.render();
  };

  this.setState = (newData) => {
    this.data = newData;
    this.updateFilteredData();
    StorageUtil.saveTodos(this.data);
    this.todoList.update(this.filteredData, this.data);
    this.todoCounter.update(this.filteredData, this.currentDateFilter);

    // 분리된 컴포넌트들 업데이트
    const dateNavigationContainer = document.querySelector("#date-navigation");
    const todoActionsContainer = document.querySelector("#todo-actions");
    if (dateNavigationContainer)
      this.renderDateNavigation(dateNavigationContainer);
    if (todoActionsContainer) this.renderTodoActions(todoActionsContainer);
  };

  this.updateFilteredData = () => {
    if (this.currentDateFilter === null) {
      // 전체 보기일 때는 최신순으로 정렬
      this.filteredData = DateUtils.sortTodosByDateDesc([...this.data]);
    } else {
      // 특정 날짜 필터일 때는 해당 날짜만 필터링
      this.filteredData = DateUtils.filterTodosByDate(
        this.data,
        this.currentDateFilter
      );
    }
  };

  this.setDateFilter = (dateFilter) => {
    this.currentDateFilter = dateFilter;
    this.updateFilteredData();
    this.todoList.update(this.filteredData, this.data);
    this.todoCounter.update(this.filteredData, this.currentDateFilter);

    // 날짜 네비게이션 업데이트
    const dateNavigationContainer = document.querySelector("#date-navigation");
    if (dateNavigationContainer)
      this.renderDateNavigation(dateNavigationContainer);

    // 액션 버튼들도 업데이트하여 활성화 상태 반영
    const todoActionsContainer = document.querySelector("#todo-actions");
    if (todoActionsContainer) this.renderTodoActions(todoActionsContainer);
  };

  // 날짜 네비게이션 메서드들
  this.goToPreviousDate = () => {
    const currentDate = this.currentDateFilter || DateUtils.getTodayString();
    const previousDate = DateUtils.getPreviousDate(currentDate);
    this.setDateFilter(previousDate);
  };

  this.goToNextDate = () => {
    const currentDate = this.currentDateFilter || DateUtils.getTodayString();
    const nextDate = DateUtils.getNextDate(currentDate);
    this.setDateFilter(nextDate);
  };

  this.goToToday = () => {
    this.setDateFilter(DateUtils.getTodayString());
  };

  this.showAllTodos = () => {
    this.setDateFilter(null);
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
    const today = new Date();
    const dateString = today.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    this.$todoList.innerHTML = `
      <div class="app-container">
        <h1>Todo List</h1>
        <div id="date-navigation"></div>
        <div id="todo-input"></div>
        <div id="todo-counter"></div>
        <div id="todo-actions"></div>
        <div id="todo-list-content"></div>
      </div>
    `;

    const todoInputContainer = document.querySelector("#todo-input");
    const dateNavigationContainer = document.querySelector("#date-navigation");
    const todoCounterContainer = document.querySelector("#todo-counter");
    const todoActionsContainer = document.querySelector("#todo-actions");
    const todoListContainer = document.querySelector("#todo-list-content");

    this.todoInput = new TodoInput(todoInputContainer, this.addTodo);

    this.renderDateNavigation(dateNavigationContainer);

    this.todoCounter = new TodoCounter(
      todoCounterContainer,
      this.filteredData,
      this.currentDateFilter
    );

    this.renderTodoActions(todoActionsContainer);

    this.todoList = new TodoList(
      todoListContainer,
      this.filteredData,
      this.updateTodo,
      this.deleteTodo,
      this.data
    );
  };

  this.renderDateNavigation = (container) => {
    const currentDisplayText = DateUtils.getFilterDisplayText(
      this.currentDateFilter
    );

    container.innerHTML = `
      <div class="date-navigation-section">
        <div class="date-navigation">
          <button class="nav-button prev-button" id="prev-date">‹</button>
          <span class="current-date-display" id="current-date">${currentDisplayText}</span>
          <button class="nav-button next-button" id="next-date">›</button>
        </div>
      </div>
    `;

    const prevButton = container.querySelector("#prev-date");
    const nextButton = container.querySelector("#next-date");

    prevButton.addEventListener("click", this.goToPreviousDate);
    nextButton.addEventListener("click", this.goToNextDate);
  };

  this.renderTodoActions = (container) => {
    const hasAnyTodos = this.data.length > 0;
    const hasIncompleteTodos = this.data.some((todo) => !todo.isCompleted);

    // 현재 필터 상태 확인
    const isToday = this.currentDateFilter === DateUtils.getTodayString();
    const isAll = this.currentDateFilter === null;

    container.innerHTML = `
      <div class="actions-container">
        <div class="date-actions">
          <button class="date-action-button ${
            isToday ? "active" : ""
          }" id="today-button">오늘</button>
          <button class="date-action-button ${
            isAll ? "active" : ""
          }" id="all-button">전체</button>
        </div>
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

    const completeAllButton = container.querySelector(".complete-all-button");
    const deleteAllButton = container.querySelector(".delete-all-button");
    const todayButton = container.querySelector("#today-button");
    const allButton = container.querySelector("#all-button");

    completeAllButton.addEventListener("click", () => {
      const hasIncompleteTodos = this.data.some((todo) => !todo.isCompleted);
      if (!hasIncompleteTodos) return;
      if (confirm("모든 할 일을 완료 하시겠습니까?")) {
        this.completeAllTodos();
      }
    });

    deleteAllButton.addEventListener("click", () => {
      if (this.data.length === 0) return;
      if (confirm("모든 할 일을 삭제하시겠습니까?")) {
        this.deleteAllTodos();
      }
    });

    todayButton.addEventListener("click", this.goToToday);
    allButton.addEventListener("click", this.showAllTodos);
  };

  this.init();
}

export default App;
