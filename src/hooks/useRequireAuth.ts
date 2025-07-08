import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { isAuthenticatedAtom } from '@/store/auth';
import { openLoginModalAtom } from '@/store/loginModal';

// 특정 페이지에서 호출 시 인증이 안되어 있으면 로그인 모달을 연다.
export function useRequireAuth() {
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [, openLoginModal] = useAtom(openLoginModalAtom);

  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated, openLoginModal]);

  return isAuthenticated;
} 