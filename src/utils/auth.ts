/**
 * 인증 관련 유틸리티 함수들
 */

import { isValidToken, getUserFromToken } from './token';

/**
 * 클라이언트 측 인증 상태 확인
 */
export function checkAuthStatus(
  setIsLoggedIn: (value: boolean) => void,
  logout: () => void
): boolean {
  if (typeof window === 'undefined') return false;

  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('access-token='))
    ?.split('=')[1];

  const isValid = isValidToken(token);
  
  if (!isValid) {
    setIsLoggedIn(false);
    logout();
    return false;
  }
  
  setIsLoggedIn(true);
  return true;
}

/**
 * 쿠키에서 토큰 가져오기
 */
export function getTokenFromCookie(): string | null {
  if (typeof window === 'undefined') return null;
  
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('access-token='))
    ?.split('=')[1] || null;
}

/**
 * 현재 사용자 정보 가져오기
 */
export function getCurrentUser() {
  const token = getTokenFromCookie();
  return token ? getUserFromToken(token) : null;
}

/**
 * 관리자 권한 확인
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

/**
 * 특정 권한 확인
 */
export function hasRole(role: string): boolean {
  const user = getCurrentUser();
  return user?.role === role;
} 