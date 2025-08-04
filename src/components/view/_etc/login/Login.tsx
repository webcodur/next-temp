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
import { loadDevAccounts, type DevAccountSet } from '@/utils/devAccounts';

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
	const isDev = process.env.NODE_ENV === 'development';
	
	// 환경변수에서 개발자 모드 계정 세트 로드
	const devAccountSets = isDev ? loadDevAccounts() : [];
	// #endregion

	// #region 상태
	const [isLoginLoading, setIsLoginLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [fontLoaded, setFontLoaded] = useState(false);
	const [selectedDevAccount, setSelectedDevAccount] = useState<DevAccountSet | null>(null);
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
			const errorMsg = `로그인 중 오류가 발생했습니다. API 서버: ${process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? 'hubtest-api.7meerkat.com' : 'localhost:3003'}`;
			setErrorMessage(errorMsg);
			console.error('💥 로그인 예외:', error);
			console.error('🌐 API Base URL:', process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_PROD_URL : process.env.NEXT_PUBLIC_API_TEST_URL);
		} finally {
			setIsLoginLoading(false);
		}
	};

	const handleDevAccountSelect = (account: DevAccountSet) => {
		setSelectedDevAccount(account);
		setErrorMessage('');
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
				<div className={`flex gap-8 items-start font-multilang ${isDev ? 'flex-row' : 'flex-col'}`}>
					{/* 메인 로그인 영역 */}
					<div className="space-y-4">
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
							selectedDevAccount={selectedDevAccount}
						/>
					</div>

					{/* 개발자 모드 계정 세트 패널 */}
					{isDev && devAccountSets.length > 0 && (
						<div className="p-6 w-96 rounded-2xl neu-elevated bg-card">
							<div className="mb-5">
								<h2 className="mb-1 text-lg font-bold text-center font-multilang text-foreground">
									개발자 계정 세트
								</h2>
							</div>
							
							<div className="space-y-3">
								{devAccountSets.map((account, index) => (
									<div 
										key={index}
										className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
											selectedDevAccount?.id === account.id 
												? 'neu-flat bg-primary/10 border-primary/30' 
												: 'neu-raised bg-card hover:neu-flat border-border'
										}`}
										onClick={() => handleDevAccountSelect(account)}
									>
										<div className="space-y-2">
											{/* 계정 ID */}
											<div className="flex justify-between items-center">
												<span className="text-sm font-multilang text-muted-foreground">
													아이디
												</span>
												<span className="font-medium font-multilang text-foreground">
													{account.id}
												</span>
											</div>
											
											{/* 비밀번호 */}
											<div className="flex justify-between items-center">
												<span className="text-sm font-multilang text-muted-foreground">
													비밀번호
												</span>
												<code className="px-2 py-1 font-mono text-sm font-medium rounded neu-inset bg-muted text-foreground">
													{account.password}
												</code>
											</div>
											
											{/* 설명 */}
											<div className="pt-1 border-t border-border/30">
												<p className="text-sm font-multilang text-muted-foreground">
													{account.description}
												</p>
											</div>
										</div>
									</div>
								))}
							</div>
							
						</div>
					)}
				</div>
			</div>
		</Portal>
	);
	// #endregion
} 