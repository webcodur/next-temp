/* 
  파일명: /components/view/login/Login.tsx
  기능: 로그인 페이지의 메인 뷰 컴포넌트
  책임: 로그인 폼을 표시하고 인증 처리를 관리한다.
*/

'use client';

import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/view/_etc/login/LoginForm';
import { Portal } from '@/components/ui/ui-layout/portal/Portal';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useI18n';

// #region 타입
interface LoginFormData {
	username: string;
	password: string;
	rememberUsername: boolean;
}
// #endregion

export default function LoginPage() {
	// #region 상수
	const { login, isLoading: authIsLoading } = useAuth();
	const { isRTL } = useLocale();
	// #endregion

	// #region 상태
	const [isLoginLoading, setIsLoginLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [fontLoaded, setFontLoaded] = useState(false);
	// #endregion

	// #region 폰트 로딩 확인
	useEffect(() => {
		const checkFontLoading = async () => {
			try {
				if ('fonts' in document) {
					await document.fonts.ready;
					setFontLoaded(true);
				} else {
					setFontLoaded(true);
				}
			} catch {
				setFontLoaded(true);
			}
		};

		checkFontLoading();
	}, []);
	// #endregion

	// #region 핸들러
	const handleLogin = async (data: LoginFormData) => {
		console.log('🔑 로그인 폼 제출:', data.username);
		
		setIsLoginLoading(true);
		setErrorMessage('');
		
		try {
			const result = await login(data.username, data.password);
			
			if (!result.success) {
				setErrorMessage(result.error || '로그인에 실패했습니다.');
				console.log('❌ 로그인 실패:', result.error);
			} else {
				console.log('✅ 로그인 성공, 리다이렉트 대기 중...');
			}
		} catch (error) {
			const errorMsg = '로그인 중 오류가 발생했습니다. API 서버 연결을 확인해주세요.';
			setErrorMessage(errorMsg);
			console.error('💥 로그인 예외:', error);
		} finally {
			setIsLoginLoading(false);
		}
	};
	// #endregion

	// #region 로딩 상태 처리
	// 인증 시스템 초기화 중
	if (authIsLoading) {
		return (
			<Portal containerId="login-portal">
				<div 
					className="flex fixed inset-0 z-50 justify-center items-center bg-background"
					dir={isRTL ? 'rtl' : 'ltr'}
				>
					<div className="space-y-4 text-center">
						<div className="inline-block w-8 h-8 rounded-full border-b-2 animate-spin border-primary"></div>
						<p className="text-muted-foreground font-multilang">
							🔍 인증 상태 확인 중...
						</p>
					</div>
				</div>
			</Portal>
		);
	}
	// #endregion

	// #region 렌더링
	return (
		<Portal containerId="login-portal">
			<div 
				className={`flex fixed inset-0 z-50 justify-center items-center bg-background font-multilang ${!fontLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
				dir={isRTL ? 'rtl' : 'ltr'}
				style={{ 
					fontFamily: "'MultiLang', 'Pretendard', 'Inter', 'Cairo', system-ui, sans-serif"
				}}
			>
				<div className="space-y-4 font-multilang">
					{/* 에러 메시지 */}
					{errorMessage && (
						<div className="p-3 text-sm rounded-lg border bg-destructive/10 text-destructive border-destructive/20 font-multilang">
							{errorMessage}
						</div>
					)}
					
					{/* 로그인 폼 */}
					<LoginForm 
						onSubmit={handleLogin} 
						isLoading={isLoginLoading}
					/>
				</div>
			</div>
		</Portal>
	);
	// #endregion
} 