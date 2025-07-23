import { DateUtils } from "../utils/dateUtils.js";

/**
 * 날짜 네비게이션과 할일 관리 액션 버튼들을 제공하는 컴포넌트
 * @param {HTMLElement} container - 컴포넌트가 렌더링될 DOM 요소
 * @param {Array} todos - 할일 목록
 * @param {Function} completeAllCallback - 모든 할일을 완료할 때 호출되는 콜백
 * @param {Function} deleteAllCallback - 모든 할일을 삭제할 때 호출되는 콜백
 * @param {string|null} currentDateFilter - 현재 적용된 날짜 필터
 * @param {Function} goToPreviousDate - 이전 날짜로 이동하는 콜백
 * @param {Function} goToNextDate - 다음 날짜로 이동하는 콜백
 * @param {Function} goToToday - 오늘로 이동하는 콜백
 * @param {Function} showAllTodos - 전체 할일을 보여주는 콜백
 */
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

  /**
   * 컴포넌트를 초기화하고 렌더링
   */
  this.init = () => {
    this.render();
    this.bindEvents();
  };

  /**
   * 날짜 네비게이션과 액션 버튼들을 렌더링
   */
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

  /**
   * 모든 버튼에 이벤트 리스너를 바인딩
   */
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

  /**
   * 모든 할일을 완료 처리하는 핸들러
   */
  this.handleCompleteAll = () => {
    const hasIncompleteTodos = this.todos.some((todo) => !todo.isCompleted);

    if (!hasIncompleteTodos) {
      return;
    }

    if (confirm("모든 할 일을 완료 하시겠습니까?")) {
      this.completeAllCallback();
    }
  };

  /**
   * 모든 할일을 삭제하는 핸들러
   */
  this.handleDeleteAll = () => {
    if (this.todos.length === 0) {
      return;
    }

    if (confirm("모든 할 일을 삭제하시겠습니까?")) {
      this.deleteAllCallback();
    }
  };

  /**
   * 새로운 데이터로 컴포넌트를 업데이트
   * @param {Array} newTodos - 새로운 할일 목록
   * @param {string|null} currentDateFilter - 새로운 날짜 필터
   */
  this.update = (newTodos, currentDateFilter) => {
    this.todos = newTodos;
    this.currentDateFilter = currentDateFilter;
    this.render();
    this.bindEvents();
  };

  this.init();
}

export default TodoActions;
