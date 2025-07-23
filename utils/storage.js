import { model } from "../model/model.js";

const STORAGE_KEY = "to-do-list";

/**
 * 로컬 스토리지를 관리하는 유틸리티 모듈
 */
export const StorageUtil = {
  /**
   * 로컬 스토리지에서 할일 목록을 가져와서 기본 모델 데이터와 병합
   * @returns {Array} 기본 데이터와 사용자 데이터가 합쳐진 할일 목록
   */
  getTodos: () => {
    try {
      const userTodos = localStorage.getItem(STORAGE_KEY);
      const parsedUserTodos = userTodos ? JSON.parse(userTodos) : [];

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

  /**
   * 사용자가 추가한 할일들만 로컬 스토리지에 저장
   * @param {Array} todos - 저장할 전체 할일 목록
   * @returns {boolean} 저장 성공 여부
   */
  saveTodos: (todos) => {
    try {
      const userTodos = todos.filter((todo) => !todo.isDefault);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userTodos));
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * 로컬 스토리지에서 할일 데이터를 모두 삭제
   * @returns {boolean} 삭제 성공 여부
   */
  clearTodos: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  },
};
