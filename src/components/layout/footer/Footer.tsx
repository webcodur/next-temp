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
		<footer className="bg-surface-3 border-t border-border text-muted-foreground py-20 mt-[150px]">
			<div className="container max-w-2xl px-6 mx-auto">
				{/* 로고 및 소개 - 중앙 정렬 */}
				<div className="mb-6 text-center">
					<div className="flex items-center justify-center mb-2">
						<h2 className="text-xl font-bold text-foreground">Meerkat Hub</h2>
					</div>
					<p className="mb-2 text-sm">AX DX SPACE TECHNOLOGY</p>
				</div>

				{/* 구분선 */}
				<div className="w-24 mx-auto my-4 border-t border-border"></div>

				{/* 연락처 및 바로가기 표 형식 */}
				<div className="max-w-md mx-auto mb-6">
					<div className="grid grid-cols-2 gap-2 text-center">
						{/* 번호 */}
						<div className="text-sm">
							<p className="text-foreground">1668-4179</p>
						</div>

						{/* 홈페이지 */}
						<div className="text-sm">
							<a
								href="https://meerkat.day/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-foreground transition-colors hover:text-primary">
							{t('푸터_링크_공식홈페이지')}
							</a>
						</div>

						{/* 메일 */}
						<div className="text-sm">
							<p className="text-foreground">7king@7meerkat.com</p>
						</div>

						{/* 블로그 */}
						<div className="text-sm">
							<a
								href="https://blog.naver.com/7meerkat"
								target="_blank"
								rel="noopener noreferrer"
								className="text-foreground transition-colors hover:text-primary">
							{t('푸터_링크_블로그')}
							</a>
						</div>
					</div>
				</div>

				<div className="mb-6 text-center">
					<div className="max-w-lg mx-auto space-y-1 text-sm">
						<p>
							<span>{t('푸터_주소_본사')} </span>
							<span className="text-foreground">
								{t('푸터_주소_본사상세')}
							</span>
						</p>
						<p>
							<span>{t('푸터_주소_제조')} </span>
							<span className="text-foreground">
								{t('푸터_주소_제조상세')}
							</span>
						</p>
					</div>
				</div>

				{/* 구분선 */}
				<div className="w-24 mx-auto my-4 border-t border-border"></div>

				{/* 회사 정보 및 저작권 */}
				<div className="text-xs text-center">
					<p>
						{t('푸터_회사정보')}
					</p>
					<p className="mt-1">
						©Copyright {new Date().getFullYear()}. All Right Reserved.
					</p>
					<p className="mt-1 text-muted-foreground/70">
						{t('푸터_알림_PC최적화')}
					</p>
				</div>
			</div>
		</footer>
	);
	// #endregion
}
