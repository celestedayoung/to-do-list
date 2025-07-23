import { model } from "../model/model.js";

const STORAGE_KEY = "to-do-list";

export const StorageUtil = {
  getTodos: () => {
    try {
      const userTodos = localStorage.getItem(STORAGE_KEY);
      const parsedUserTodos = userTodos ? JSON.parse(userTodos) : [];

      // 기본 model 데이터와 사용자가 추가한 데이터를 합쳐서 반환
      // model 데이터에 isDefault 플래그 추가하여 구분
      const modelWithFlag = model.map((todo) => ({ ...todo, isDefault: true }));
      const userWithFlag = parsedUserTodos.map((todo) => ({
        ...todo,
        isDefault: false,
      }));

      return [...modelWithFlag, ...userWithFlag];
    } catch (error) {
      return model.map((todo) => ({ ...todo, isDefault: true }));
    }
  },

  saveTodos: (todos) => {
    try {
      // 사용자가 추가한 할일들만 로컬 스토리지에 저장 (기본 데이터 제외)
      const userTodos = todos.filter((todo) => !todo.isDefault);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userTodos));
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
