const STORAGE_KEY = "to-do-list";

export const StorageUtil = {
  getTodos: () => {
    try {
      const todos = localStorage.getItem(STORAGE_KEY);
      return todos ? JSON.parse(todos) : [];
    } catch (error) {
      return [];
    }
  },

  saveTodos: (todos) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      return true;
    } catch (error) {
      return false;
    }
  },

  clearTodos: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  },
};
