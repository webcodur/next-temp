/* 
  파일명: /components/view/login/Login.tsx
  기능: 로그인 페이지의 메인 뷰 컴포넌트
  책임: 로그인 폼을 모달로 표시하고 인증 처리 및 리다이렉트를 관리한다.
*/

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAtom } from 'jotai';

import { LoginForm } from '@/components/layout/login/LoginForm';
import ModalContainer from '@/components/ui/ui-layout/modal/unit/ModalContainer';
import { useTranslations } from '@/hooks/useI18n';
import { loginAtom, isAuthenticatedAtom } from '@/store/auth';

// #region 타입
interface LoginFormData {
	username: string;
	password: string;
	rememberMe: boolean;
}
// #endregion

export default function LoginPage() {
	// #region 상수
	const router = useRouter();
	const t = useTranslations();
	const [, login] = useAtom(loginAtom);
	const [isAuthenticated] = useAtom(isAuthenticatedAtom);
	// #endregion

	// #region 상태
	const [isLoading, setIsLoading] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(true);
	// #endregion

	// #region 훅
	// 이미 로그인된 사용자는 홈으로 리다이렉트
	useEffect(() => {
		if (isAuthenticated) {
			router.push('/');
		}
	}, [isAuthenticated, router]);
	// #endregion

	// #region 핸들러
	const handleLogin = async (data: LoginFormData) => {
		setIsLoading(true);

		try {
			// rememberMe 옵션 로깅 (개발용)
			console.log('로그인 데이터:', {
				username: data.username,
				password: '***',
				rememberMe: data.rememberMe,
			});

			const result = await login({
				username: data.username,
				password: data.password,
			});

			if (result.success) {
				console.log('로그인 성공:', result.user);
				// 로그인 성공 시 홈으로 리다이렉트
				router.push('/');
			} else {
				console.error('로그인 실패:', result.error);
				alert(result.error || t('로그인_메시지_실패'));
			}
		} catch (error) {
			console.error('로그인 처리 중 오류:', error);
			alert(t('로그인_메시지_오류발생'));
		} finally {
			setIsLoading(false);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		router.push('/');
	};
	// #endregion

	// #region 렌더링
	// 이미 로그인된 경우 로딩 표시
	if (isAuthenticated) {
		return (
			<div className="p-4 text-center">
				<div className="mx-auto mb-4 w-8 h-8 rounded-full border-2 animate-spin border-primary border-t-transparent"></div>
				<p className="text-muted-foreground">{t('로그인_메시지_이동중')}</p>
			</div>
		);
	}

	return (
		<ModalContainer isOpen={isModalOpen} onClose={handleCloseModal}>
			<LoginForm onSubmit={handleLogin} isLoading={isLoading} />
		</ModalContainer>
	);
	// #endregion
} 