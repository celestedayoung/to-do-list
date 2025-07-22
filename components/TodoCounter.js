function TodoCounter(container, todos) {
  this.container = container;
  this.todos = todos;

  this.init = () => {
    this.render();
  };

  this.render = () => {
    const totalCount = this.todos.length;
    const completedCount = this.todos.filter((todo) => todo.isCompleted).length;
    const remainingCount = totalCount - completedCount;

    const progressPercentage =
      totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    this.container.innerHTML = `
      <div class="todo-counter">
        <div class="counter-info">
          <span class="completed-count">완료: ${completedCount}</span>
          <span class="total-count">전체: ${totalCount}</span>
          <span class="remaining-count">남은 일: ${remainingCount}</span>
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

  this.update = (newTodos) => {
    this.todos = newTodos;
    this.render();
  };

  this.init();
}

export default TodoCounter;
