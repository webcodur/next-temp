'use client';

import { useState } from 'react';
import { AlertTriangle, Bug, Database, Globe, Server, Users, Car, Settings, FileX } from 'lucide-react';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { Button } from '@/components/ui/ui-input/button/Button';
import { RaisedContainer } from '@/components/ui/ui-layout/neumorphicContainer/RaisedContainer';

// API 서비스 임포트
import { getAdminDetail } from '@/services/admin/admin@id_GET';
import { getCarsByInstance } from '@/services/cars/cars@id_GET';
import { getConfigById } from '@/services/config/config@id_GET';
import { getViolationDetail } from '@/services/violations/violations@id_GET';

/**
 * 에러 테스트 페이지
 * 다양한 종류의 에러를 의도적으로 발생시켜 에러 처리가 올바르게 작동하는지 테스트할 수 있는 페이지
 */
export default function ErrorTestPage() {
	const [loading, setLoading] = useState<string | null>(null);
	const [lastError, setLastError] = useState<{
		title: string;
		message: string;
		apiResponse?: unknown;
	} | null>(null);
	const [errorDialogOpen, setErrorDialogOpen] = useState(false);

	//#region 에러 발생 함수들
	const triggerJavaScriptError = () => {
		setLoading('js');
		setTimeout(() => {
			setLoading(null);
			// 의도적으로 JavaScript 에러 발생
			throw new Error('테스트용 JavaScript 에러입니다');
		}, 1000);
	};

	const triggerNetworkError = async () => {
		setLoading('network');
		try {
			// 존재하지 않는 API 호출
			await fetch('/api/non-existent-endpoint');
		} catch (error) {
			setLastError({
				title: '네트워크 에러 발생',
				message: `네트워크 에러: ${error}`,
			});
			setErrorDialogOpen(true);
		} finally {
			setLoading(null);
		}
	};

	const triggerServerError = async () => {
		setLoading('server');
		try {
			// 500 에러를 발생시키는 API 호출 시뮬레이션
			const response = await fetch('/api/error-test/500', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ test: true }),
			});
			
			if (!response.ok) {
				throw new Error(`서버 에러: ${response.status} ${response.statusText}`);
			}
		} catch (error) {
			setLastError({
				title: '서버 에러 발생',
				message: `서버 에러: ${error}`,
			});
			setErrorDialogOpen(true);
		} finally {
			setLoading(null);
		}
	};

	const trigger404Error = () => {
		setLoading('404');
		setTimeout(() => {
			setLoading(null);
			// 404 페이지로 리다이렉트
			window.location.href = '/non-existent-page';
		}, 1000);
	};

	const triggerMemoryError = () => {
		setLoading('memory');
		try {
			// 메모리 부족 에러 시뮬레이션
			const largeArray: number[][] = [];
			for (let i = 0; i < 100000; i++) {
				largeArray.push(new Array(10000).fill(i));
			}
		} catch (error) {
			setLastError({
				title: '메모리 에러 발생',
				message: `메모리 에러: ${error}`,
			});
			setErrorDialogOpen(true);
		} finally {
			setLoading(null);
		}
	};

	const triggerUnauthorizedError = async () => {
		setLoading('auth');
		try {
			// 인증이 필요한 API에 토큰 없이 접근
			const response = await fetch('/api/admin', {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
			});
			
			if (response.status === 401) {
				throw new Error('인증되지 않은 사용자입니다');
			}
		} catch (error) {
			setLastError({
				title: '인증 에러 발생',
				message: `인증 에러: ${error}`,
			});
			setErrorDialogOpen(true);
		} finally {
			setLoading(null);
		}
	};

	//#region 실제 API 에러 테스트 함수들 - 존재하지 않는 ID로 호출해서 무조건 실패
	// 관리자 상세 조회 API - 존재하지 않는 ID로 에러 발생
	const triggerAdminApiError = async () => {
		setLoading('admin-api');
		try {
			// 존재하지 않는 관리자 ID로 상세 조회
			const result = await getAdminDetail({ id: 999999 });
			
			if (!result.success) {
				setLastError({
					title: '관리자 상세 조회 API 에러',
					message: result.errorMsg || '알 수 없는 에러',
					apiResponse: result,
				});
				setErrorDialogOpen(true);
			} else {
				// 성공한 경우도 표시 (예상치 못한 성공)
				setLastError({
					title: '관리자 API - 예상치 못한 성공',
					message: '존재하지 않는 ID(999999)임에도 성공했습니다.',
					apiResponse: result,
				});
				setErrorDialogOpen(true);
			}
		} catch (error) {
			setLastError({
				title: '관리자 API 네트워크 에러',
				message: `네트워크 에러: ${error}`,
				apiResponse: error,
			});
			setErrorDialogOpen(true);
		} finally {
			setLoading(null);
		}
	};

	// 차량 인스턴스 조회 API - 존재하지 않는 인스턴스 ID로 에러 발생
	const triggerCarsApiError = async () => {
		setLoading('cars-api');
		try {
			// 존재하지 않는 인스턴스 ID로 호출
			const result = await getCarsByInstance(999999, 'invalid-parkinglot-id');
			
			if (!result.success) {
				setLastError({
					title: '차량 인스턴스 조회 API 에러',
					message: result.errorMsg || '알 수 없는 에러',
					apiResponse: result,
				});
				setErrorDialogOpen(true);
			} else {
				setLastError({
					title: '차량 API - 예상치 못한 성공',
					message: '존재하지 않는 인스턴스 ID(999999)임에도 성공했습니다.',
					apiResponse: result,
				});
				setErrorDialogOpen(true);
			}
		} catch (error) {
			setLastError({
				title: '차량 API 네트워크 에러',
				message: `네트워크 에러: ${error}`,
				apiResponse: error,
			});
			setErrorDialogOpen(true);
		} finally {
			setLoading(null);
		}
	};

	// 설정 상세 조회 API - 존재하지 않는 설정 ID로 에러 발생
	const triggerConfigApiError = async () => {
		setLoading('config-api');
		try {
			// 존재하지 않는 설정 ID로 호출
			const result = await getConfigById(999999, '999999');
			
			if (!result.success) {
				setLastError({
					title: '설정 상세 조회 API 에러',
					message: result.errorMsg || '알 수 없는 에러',
					apiResponse: result,
				});
				setErrorDialogOpen(true);
			} else {
				setLastError({
					title: '설정 API - 예상치 못한 성공',
					message: '존재하지 않는 설정 ID(999999)임에도 성공했습니다.',
					apiResponse: result,
				});
				setErrorDialogOpen(true);
			}
		} catch (error) {
			setLastError({
				title: '설정 API 네트워크 에러',
				message: `네트워크 에러: ${error}`,
				apiResponse: error,
			});
			setErrorDialogOpen(true);
		} finally {
			setLoading(null);
		}
	};

	// 위반 기록 상세 조회 API - 존재하지 않는 위반 ID로 에러 발생
	const triggerViolationApiError = async () => {
		setLoading('violation-api');
		try {
			// 존재하지 않는 위반 기록 ID로 호출
			const result = await getViolationDetail(999999);
			
			if (!result.success) {
				setLastError({
					title: '위반 기록 상세 조회 API 에러',
					message: result.errorMsg || '알 수 없는 에러',
					apiResponse: result,
				});
				setErrorDialogOpen(true);
			} else {
				setLastError({
					title: '위반 기록 API - 예상치 못한 성공',
					message: '존재하지 않는 위반 ID(999999)임에도 성공했습니다.',
					apiResponse: result,
				});
				setErrorDialogOpen(true);
			}
		} catch (error) {
			setLastError({
				title: '위반 기록 API 네트워크 에러',
				message: `네트워크 에러: ${error}`,
				apiResponse: error,
			});
			setErrorDialogOpen(true);
		} finally {
			setLoading(null);
		}
	};
	//#endregion

	//#endregion

	//#region 에러 테스트 버튼 데이터
	const errorTests = [
		{
			id: 'js',
			title: 'JavaScript 에러',
			description: '의도적인 JavaScript 런타임 에러 발생',
			icon: Bug,
			iconBg: 'hsl(var(--destructive))',
			buttonBg: 'hsl(var(--destructive))',
			action: triggerJavaScriptError,
		},
		{
			id: 'network',
			title: '네트워크 에러',
			description: '존재하지 않는 API 엔드포인트 호출',
			icon: Globe,
			iconBg: 'hsl(38 92% 50%)', // Orange
			buttonBg: 'hsl(38 92% 50%)',
			action: triggerNetworkError,
		},
		{
			id: 'server',
			title: '서버 에러 (500)',
			description: '서버 내부 에러 시뮬레이션',
			icon: Server,
			iconBg: 'hsl(280 60% 55%)', // Purple
			buttonBg: 'hsl(280 60% 55%)',
			action: triggerServerError,
		},
		{
			id: '404',
			title: '404 에러',
			description: '존재하지 않는 페이지로 이동',
			icon: AlertTriangle,
			iconBg: 'hsl(var(--warning))',
			buttonBg: 'hsl(var(--warning))',
			action: trigger404Error,
		},
		{
			id: 'memory',
			title: '메모리 에러',
			description: '대용량 메모리 할당으로 에러 발생',
			icon: Database,
			iconBg: 'hsl(300 70% 60%)', // Pink
			buttonBg: 'hsl(300 70% 60%)',
			action: triggerMemoryError,
		},
		{
			id: 'auth',
			title: '인증 에러 (401)',
			description: '인증되지 않은 API 접근 시도',
			icon: Users,
			iconBg: 'hsl(var(--primary))',
			buttonBg: 'hsl(var(--primary))',
			action: triggerUnauthorizedError,
		},
		
		// 실제 API 호출 테스트들
		{
			id: 'admin-api',
			title: '관리자 API 에러',
			description: '존재하지 않는 ID(999999)로 관리자 상세 조회 API 호출',
			icon: Users,
			iconBg: 'hsl(220 70% 50%)', // Blue
			buttonBg: 'hsl(220 70% 50%)',
			action: triggerAdminApiError,
		},
		{
			id: 'cars-api',
			title: '차량 API 에러',
			description: '존재하지 않는 인스턴스 ID(999999)로 차량 조회 API 호출',
			icon: Car,
			iconBg: 'hsl(160 70% 45%)', // Teal
			buttonBg: 'hsl(160 70% 45%)',
			action: triggerCarsApiError,
		},
		{
			id: 'config-api',
			title: '설정 API 에러',
			description: '존재하지 않는 설정 ID(999999)로 설정 상세 조회 API 호출',
			icon: Settings,
			iconBg: 'hsl(200 70% 50%)', // Light Blue
			buttonBg: 'hsl(200 70% 50%)',
			action: triggerConfigApiError,
		},
		{
			id: 'violation-api',
			title: '위반 기록 API 에러',
			description: '존재하지 않는 위반 ID로 위반 기록 상세 조회 API 호출',
			icon: FileX,
			iconBg: 'hsl(350 70% 50%)', // Red-Pink
			buttonBg: 'hsl(350 70% 50%)',
			action: triggerViolationApiError,
		},
	];
	//#endregion

	return (
		<div className="flex flex-col gap-6">
			{/* 페이지 헤더 */}
			<PageHeader 
				title="에러 테스트" 
				subtitle="JavaScript 런타임 에러부터 실제 API 호출 실패까지 다양한 종류의 에러를 의도적으로 발생시켜 에러 처리가 올바르게 작동하는지 테스트할 수 있습니다"
			/>

			{/* 에러 테스트 버튼 그리드 */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{errorTests.map((test) => {
					const Icon = test.icon;
					const isLoading = loading === test.id;

					return (
						<RaisedContainer key={test.id} className="p-6">
							<div className="flex items-center mb-4">
								<div 
									className={`p-3 mr-4 rounded-lg`}
									style={{ 
										backgroundColor: test.iconBg,
										color: 'hsl(var(--primary-foreground))'
									}}
								>
									<Icon className="w-6 h-6" />
								</div>
								<h3 
									className="text-lg font-semibold"
									style={{ color: 'hsl(var(--foreground))' }}
								>
									{test.title}
								</h3>
							</div>
							
							<p 
								className="mb-4 text-sm"
								style={{ color: 'hsl(var(--muted-foreground))' }}
							>
								{test.description}
							</p>
							
							<button
								onClick={test.action}
								disabled={isLoading}
								className="px-4 py-2 w-full font-medium rounded-md transition-all duration-200"
								style={{
									backgroundColor: isLoading ? 'hsl(var(--muted))' : test.buttonBg,
									color: isLoading ? 'hsl(var(--muted-foreground))' : 'hsl(var(--primary-foreground))',
									cursor: isLoading ? 'not-allowed' : 'pointer',
									transform: isLoading ? 'none' : 'scale(1)',
								}}
								onMouseEnter={!isLoading ? (e) => {
									e.currentTarget.style.transform = 'scale(1.05)';
								} : undefined}
								onMouseLeave={!isLoading ? (e) => {
									e.currentTarget.style.transform = 'scale(1)';
								} : undefined}
							>
								{isLoading ? (
									<div className="flex justify-center items-center">
										<div 
											className="mr-2 w-4 h-4 rounded-full border-2 animate-spin border-t-transparent"
											style={{ 
												borderColor: 'hsl(var(--muted-foreground))',
												borderTopColor: 'transparent'
											}}
										/>
										테스트 중...
									</div>
								) : (
									'에러 발생'
								)}
							</button>
						</RaisedContainer>
					);
				})}
			</div>

			{/* 에러 다이얼로그 */}
			<Modal
				isOpen={errorDialogOpen}
				onClose={() => setErrorDialogOpen(false)}
				title="에러 발생"
				size="md"
				onConfirm={() => setErrorDialogOpen(false)}
			>
				<div className="space-y-4">
					<div className="text-center">
						<h3 
							className="mb-2 text-lg font-semibold"
							style={{ color: 'hsl(var(--destructive))' }}
						>
							{lastError?.title}
						</h3>
						<p style={{ color: 'hsl(var(--muted-foreground))' }}>
							{lastError?.message}
						</p>
					</div>
					
					{/* API 응답 데이터 표시 */}
					{lastError && lastError.apiResponse !== undefined && (
						<RaisedContainer className="overflow-y-auto p-4 max-h-64">
							<h4 
								className="mb-2 text-sm font-semibold"
								style={{ color: 'hsl(var(--foreground))' }}
							>
								API 응답 데이터:
							</h4>
							<pre 
								className="text-xs whitespace-pre-wrap break-words"
								style={{ color: 'hsl(var(--muted-foreground))' }}
							>
								{(() => {
									try {
										return JSON.stringify(lastError.apiResponse, null, 2);
									} catch {
										return String(lastError.apiResponse);
									}
								})()}
							</pre>
						</RaisedContainer>
					)}
					
					<div className="flex justify-center pt-4">
						<Button onClick={() => setErrorDialogOpen(false)}>
							확인
						</Button>
					</div>
				</div>
			</Modal>

			{/* 주의사항 */}
			<RaisedContainer className="p-4 mt-4">
				<div className="flex items-start">
					<AlertTriangle 
						className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
						style={{ color: 'hsl(var(--warning))' }}
					/>
					<div>
						<h4 
							className="mb-1 font-medium"
							style={{ color: 'hsl(var(--foreground))' }}
						>
							주의사항
						</h4>
						<ul 
							className="space-y-1 text-sm"
							style={{ color: 'hsl(var(--muted-foreground))' }}
						>
							<li>• 이 페이지는 개발 및 테스트 목적으로만 사용하세요</li>
							<li>• 의도적으로 에러를 발생시키므로 앱이 중단될 수 있습니다</li>
							<li>• JavaScript 에러는 브라우저 콘솔에서 확인할 수 있습니다</li>
							<li>• 메모리 에러 테스트는 브라우저를 느려지게 할 수 있습니다</li>
							<li>• 실제 API 테스트는 존재하지 않는 ID(999999)로 서버에 요청을 보냅니다</li>
							<li>• API 응답 데이터 및 에러 메시지는 에러 다이얼로그에서 확인할 수 있습니다</li>
							<li>• 프로덕션 환경에서는 이 페이지를 비활성화하세요</li>
						</ul>
					</div>
				</div>
			</RaisedContainer>
		</div>
	);
}
