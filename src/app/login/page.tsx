'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { LoginForm } from '@/components/layout/login/LoginForm';
import { loginAtom, isAuthenticatedAtom } from '@/store/auth';

interface LoginFormData {
	email: string;
	password: string;
}

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [, login] = useAtom(loginAtom);
	const [isAuthenticated] = useAtom(isAuthenticatedAtom);
	const router = useRouter();

	// 이미 로그인된 사용자는 홈으로 리다이렉트
	useEffect(() => {
		if (isAuthenticated) {
			router.push('/');
		}
	}, [isAuthenticated, router]);

	const handleLogin = async (data: LoginFormData) => {
		setIsLoading(true);

		try {
			const result = await login(data);

			if (result.success) {
				console.log('로그인 성공:', result.user);
				router.push('/');
			} else {
				console.error('로그인 실패:', result.error);
				// TODO: 에러 토스트 표시
				alert(result.error || '로그인에 실패했습니다.');
			}
		} catch (error) {
			console.error('로그인 처리 중 오류:', error);
			alert('로그인 처리 중 오류가 발생했습니다.');
		} finally {
			setIsLoading(false);
		}
	};

	// 이미 로그인된 경우 로딩 표시
	if (isAuthenticated) {
		return (
			<div className="p-4 text-center">
				<div className="mx-auto mb-4 w-8 h-8 rounded-full border-2 animate-spin border-primary border-t-transparent"></div>
				<p className="text-muted-foreground">홈으로 이동 중...</p>
			</div>
		);
	}

	return (
		<div className="p-4 w-full max-w-md">
			<LoginForm onSubmit={handleLogin} isLoading={isLoading} />
		</div>
	);
}
