'use client';

import { useAtom } from 'jotai';
import { useEffect, useTransition } from 'react';
import { signInWithCredentials } from '../services/auth/auth_signin_POST';
import { logout as logoutAction } from '../services/auth/auth_logout_GET';
import { isAuthenticatedAtom, userAtom } from '../store/auth';

/**
 * 전역 상태 기반 인증 훅
 */
export function useAuth() {
  const [isPending, startTransition] = useTransition();
  const [isLoggedIn, setIsLoggedIn] = useAtom(isAuthenticatedAtom);
  const [user, setUser] = useAtom(userAtom);

  // 초기 토큰 확인 - 쿠키만 체크
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access-token='))
      ?.split('=')[1];
    
    // 쿠키 토큰 유무와 로그인 상태 동기화
    if (token && !isLoggedIn) {
      setIsLoggedIn(true);
    } else if (!token && isLoggedIn) {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [isLoggedIn, setIsLoggedIn, setUser]);

  /**
   * 로그인
   */
  const login = async (account: string, password: string) => {
    const result = await signInWithCredentials(account, password);

    if (!result.success) {
      return { success: false, error: result.errorMsg || '로그인 실패' };
    }

    if (!result.data?.accessToken) {
      return { success: false, error: '토큰을 받지 못했습니다' };
    }

    // 쿠키에만 토큰 저장 (24시간)
    document.cookie = `access-token=${result.data.accessToken}; path=/; max-age=86400`;
    
    // 로그인 상태만 업데이트
    setIsLoggedIn(true);
    
    // 사용자 정보가 있다면 설정
    if (result.data.user) {
      setUser(result.data.user);
    }

    return { success: true };
  };

  /**
   * 로그아웃
   */
  const logout = async () => {
    startTransition(async () => {
      await logoutAction();
      
      // 쿠키 제거
      document.cookie = 'access-token=; path=/; max-age=0';
      
      // 상태 초기화
      setIsLoggedIn(false);
      setUser(null);
    });
  };

  return {
    isLoggedIn,
    isLoading: false,
    login,
    logout,
    isPending,
    user,
  };
} 