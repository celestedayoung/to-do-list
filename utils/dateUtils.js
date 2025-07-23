/**
 * 날짜 관련 유틸리티 함수들을 제공하는 모듈
 */
export const DateUtils = {
  /**
   * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
   * @returns {string} YYYY-MM-DD 형식의 오늘 날짜
   */
  getTodayString() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  },

  /**
   * 날짜를 한국어 형식으로 포맷팅
   * @param {string} dateString - YYYY-MM-DD 형식의 날짜 문자열
   * @returns {string} 한국어 형식의 날짜 (예: 2024년 1월 15일)
   */
  formatToKorean(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  /**
   * 날짜를 간단한 형식으로 포맷팅
   * @param {string} dateString - YYYY-MM-DD 형식의 날짜 문자열
   * @returns {string} 간단한 형식의 날짜 (예: 1/15)
   */
  formatToShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
    });
  },

  /**
   * 요일을 포함한 날짜 포맷팅
   * @param {string} dateString - YYYY-MM-DD 형식의 날짜 문자열
   * @returns {string} 요일 포함 날짜 (예: 1/15 (월))
   */
  formatWithWeekday(dateString) {
    const date = new Date(dateString);
    const monthDay = date.toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
    });
    const weekday = date.toLocaleDateString("ko-KR", {
      weekday: "short",
    });
    return `${monthDay} (${weekday})`;
  },

  /**
   * 두 날짜가 같은 날인지 확인
   * @param {string} date1 - 첫 번째 날짜
   * @param {string} date2 - 두 번째 날짜
   * @returns {boolean} 같은 날짜인지 여부
   */
  isSameDate(date1, date2) {
    return date1 === date2;
  },

  /**
   * 할일 목록에서 고유한 날짜들만 추출
   * @param {Array} todos - 할일 목록 배열
   * @returns {Array<string>} 고유한 날짜들의 배열 (내림차순 정렬)
   */
  getUniqueDatesFromTodos(todos) {
    const dates = todos.map((todo) => todo.createdDate).filter(Boolean);
    return [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
  },

  /**
   * 특정 날짜의 할일들만 필터링
   * @param {Array} todos - 할일 목록 배열
   * @param {string|null} targetDate - 필터링할 날짜 (null이면 전체 반환)
   * @returns {Array} 필터링된 할일 목록
   */
  filterTodosByDate(todos, targetDate) {
    if (!targetDate) return todos;
    return todos.filter((todo) => todo.createdDate === targetDate);
  },

  /**
   * 할일 목록을 최신순으로 정렬
   * @param {Array} todos - 정렬할 할일 목록 배열
   * @returns {Array} 날짜별로 최신순 정렬된 할일 목록
   */
  sortTodosByDateDesc(todos) {
    return todos.sort((a, b) => {
      if (!a.createdDate && !b.createdDate) return 0;
      if (!a.createdDate) return 1;
      if (!b.createdDate) return -1;

      const dateA = new Date(a.createdDate);
      const dateB = new Date(b.createdDate);
      return dateB - dateA;
    });
  },

  /**
   * 날짜를 오늘, 어제, 또는 일반 날짜로 분류
   * @param {string} dateString - YYYY-MM-DD 형식의 날짜 문자열
   * @returns {string} 날짜 카테고리 (오늘, 어제, 또는 한국어 날짜)
   */
  getDateCategory(dateString) {
    const today = this.getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split("T")[0];

    if (dateString === today) return "오늘";
    if (dateString === yesterdayString) return "어제";
    return this.formatToKorean(dateString);
  },

  /**
   * 지정된 날짜에 일수를 더하거나 뺀 날짜 반환
   * @param {string} dateString - 기준 날짜
   * @param {number} days - 더할 일수 (음수 가능)
   * @returns {string} 계산된 날짜 (YYYY-MM-DD 형식)
   */
  addDays(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  },

  /**
   * 이전 날짜 반환
   * @param {string} dateString - 기준 날짜
   * @returns {string} 하루 전 날짜
   */
  getPreviousDate(dateString) {
    return this.addDays(dateString, -1);
  },

  /**
   * 다음 날짜 반환
   * @param {string} dateString - 기준 날짜
   * @returns {string} 하루 후 날짜
   */
  getNextDate(dateString) {
    return this.addDays(dateString, 1);
  },

  /**
   * 현재 필터 날짜에 대한 표시 텍스트 반환
   * @param {string|null} dateString - 필터 날짜 (null이면 "전체")
   * @returns {string} 표시할 텍스트
   */
  getFilterDisplayText(dateString) {
    if (!dateString) return "전체";
    return this.formatToKorean(dateString);
  },

  /**
   * 특정 날짜의 모든 할일이 완료되었는지 확인
   * @param {Array} todos - 전체 할일 목록
   * @param {string} dateString - 확인할 날짜 (YYYY-MM-DD 형식)
   * @returns {boolean} 해당 날짜의 모든 할일이 완료되었는지 여부
   */
  isDateCompleted(todos, dateString) {
    const dateTodos = this.filterTodosByDate(todos, dateString);
    return dateTodos.length > 0 && dateTodos.every((todo) => todo.isCompleted);
  },

  /**
   * 날짜별 축하 메시지 생성
   * @param {string} dateString - 완료된 날짜
   * @returns {string} 축하 메시지
   */
  getCongratulationMessage(dateString) {
    const category = this.getDateCategory(dateString);
    const messages = [
      `🎉 축하합니다! ${category}의 모든 할일을 완료했습니다!`,
      `✨ 대단해요! ${category} 할일을 모두 끝내셨네요!`,
      `🌟 훌륭합니다! ${category}의 목표를 달성했습니다!`,
      `🏆 완벽해요! ${category} 계획을 모두 실행하셨습니다!`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  },
};
