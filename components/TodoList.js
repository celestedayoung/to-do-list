function TodoList($container, data) {
  this.$container = $container
  this.data = data

  this.render = function () {
    this.$container.innerHTML = `<ul>${this.data
      .map(todo => `<li>${todo.name}<button type="button">X</button></li>`)
      .join('')} </ul>`
  }

  this.render()
}

export default TodoList
