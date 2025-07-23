import TodoList from "./components/TodoList.js";
import TodoInput from "./components/TodoInput.js";
import TodoCounter from "./components/TodoCounter.js";
import TodoActions from "./components/TodoActions.js";
import { StorageUtil } from "./utils/storage.js";
import { DateUtils } from "./utils/dateUtils.js";

/**
 * 할일 애플리케이션의 메인 컴포넌트
 */
function App() {
  this.data = [];
  this.filteredData = [];
  this.currentDateFilter = DateUtils.getTodayString();
  this.todoList = null;
  this.todoInput = null;
  this.todoCounter = null;
  this.todoActions = null;
  this.$todoList = document.querySelector("#todo-list");

  /**
   * 애플리케이션을 초기화하고 렌더링
   */
  this.init = () => {
    this.data = StorageUtil.getTodos();
    this.updateFilteredData();
    this.render();
  };

  /**
   * 새로운 데이터로 상태를 업데이트하고 모든 컴포넌트를 갱신
   * @param {Array} newData - 새로운 할일 데이터
   */
  this.setState = (newData) => {
    const oldData = [...this.data];
    this.data = newData;
    this.updateFilteredData();
    StorageUtil.saveTodos(this.data);

    this.checkForCompletion(oldData, newData);

    this.todoList.update(this.filteredData, this.data);
    this.todoCounter.update(this.filteredData, this.currentDateFilter);

    const dateNavigationContainer = document.querySelector("#date-navigation");
    const todoActionsContainer = document.querySelector("#todo-actions");
    if (dateNavigationContainer)
      this.renderDateNavigation(dateNavigationContainer);
    if (todoActionsContainer) this.renderTodoActions(todoActionsContainer);
  };

  /**
   * 할일 완료 시 축하 메시지 확인 및 표시
   * @param {Array} oldData - 이전 할일 데이터
   * @param {Array} newData - 새로운 할일 데이터
   */
  this.checkForCompletion = (oldData, newData) => {
    if (this.currentDateFilter) {
      const wasCompleted = DateUtils.isDateCompleted(
        oldData,
        this.currentDateFilter
      );
      const isNowCompleted = DateUtils.isDateCompleted(
        newData,
        this.currentDateFilter
      );

      if (!wasCompleted && isNowCompleted) {
        setTimeout(() => {
          alert(DateUtils.getCongratulationMessage(this.currentDateFilter));
        }, 300);
      }
    }
  };

  /**
   * 현재 날짜 필터에 따라 표시할 데이터를 업데이트
   */
  this.updateFilteredData = () => {
    if (this.currentDateFilter === null) {
      this.filteredData = DateUtils.sortTodosByDateDesc([...this.data]);
    } else {
      this.filteredData = DateUtils.filterTodosByDate(
        this.data,
        this.currentDateFilter
      );
    }
  };

  /**
   * 날짜 필터를 설정하고 관련 컴포넌트들을 업데이트
   * @param {string|null} dateFilter - 설정할 날짜 필터 (null이면 전체)
   */
  this.setDateFilter = (dateFilter) => {
    this.currentDateFilter = dateFilter;
    this.updateFilteredData();
    this.todoList.update(this.filteredData, this.data);
    this.todoCounter.update(this.filteredData, this.currentDateFilter);

    const dateNavigationContainer = document.querySelector("#date-navigation");
    if (dateNavigationContainer)
      this.renderDateNavigation(dateNavigationContainer);

    const todoActionsContainer = document.querySelector("#todo-actions");
    if (todoActionsContainer) this.renderTodoActions(todoActionsContainer);
  };

  /**
   * 이전 날짜로 이동
   */
  this.goToPreviousDate = () => {
    const currentDate = this.currentDateFilter || DateUtils.getTodayString();
    const previousDate = DateUtils.getPreviousDate(currentDate);
    this.setDateFilter(previousDate);
  };

  /**
   * 다음 날짜로 이동
   */
  this.goToNextDate = () => {
    const currentDate = this.currentDateFilter || DateUtils.getTodayString();
    const nextDate = DateUtils.getNextDate(currentDate);
    this.setDateFilter(nextDate);
  };

  /**
   * 오늘 날짜로 이동
   */
  this.goToToday = () => {
    this.setDateFilter(DateUtils.getTodayString());
  };

  /**
   * 전체 할일 보기로 전환
   */
  this.showAllTodos = () => {
    this.setDateFilter(null);
  };

  /**
   * 새로운 할일을 추가
   * @param {Object} newTodo - 추가할 할일 객체
   */
  this.addTodo = (newTodo) => {
    const updatedData = [...this.data, newTodo];
    this.setState(updatedData);
  };

  /**
   * 기존 할일을 업데이트
   * @param {number} index - 업데이트할 할일의 인덱스
   * @param {Object} updatedTodo - 업데이트된 할일 객체
   */
  this.updateTodo = (index, updatedTodo) => {
    const updatedData = this.data.map((todo, i) =>
      i === index ? updatedTodo : todo
    );
    this.setState(updatedData);
  };

  /**
   * 할일을 삭제
   * @param {number} index - 삭제할 할일의 인덱스
   */
  this.deleteTodo = (index) => {
    const updatedData = this.data.filter((_, i) => i !== index);
    this.setState(updatedData);
  };

  /**
   * 모든 할일을 완료 상태로 변경
   */
  this.completeAllTodos = () => {
    const updatedData = this.data.map((todo) => ({
      ...todo,
      isCompleted: true,
    }));
    this.setState(updatedData);
  };

  /**
   * 모든 할일을 삭제
   */
  this.deleteAllTodos = () => {
    this.setState([]);
  };

  /**
   * 메인 애플리케이션 UI를 렌더링
   */
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
        <div class="date-display">${dateString}</div>
        <div id="todo-input"></div>
        <div id="date-navigation"></div>
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

  /**
   * 날짜 네비게이션 UI를 렌더링
   * @param {HTMLElement} container - 렌더링할 컨테이너 요소
   */
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

  /**
   * 할일 관리 액션 버튼들을 렌더링
   * @param {HTMLElement} container - 렌더링할 컨테이너 요소
   */
  this.renderTodoActions = (container) => {
    const hasAnyTodos = this.data.length > 0;
    const hasIncompleteTodos = this.data.some((todo) => !todo.isCompleted);

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
