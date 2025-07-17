'use client';

import { useState, useEffect, useTransition } from 'react';
import { signInWithCredentials } from '../services/auth/auth_signin_POST';
import { logout as logoutAction } from '../services/auth/auth_logout_GET';

/**
 * 클라이언트 기반 인증 훅 - SSR 호환
 */
export function useAuth() {
  const [isPending, startTransition] = useTransition();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 클라이언트에서만 토큰 확인
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access-token='))
      ?.split('=')[1];
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

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

    // 쿠키에 토큰 저장 (24시간)
    document.cookie = `access-token=${result.data.accessToken}; path=/; max-age=86400`;
    setIsLoggedIn(true);
    return { success: true };
  };

  /**
   * 로그아웃
   */
  const logout = async () => {
    startTransition(async () => {
      await logoutAction();
      
      // 쿠키 제거 및 상태 업데이트
      document.cookie = 'access-token=; path=/; max-age=0';
      setIsLoggedIn(false);
      // router.push 제거 - 조건부 렌더링으로 자동 처리됨
    });
  };

  return {
    isLoggedIn,
    isLoading,
    login,
    logout,
    isPending,
  };
} 