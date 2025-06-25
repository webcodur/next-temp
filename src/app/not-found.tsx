'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search, RefreshCw } from 'lucide-react';
import { RaisedContainer, FlatContainer } from '@/components/ui/neumorphicContainer';

export default function NotFound() {
	const router = useRouter();
	const handleGoHome = () => router.push('/');
	const handleGoBack = () => router.back();
	const handleRefresh = () => window.location.reload();

	return (
		<div className="min-h-screen bg-linear-to-br from-var(--background) via-var(--muted/20) to-var(--background) flex items-center justify-center p-4">
			<div className="w-full max-w-4xl">
				{/* #region 메인 컨테이너 */}
				<RaisedContainer className="p-12 rounded-3xl backdrop-blur-xs">
					<div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
						
						{/* #region 좌측: 404 시각적 표현 */}
						<div className="flex flex-col items-center space-y-6">
							{/* 404 메인 텍스트 */}
							<RaisedContainer className="px-12 py-8 rounded-2xl">
								<h1 className="text-8xl lg:text-9xl font-bold text-var-text-primary tracking-wider">
									404
								</h1>
							</RaisedContainer>
							
							{/* 서브 텍스트 */}
							<FlatContainer className="px-6 py-3 rounded-xl">
								<p className="text-lg font-medium text-var-text-secondary">
									Page Not Found
								</p>
							</FlatContainer>
						</div>
						{/* #endregion */}

						{/* #region 우측: 메시지 및 액션 */}
						<div className="space-y-8 text-center lg:text-left">
							{/* 메인 메시지 */}
							<div className="space-y-4">
								<h1 className="text-3xl font-bold leading-tight lg:text-4xl text-var-text-primary">
									길을 잃으셨나요?
								</h1>
								<p className="text-lg leading-relaxed text-var-text-secondary">
									요청하신 페이지를 찾을 수 없습니다.<br />
									다른 경로를 통해 원하시는 곳으로<br />
									안내해드리겠습니다.
								</p>
							</div>

							{/* 액션 버튼 그룹 */}
							<div className="space-y-4">
								<div className="flex flex-col gap-3 sm:flex-row">
									<Button
										onClick={handleGoHome}
										className="flex flex-1 gap-2 items-center neu-raised">
										<Home size={18} />
										홈으로 이동
									</Button>
									<Button
										onClick={handleGoBack}
										variant="outline"
										className="flex flex-1 gap-2 items-center neu-raised">
										<ArrowLeft size={18} />
										이전 페이지
									</Button>
								</div>
								
								{/* 추가 옵션 */}
								<div className="flex gap-3 justify-center lg:justify-start">
									<FlatContainer className="p-3 rounded-xl transition-all duration-200 cursor-pointer hover:neu-raised">
										<Search size={20} className="text-var-text-secondary" />
									</FlatContainer>
									<FlatContainer 
										className="p-3 rounded-xl transition-all duration-200 cursor-pointer hover:neu-raised"
										onClick={handleRefresh}>
										<RefreshCw size={20} className="text-var-text-secondary" />
									</FlatContainer>
								</div>
							</div>
						</div>
						{/* #endregion */}

					</div>

					{/* #region 하단 추가 정보 */}
					<div className="pt-8 mt-12 border-t border-var-border/20">
						<FlatContainer className="p-6 rounded-2xl">
							<div className="space-y-2 text-center">
								<p className="text-sm text-var-text-secondary">
									💡 도움이 필요하시면 메인 페이지에서 검색을 이용해보세요
								</p>
								<p className="text-xs text-var-text-secondary/70">
									Error Code: 404 • Page Not Found
								</p>
							</div>
						</FlatContainer>
					</div>
					{/* #endregion */}

				</RaisedContainer>
				{/* #endregion */}
			</div>
		</div>
	);
}
