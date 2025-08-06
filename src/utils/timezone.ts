/**
 * UTC 시간을 사용자의 로컬 시간대로 변환하는 유틸리티
 * DB에 저장된 UTC 시간을 클라이언트의 시간대에 맞게 표시
 */

// #region 타입 정의
export interface TimezoneInfo {
  timezone: string;
  offset: number;
  offsetString: string;
  country?: string;
  city?: string;
}

export interface FormatOptions {
  format?: 'date' | 'time' | 'datetime' | 'relative';
  locale?: string;
  includeSeconds?: boolean;
  use24Hour?: boolean;
}
// #endregion

// #region 시간대 감지
/**
 * 사용자의 현재 시간대 정보를 가져온다
 */
export const getUserTimezone = (): TimezoneInfo => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  const offset = -now.getTimezoneOffset(); // 분 단위
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  const offsetString = `${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;

  return {
    timezone,
    offset,
    offsetString,
    city: timezone.split('/').pop()?.replace(/_/g, ' '),
    country: timezone.split('/')[0]
  };
};

/**
 * IP 기반으로 시간대를 추정한다 (선택적)
 * 실제 구현시에는 IP geolocation 서비스 필요
 */
export const getTimezoneFromIP = async (): Promise<string | null> => {
  try {
    // 예시: worldtimeapi.org 활용
    const response = await fetch('https://worldtimeapi.org/api/ip');
    const data = await response.json();
    return data.timezone;
  } catch (error) {
    console.warn('IP 기반 시간대 감지 실패:', error);
    return null;
  }
};
// #endregion

// #region UTC 변환 함수
/**
 * UTC 시간 문자열을 로컬 시간으로 변환
 */
export const utcToLocal = (utcString: string): Date => {
  // UTC 문자열이 'Z'로 끝나지 않으면 추가
  const utcWithZ = utcString.endsWith('Z') ? utcString : utcString + 'Z';
  return new Date(utcWithZ);
};

/**
 * 로컬 시간을 UTC로 변환
 */
export const localToUtc = (localDate: Date): string => {
  return localDate.toISOString();
};

/**
 * UTC 타임스탬프를 로컬 시간으로 변환
 */
export const timestampToLocal = (timestamp: number): Date => {
  return new Date(timestamp);
};
// #endregion

// #region 포맷팅 함수
/**
 * 날짜를 사용자 친화적 형태로 포맷팅
 */
export const formatDateTime = (
  utcString: string,
  options: FormatOptions = {}
): string => {
  const {
    format = 'datetime',
    locale = 'ko-KR',
    includeSeconds = false,
    use24Hour = true
  } = options;

  const localDate = utcToLocal(utcString);

  switch (format) {
    case 'date':
      return localDate.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

    case 'time':
      return localDate.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: includeSeconds ? '2-digit' : undefined,
        hour12: !use24Hour
      });

    case 'datetime':
      return localDate.toLocaleString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: includeSeconds ? '2-digit' : undefined,
        hour12: !use24Hour
      });

    case 'relative':
      return formatRelativeTime(localDate);

    default:
      return localDate.toLocaleString(locale);
  }
};

/**
 * 상대적 시간 표시 (예: "2시간 전", "방금 전")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric'
  });
};

/**
 * 간단한 날짜 포맷 (YYYY-MM-DD)
 */
export const formatDate = (utcString: string): string => {
  const localDate = utcToLocal(utcString);
  return localDate.toISOString().split('T')[0];
};

/**
 * 간단한 시간 포맷 (HH:MM)
 */
export const formatTime = (utcString: string): string => {
  const localDate = utcToLocal(utcString);
  return localDate.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};
// #endregion

// #region 시간 계산 유틸리티
/**
 * 두 UTC 시간 사이의 차이를 계산
 */
export const getTimeDifference = (
  startUtc: string,
  endUtc: string
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
} => {
  const start = utcToLocal(startUtc);
  const end = utcToLocal(endUtc);
  const totalMs = Math.abs(end.getTime() - start.getTime());

  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, totalMs };
};

/**
 * 현재 시간이 특정 UTC 시간 범위 내에 있는지 확인
 */
export const isInTimeRange = (
  startUtc: string,
  endUtc: string
): boolean => {
  const now = new Date();
  const start = utcToLocal(startUtc);
  const end = utcToLocal(endUtc);
  
  return now >= start && now <= end;
};

/**
 * UTC 시간이 오늘인지 확인
 */
export const isToday = (utcString: string): boolean => {
  const date = utcToLocal(utcString);
  const today = new Date();
  
  return date.toDateString() === today.toDateString();
};

/**
 * UTC 시간이 어제인지 확인
 */
export const isYesterday = (utcString: string): boolean => {
  const date = utcToLocal(utcString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return date.toDateString() === yesterday.toDateString();
};
// #endregion

// #region 기본 내보내기
/**
 * 가장 자주 사용될 함수들의 간편한 접근
 */
const timezone = {
  // 변환
  utcToLocal,
  localToUtc,
  timestampToLocal,
  
  // 포맷팅
  formatDateTime,
  formatDate,
  formatTime,
  formatRelativeTime,
  
  // 유틸리티
  getUserTimezone,
  getTimeDifference,
  isToday,
  isYesterday,
  isInTimeRange
};

export default timezone;
// #endregion