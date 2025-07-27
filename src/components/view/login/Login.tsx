/* 
  파일명: /components/view/login/Login.tsx
  기능: 로그인 페이지의 메인 뷰 컴포넌트
  책임: 로그인 폼을 모달로 표시하고 인증 처리 및 리다이렉트를 관리한다.
*/

'use client';

import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { LoginForm } from '@/components/layout/login/LoginForm';
import { Portal } from '@/components/ui/ui-layout/portal/Portal';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useI18n';
import { isAuthenticatedAtom, parkingLotsAtom, selectedParkingLotIdAtom } from '@/store/auth';
import { setTokenToCookie, ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/utils/tokenUtils';
// import { initThemeAtom } from '@/store/theme';

// #region 타입
interface LoginFormData {
	username: string;
	password: string;
	rememberUsername: boolean;
}
// #endregion

export default function LoginPage() {
	// #region 상수
	const { login } = useAuth();
	const { isRTL } = useLocale();
	const [, setIsLoggedIn] = useAtom(isAuthenticatedAtom);
	const [, setParkingLots] = useAtom(parkingLotsAtom);
	const [, setSelectedParkingLotId] = useAtom(selectedParkingLotIdAtom);
	
	// 개발자 모드 체크
	const isDevelopment = process.env.NODE_ENV === 'development';
	// #endregion

	// #region 상태
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [fontLoaded, setFontLoaded] = useState(false);
	// #endregion

	// #region 폰트 로딩 확인
	useEffect(() => {
		// 폰트 로딩 확인
		const checkFontLoading = async () => {
			try {
				if ('fonts' in document) {
					await document.fonts.ready;
					setFontLoaded(true);
				} else {
					// 폰트 API를 지원하지 않는 브라우저는 즉시 렌더링
					setFontLoaded(true);
				}
			} catch {
				// 폰트 로딩 실패 시에도 렌더링 진행
				setFontLoaded(true);
			}
		};

		checkFontLoading();
	}, []);
	// #endregion

	// #region 핸들러
	const handleLogin = async (data: LoginFormData) => {
		setIsLoading(true);
		setErrorMessage('');
		try {
			const result = await login(data.username, data.password);
			if (!result.success) {
				setErrorMessage(result.error || '로그인에 실패했습니다.');
			}
		} catch {
			setErrorMessage('로그인 중 오류가 발생했습니다. API 서버 연결을 확인해주세요.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleDevBypass = () => {
		setIsLoading(true);
		setErrorMessage('');
		
		try {
			// 개발자 모드 가짜 토큰 설정
			const fakeAccessToken = 'dev-access-token-' + Date.now();
			const fakeRefreshToken = 'dev-refresh-token-' + Date.now();
			
			setTokenToCookie(ACCESS_TOKEN_NAME, fakeAccessToken);
			setTokenToCookie(REFRESH_TOKEN_NAME, fakeRefreshToken);
			
			// 기본 현장 정보 설정 (개발자 모드)
			const mockParkingLots = [
				{ 
					id: 1, 
					code: 'DEV001', 
					name: '개발 테스트 현장', 
					description: '개발자 모드 테스트용 현장입니다.' 
				}
			];
			
			setParkingLots(mockParkingLots);
			setSelectedParkingLotId(1);
			setIsLoggedIn(true);
			
			console.log('🚀 개발자 모드 로그인 우회 완료');
		} catch (error) {
			console.error('개발자 우회 로그인 실패:', error);
			setErrorMessage('개발자 우회 로그인에 실패했습니다.');
		} finally {
			setIsLoading(false);
		}
	};
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
					{errorMessage && (
						<div className="p-3 text-sm rounded-lg border bg-destructive/10 text-destructive border-destructive/20 font-multilang">
							{errorMessage}
						</div>
					)}
					<LoginForm 
						onSubmit={handleLogin} 
						isLoading={isLoading}
						isDevelopment={isDevelopment}
						onDevBypass={handleDevBypass}
					/>
				</div>
			</div>
		</Portal>
	);
	// #endregion
} 