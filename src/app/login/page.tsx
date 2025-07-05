'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // 백엔드 연결 전까지 임시 주석처리
import { useAtom } from 'jotai';
import { LoginForm } from '@/components/layout/login/LoginForm';
import { loginAtom } from '@/store/auth';
import { useTranslations } from '@/hooks/useI18n';
// import { isAuthenticatedAtom } from '@/store/auth'; // 백엔드 연결 전까지 임시 주석처리

interface LoginFormData {
	email: string;
	password: string;
	rememberMe: boolean;
}

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [, login] = useAtom(loginAtom);
	const t = useTranslations();
	// const [isAuthenticated] = useAtom(isAuthenticatedAtom); // 백엔드 연결 전까지 임시 주석처리
	// const router = useRouter(); // 백엔드 연결 전까지 임시 주석처리

	// 이미 로그인된 사용자는 홈으로 리다이렉트 - 백엔드 연결 전까지 임시 주석처리
	/* useEffect(() => {
		if (isAuthenticated) {
			router.push('/');
		}
	}, [isAuthenticated, router]); */

	const handleLogin = async (data: LoginFormData) => {
		setIsLoading(true);

		try {
			// rememberMe 옵션 로깅 (개발용)
			console.log('로그인 데이터:', {
				email: data.email,
				password: '***',
				rememberMe: data.rememberMe,
			});

			const result = await login({
				email: data.email,
				password: data.password,
			});

			if (result.success) {
				console.log('로그인 성공:', result.user);
				// router.push('/'); // 백엔드 연결 전까지 임시 주석처리
			alert(t('로그인_메시지_성공개발모드'));
			} else {
				console.error('로그인 실패:', result.error);
				// TODO: 에러 토스트 표시
			alert(result.error || t('로그인_메시지_실패'));
			}
		} catch (error) {
			console.error('로그인 처리 중 오류:', error);
		alert(t('로그인_메시지_오류발생'));
		} finally {
			setIsLoading(false);
		}
	};

	// 이미 로그인된 경우 로딩 표시 - 백엔드 연결 전까지 임시 주석처리
	/* if (isAuthenticated) {
		return (
			<div className="p-4 text-center">
				<div className="mx-auto mb-4 w-8 h-8 rounded-full border-2 animate-spin border-primary border-t-transparent"></div>
				<p className="text-muted-foreground">{t('로그인_메시지_이동중')}</p>
			</div>
		);
	} */

	return (
		<div className="p-4 w-full max-w-md">
			<LoginForm onSubmit={handleLogin} isLoading={isLoading} />
		</div>
	);
}
