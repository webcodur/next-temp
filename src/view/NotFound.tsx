'use client';

import { Button } from '@/components/ui/ui-input/button/Button';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';
import { useTranslations } from '@/hooks/useI18n';

export default function NotFound() {
	const router = useRouter();
	const t = useTranslations();
	const handleGoHome = () => router.push('/');
	const handleGoBack = () => router.back();
	const handleRefresh = () => window.location.reload();

	return (
		<div className="flex justify-center items-center p-4 min-h-screen">
			<div className="w-full max-w-md text-center">
				{/* #region 메인 컨테이너 */}
				<div className="p-8 space-y-8 rounded-2xl neu-raised">
					{/* 404 숫자 */}
					<div className="space-y-4">
						<h1 className="text-9xl font-bold font-multilang text-primary">404</h1>
						<div className="mx-auto w-24 h-1 rounded-full bg-primary/20"></div>
					</div>

					{/* 메시지 */}
					<div className="space-y-4">
						<h2 className="text-2xl font-bold font-multilang text-primary">
							{t('페이지_에러_페이지없음')}
						</h2>
						<p className="leading-relaxed font-multilang text-foreground/70">
							{t('페이지_에러_페이지없음설명1')}
							<br />
							{t('페이지_에러_페이지없음설명2')}
						</p>
					</div>

					{/* 액션 버튼 */}
					<div className="space-y-3">
						<Button onClick={handleGoHome} className="w-full neu-raised">
							<Home size={18} className="me-2" />
							{t('페이지_버튼_홈으로이동')}
						</Button>

						<div className="flex gap-3">
							<Button
								onClick={handleGoBack}
								variant="outline"
								className="flex-1 neu-raised">
								<ArrowLeft size={18} className="me-2" />
								{t('페이지_버튼_이전페이지')}
							</Button>
							<Button
								onClick={handleRefresh}
								variant="outline"
								className="flex-1 neu-raised">
								<RefreshCw size={18} className="me-2" />
								{t('페이지_버튼_새로고침')}
							</Button>
						</div>
					</div>

					{/* 추가 정보 */}
					<div className="pt-4 border-t border-foreground/10">
						<p className="text-sm font-multilang text-foreground/50">Error Code: 404</p>
					</div>
				</div>
				{/* #endregion */}
			</div>
		</div>
	);
} 