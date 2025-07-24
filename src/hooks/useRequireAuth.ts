/* 
  파일명: /hooks/useRequireAuth.ts
  기능: 인증 필수 페이지 보호 훅
  책임: 미인증 사용자를 로그인 페이지로 리다이렉트
  
  주요 기능:
  - 로그인 상태 확인
  - 미인증 시 자동 리다이렉트
*/ // ------------------------------

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

// 특정 페이지에서 호출 시 인증이 안되어 있으면 로그인 페이지로 리다이렉트
export function useRequireAuth() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  return isLoggedIn;
} 