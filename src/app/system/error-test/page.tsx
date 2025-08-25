'use client';

import { useState } from 'react';
import { AlertTriangle, Users, Settings, FileX } from 'lucide-react';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { RaisedContainer } from '@/components/ui/ui-layout/neumorphicContainer/Container-Raised';

// API 서비스 임포트
import { getAdminDetail } from '@/services/admin/admin@id_GET';
import { getConfigById } from '@/services/config/config@id_GET';
import { getViolationDetail } from '@/services/violations/violations@id_GET';

/**
 * API 에러 테스트 페이지
 * 실제 API 호출을 존재하지 않는 ID로 요청하여 에러 처리가 올바르게 작동하는지 테스트할 수 있는 페이지
 */
export default function ErrorTestPage() {
	const [loading, setLoading] = useState<string | null>(null);

	//#region 실제 API 에러 테스트 함수들 - 존재하지 않는 ID로 호출해서 무조건 실패
	// 관리자 상세 조회 API - 존재하지 않는 ID로 에러 발생
	const triggerAdminApiError = async () => {
		setLoading('admin-api');
		try {
			// 존재하지 않는 관리자 ID로 상세 조회
			await getAdminDetail({ id: 999999 });
		} catch {
			// 에러 발생 시 아무것도 하지 않음
		} finally {
			setLoading(null);
		}
	};

	// 설정 상세 조회 API - 존재하지 않는 설정 ID로 에러 발생
	const triggerConfigApiError = async () => {
		setLoading('config-api');
		try {
			// 존재하지 않는 설정 ID로 호출
			await getConfigById(999999, '999999');
		} catch {
			// 에러 발생 시 아무것도 하지 않음
		} finally {
			setLoading(null);
		}
	};

	// 위반 기록 상세 조회 API - 존재하지 않는 위반 ID로 에러 발생
	const triggerViolationApiError = async () => {
		setLoading('violation-api');
		try {
			// 존재하지 않는 위반 기록 ID로 호출
			await getViolationDetail(999999);
		} catch {
			// 에러 발생 시 아무것도 하지 않음
		} finally {
			setLoading(null);
		}
	};
	//#endregion

	//#endregion

	//#region API 에러 테스트 버튼 데이터
	const errorTests = [
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
				title="API 에러 테스트" 
				subtitle="실제 API 호출을 존재하지 않는 ID로 요청하여 에러 처리가 올바르게 작동하는지 테스트할 수 있습니다"
			/>

			{/* API 에러 테스트 버튼 그리드 */}
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
							<li>• 존재하지 않는 ID(999999)로 실제 서버에 API 요청을 보냅니다</li>
							<li>• API 에러 발생 시 별도의 알림이나 로그를 표시하지 않습니다</li>
							<li>• 에러 처리 로직이 올바르게 동작하는지 확인할 수 있습니다</li>
							<li>• 프로덕션 환경에서는 이 페이지를 비활성화하세요</li>
						</ul>
					</div>
				</div>
			</RaisedContainer>
		</div>
	);
}
