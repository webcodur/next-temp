/* 
  파일명: /components/layout/footer/Footer.tsx
  기능: 레이아웃의 푸터 컴포넌트
  책임: 회사 정보, 연락처, 링크 등 푸터 정보 제공
*/ // ------------------------------
'use client';

import { useTranslations } from '@/hooks/useI18n';

export default function Footer() {
	// #region 훅
	const t = useTranslations();
	// #endregion

	// #region 렌더링
	return (
		<footer className="mt-10 bg-gradient-to-b rounded-t-xl border from-surface-2 to-surface-3 border-border/50">
			<div className="container px-6 py-16 mx-auto">
				{/* 메인 콘텐츠 영역 */}
				<div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-3">
					{/* 브랜드 섹션 */}
					<div className="lg:col-span-1">
						<div className="flex items-center mb-4">
							<div className="flex justify-center items-center mr-3 w-10 h-10 rounded-lg bg-primary">
								<span className="text-lg font-bold text-primary-foreground">M</span>
							</div>
							<div>
								<h3 className="text-xl font-bold text-foreground">Meerkat Hub</h3>
								<p className="text-sm text-muted-foreground">AX DX SPACE TECHNOLOGY</p>
							</div>
						</div>
						<p className="text-sm leading-relaxed text-muted-foreground">
							{t('푸터_회사정보')}
						</p>
					</div>

					{/* 연락처 섹션 */}
					<div className="lg:col-span-1">
						<h4 className="mb-4 font-semibold text-foreground">Contact</h4>
						<div className="space-y-3">
							<div className="flex items-center">
								<div className="flex justify-center items-center mr-3 w-8 h-8 rounded-full bg-primary/10">
									<svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
									</svg>
								</div>
								<span className="text-sm text-muted-foreground">1668-4179</span>
							</div>
							<div className="flex items-center">
								<div className="flex justify-center items-center mr-3 w-8 h-8 rounded-full bg-primary/10">
									<svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								</div>
								<span className="text-sm text-muted-foreground">7king@7meerkat.com</span>
							</div>
						</div>
					</div>

					{/* 링크 섹션 */}
					<div className="lg:col-span-1">
						<h4 className="mb-4 font-semibold text-foreground">Links</h4>
						<div className="space-y-3">
							<a
								href="https://meerkat.day/"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center text-sm transition-colors duration-200 text-muted-foreground hover:text-primary">
								<div className="flex justify-center items-center mr-3 w-8 h-8 rounded-full bg-primary/10">
									<svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
									</svg>
								</div>
								{t('푸터_링크_공식홈페이지')}
							</a>
							<a
								href="https://blog.naver.com/7meerkat"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center text-sm transition-colors duration-200 text-muted-foreground hover:text-primary">
								<div className="flex justify-center items-center mr-3 w-8 h-8 rounded-full bg-primary/10">
									<svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
									</svg>
								</div>
								{t('푸터_링크_블로그')}
							</a>
						</div>
					</div>
				</div>

				{/* 주소 정보 */}
				<div className="pt-8 mb-8 border-t border-border/30">
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="flex items-start">
							<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-0.5">
								<svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							</div>
							<div>
								<p className="mb-1 text-sm font-medium text-foreground">{t('푸터_주소_본사')}</p>
								<p className="text-sm text-muted-foreground">{t('푸터_주소_본사상세')}</p>
							</div>
						</div>
						<div className="flex items-start">
							<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-0.5">
								<svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
								</svg>
							</div>
							<div>
								<p className="mb-1 text-sm font-medium text-foreground">{t('푸터_주소_제조')}</p>
								<p className="text-sm text-muted-foreground">{t('푸터_주소_제조상세')}</p>
							</div>
						</div>
					</div>
				</div>

				{/* 하단 정보 */}
				<div className="pt-6 border-t border-border/30">
					<div className="flex flex-col justify-between items-center space-y-4 md:flex-row md:space-y-0">
						<div className="text-xs text-center text-muted-foreground md:text-left">
							© {new Date().getFullYear()} Meerkat Hub. All rights reserved.
						</div>
						<div className="text-xs text-center text-muted-foreground/70 md:text-right">
							{t('푸터_알림_PC최적화')}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
	// #endregion
}
