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

    const barLength = 10;
    const filledBars = Math.round((progressPercentage / 100) * barLength);
    const emptyBars = barLength - filledBars;
    const progressBar = "■".repeat(filledBars) + "□".repeat(emptyBars);

    this.container.innerHTML = `
      <div class="todo-counter">
        <div class="counter-info">
          <span class="completed-count">완료: ${completedCount}</span>
          <span class="total-count">전체: ${totalCount}</span>
          <span class="remaining-count">남은 일: ${remainingCount}</span>
        </div>
        <div class="progress-text">
          진행률: ${progressBar} ${progressPercentage}%
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
