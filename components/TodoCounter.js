import { DateUtils } from "../utils/dateUtils.js";

/**
 * 할일 진행률과 통계를 표시하는 컴포넌트
 * @param {HTMLElement} container - 컴포넌트가 렌더링될 DOM 요소
 * @param {Array} todos - 표시할 할일 목록
 * @param {string|null} currentDateFilter - 현재 적용된 날짜 필터
 */
function TodoCounter(container, todos, currentDateFilter = null) {
  this.container = container;
  this.todos = todos;
  this.currentDateFilter = currentDateFilter;

  /**
   * 컴포넌트를 초기화하고 렌더링
   */
  this.init = () => {
    this.render();
  };

  /**
   * 진행률과 통계 정보를 렌더링
   */
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

  /**
   * 새로운 데이터로 컴포넌트를 업데이트
   * @param {Array} newTodos - 새로운 할일 목록
   * @param {string|null} currentDateFilter - 새로운 날짜 필터
   */
  this.update = (newTodos, currentDateFilter = null) => {
    this.todos = newTodos;
    this.currentDateFilter = currentDateFilter;
    this.render();
  };

  this.init();
}

export default TodoCounter;
