'use client';

// #region 임포트
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import ModalContainer from '@/components/ui/ui-layout/modal/unit/ModalContainer';
import { LoginForm } from './LoginForm';
import { loginAtom, isAuthenticatedAtom } from '@/store/auth';
import { loginModalOpenAtom, closeLoginModalAtom } from '@/store/loginModal';
import { useTranslations } from '@/hooks/useI18n';
// #endregion

// #region 타입
interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}
// #endregion

export function LoginModal() {
  // #region 상태 & 훅
  const [isOpen] = useAtom(loginModalOpenAtom);
  const [, closeModal] = useAtom(closeLoginModalAtom);
  const [, login] = useAtom(loginAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations();
  // #endregion

  // #region 인증 여부 변화 시 모달 닫기
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      closeModal();
    }
  }, [isAuthenticated, isOpen, closeModal]);
  // #endregion

  // #region 핸들러
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await login({ username: data.username, password: data.password });
      if (!result.success) {
        // 실패 시 메시지
        alert(result.error || t('로그인_메시지_실패'));
      }
      // 성공 시 closeModal 은 useEffect 에서 처리
    } catch (error) {
      console.error('로그인 오류:', error);
      alert(t('로그인_메시지_오류발생'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    closeModal();
  };
  // #endregion

  // #region 렌더링
  return (
    <ModalContainer isOpen={isOpen} onClose={handleClose}>
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </ModalContainer>
  );
  // #endregion
} 