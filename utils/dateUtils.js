// 날짜 관련 유틸리티 함수들

export const DateUtils = {
  // 오늘 날짜를 YYYY-MM-DD 형식으로 반환
  getTodayString() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  },

  // 날짜를 한국어 형식으로 포맷팅 (예: 2024년 1월 15일)
  formatToKorean(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // 날짜를 간단한 형식으로 포맷팅 (예: 1/15)
  formatToShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
    });
  },

  // 요일 포함 포맷팅 (예: 1/15 (월))
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

  // 두 날짜가 같은 날인지 확인
  isSameDate(date1, date2) {
    return date1 === date2;
  },

  // 할일 목록에서 고유한 날짜들만 추출
  getUniqueDatesFromTodos(todos) {
    const dates = todos.map((todo) => todo.createdDate).filter(Boolean);
    return [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));
  },

  // 특정 날짜의 할일들만 필터링
  filterTodosByDate(todos, targetDate) {
    if (!targetDate) return todos;
    return todos.filter((todo) => todo.createdDate === targetDate);
  },

  // 할일 목록을 최신순으로 정렬 (날짜별로 그룹화하여 최신 날짜부터)
  sortTodosByDateDesc(todos) {
    return todos.sort((a, b) => {
      // 날짜가 없는 경우 맨 뒤로
      if (!a.createdDate && !b.createdDate) return 0;
      if (!a.createdDate) return 1;
      if (!b.createdDate) return -1;

      // 날짜 비교 (최신순)
      const dateA = new Date(a.createdDate);
      const dateB = new Date(b.createdDate);
      return dateB - dateA;
    });
  },

  // 오늘, 어제, 그 외 날짜 구분
  getDateCategory(dateString) {
    const today = this.getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split("T")[0];

    if (dateString === today) return "오늘";
    if (dateString === yesterdayString) return "어제";
    return this.formatToKorean(dateString);
  },

  // 날짜 네비게이션을 위한 함수들
  addDays(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  },

  getPreviousDate(dateString) {
    return this.addDays(dateString, -1);
  },

  getNextDate(dateString) {
    return this.addDays(dateString, 1);
  },

  // 현재 필터 날짜에 대한 표시 텍스트
  getFilterDisplayText(dateString) {
    if (!dateString) return "전체";
    return this.formatToKorean(dateString);
  },
};
