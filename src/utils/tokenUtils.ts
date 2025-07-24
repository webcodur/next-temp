/* 
  파일명: /utils/tokenUtils.ts
  기능: 토큰 쿠키 관리 유틸리티
  책임: 쿠키 기반 토큰 저장/조회/삭제
*/ // ------------------------------

// #region 상수 정의
const DEFAULT_TOKEN_MAX_AGE = 86400; // 24시간 (초 단위)
export const ACCESS_TOKEN_NAME = 'access-token';
export const REFRESH_TOKEN_NAME = 'refresh-token';
// #endregion

// #region 쿠키 관리 유틸리티
// 쿠키에서 토큰 값 추출
export const getTokenFromCookie = (tokenName: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${tokenName}=`))
    ?.split('=')[1] || null;
};

// 쿠키에 토큰 저장
export const setTokenToCookie = (tokenName: string, token: string, maxAge: number = DEFAULT_TOKEN_MAX_AGE) => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${tokenName}=${token}; path=/; max-age=${maxAge}`;
};

// 쿠키에서 토큰 삭제
export const removeTokenFromCookie = (tokenName: string) => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${tokenName}=; path=/; max-age=0`;
};

// 모든 토큰 쿠키 삭제
export const clearAllTokens = () => {
  removeTokenFromCookie(ACCESS_TOKEN_NAME);
  removeTokenFromCookie(REFRESH_TOKEN_NAME);
};
// #endregion 