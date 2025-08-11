/**
 * 날짜 포맷팅 유틸리티 함수들
 * 다양한 날짜 표시 형태를 제공한다
 */

// #region 타입 정의
type DateInput = string | Date | null | undefined;
// #endregion

// #region 메인 포맷팅 함수들
/**
 * 날짜를 yy.mm.dd 형태로 포맷팅한다
 * @param dateInput - 날짜 문자열, Date 객체, null, undefined
 * @returns yy.mm.dd 형태의 문자열 또는 '-'
 * @example
 * formatToShortDate('2024-01-15') // '24.01.15'
 * formatToShortDate(new Date(2024, 0, 15)) // '24.01.15'
 * formatToShortDate(null) // '-'
 */
export const formatToShortDate = (dateInput: DateInput): string => {
  if (!dateInput) return '-';
  
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    // 유효하지 않은 날짜 확인
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    const year = date.getFullYear().toString().slice(-2); // 마지막 2자리
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}.${month}.${day}`;
  } catch (error) {
    console.warn('날짜 포맷팅 실패:', error);
    return '-';
  }
};

/**
 * 날짜를 yyyy.mm.dd 형태로 포맷팅한다
 * @param dateInput - 날짜 문자열, Date 객체, null, undefined
 * @returns yyyy.mm.dd 형태의 문자열 또는 '-'
 */
export const formatToFullDate = (dateInput: DateInput): string => {
  if (!dateInput) return '-';
  
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}.${month}.${day}`;
  } catch (error) {
    console.warn('날짜 포맷팅 실패:', error);
    return '-';
  }
};

/**
 * 날짜를 mm/dd 형태로 포맷팅한다
 * @param dateInput - 날짜 문자열, Date 객체, null, undefined
 * @returns mm/dd 형태의 문자열 또는 '-'
 */
export const formatToMonthDay = (dateInput: DateInput): string => {
  if (!dateInput) return '-';
  
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${month}/${day}`;
  } catch (error) {
    console.warn('날짜 포맷팅 실패:', error);
    return '-';
  }
};
// #endregion

// #region 시간 포함 포맷팅
/**
 * 날짜와 시간을 yy.mm.dd hh:mm:ss 형태로 포맷팅한다
 * @param dateInput - 날짜 문자열, Date 객체, null, undefined
 * @returns yy.mm.dd hh:mm:ss 형태의 문자열 또는 '-'
 */
export const formatToShortDateTime = (dateInput: DateInput): string => {
  if (!dateInput) return '-';
  
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.warn('날짜시간 포맷팅 실패:', error);
    return '-';
  }
};
// #endregion

// #region 유틸리티 함수들
/**
 * 오늘 날짜인지 확인한다
 * @param dateInput - 확인할 날짜
 * @returns 오늘 날짜면 true
 */
export const isToday = (dateInput: DateInput): boolean => {
  if (!dateInput) return false;
  

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const today = new Date();
  
  return date.toDateString() === today.toDateString();

};

/**
 * 날짜가 유효한지 확인한다
 * @param dateInput - 확인할 날짜
 * @returns 유효한 날짜면 true
 */
export const isValidDate = (dateInput: DateInput): boolean => {
  if (!dateInput) return false;
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return !isNaN(date.getTime());
};
// #endregion

// #region 기본 내보내기
/**
 * 가장 자주 사용될 함수들의 간편한 접근
 */
const dateFormat = {
  // 주요 포맷팅 함수들
  short: formatToShortDate,        // yy.mm.dd
  full: formatToFullDate,          // yyyy.mm.dd
  monthDay: formatToMonthDay,      // mm/dd
  shortDateTime: formatToShortDateTime, // yy.mm.dd hh:mm:ss
  
  // 유틸리티
  isToday,
  isValidDate,
};

export default dateFormat;
// #endregion
