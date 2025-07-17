/* 
  파일명: /components/view/login/Login.tsx
  기능: 로그인 페이지의 메인 뷰 컴포넌트
  책임: 로그인 폼을 모달로 표시하고 인증 처리 및 리다이렉트를 관리한다.
*/

'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/layout/login/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useI18n';
// import { initThemeAtom } from '@/store/theme';

// #region 타입
interface LoginFormData {
	username: string;
	password: string;
	rememberUsername: boolean;
}

interface LoginPageProps {
	onLoginSuccess?: () => void;
}
// #endregion

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
	// #region 상수
	const { login } = useAuth();
	const { isRTL } = useLocale();
	// #endregion

	// #region 상태
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	// #endregion


	// #region 핸들러
	const handleLogin = async (data: LoginFormData) => {
		setIsLoading(true);
		setErrorMessage('');

		try {
			console.log('로그인 시도 (실제 API 연동):', {
				username: data.username,
				password: '***',
				rememberUsername: data.rememberUsername,
			});

			const result = await login(data.username, data.password);

			if (result.success) {
				console.log('로그인 성공');
				onLoginSuccess?.();
			} else {
				console.error('로그인 실패:', result.error);
				setErrorMessage(result.error || '로그인에 실패했습니다.');
			}
		} catch (error) {
			console.error('로그인 처리 중 오류:', error);
			setErrorMessage('로그인 중 오류가 발생했습니다. API 서버 연결을 확인해주세요.');
		} finally {
			setIsLoading(false);
		}
	};

	// #endregion

	// #region 렌더링
	return (
		<div className="flex fixed inset-0 z-50 justify-center items-center bg-background font-multilang" dir={isRTL ? 'rtl' : 'ltr'}>
			<div className="space-y-4">
				{errorMessage && (
					<div className="p-3 text-sm rounded-lg border bg-destructive/10 text-destructive border-destructive/20">
						{errorMessage}
					</div>
				)}
				<LoginForm onSubmit={handleLogin} isLoading={isLoading} />
			</div>
		</div>
	);
	// #endregion
} 