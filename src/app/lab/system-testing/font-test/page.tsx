/*
  파일명: src/app/lab/system-testing/font-test/page.tsx
  기능: 다국어 폰트 시스템을 테스트하고 시각적으로 비교하는 페이지
  책임: `font-multilang` 클래스의 자동 폰트 적용을 시연하고, 개별 폰트 및 Pretendard 굵기(weight)를 비교하며, RTL 레이아웃을 확인한다.
*/

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/ui-input/button/Button';
import LanguageSwitcher from '@/components/ui/ui-input/language-switcher/LanguageSwitcher';
import { useTranslations, useLocale } from '@/hooks/useI18n';

export default function FontTestPage() {
	// #region 훅
	const t = useTranslations();
	const { isRTL } = useLocale();
	// #endregion

	// #region 상태
	const [selectedText, setSelectedText] = useState<
		'korean' | 'english' | 'arabic' | 'mixed'
	>('korean');
	const [customText, setCustomText] = useState('');
	// #endregion

	// #region 상수
	const sampleTexts = {
		korean: t('폰트테스트_샘플_한국어'),
		english: t('폰트테스트_샘플_영어'),
		arabic: t('폰트테스트_샘플_아랍어'),
		mixed: t('폰트테스트_샘플_혼합'),
	};

	const currentText = customText || sampleTexts[selectedText];
	// #endregion

	// #region 렌더링
	return (
		<div className="p-6 space-y-8">
			{/* 언어 전환기 */}
			<div className="flex justify-end">
				<LanguageSwitcher />
			</div>

			<div className="text-center">
				<h1 className="mb-4 text-3xl font-bold font-multilang">{t('폰트테스트_제목')}</h1>
				<p className="text-muted-foreground font-multilang">
					{t('폰트테스트_설명')}
				</p>
			</div>

			{/* #region 샘플 텍스트 선택 */}
			<div className="p-6 rounded-lg neu-flat">
				<h3 className="mb-4 text-lg font-semibold font-multilang">{t('폰트테스트_샘플텍스트선택')}</h3>
				<div className="flex flex-wrap gap-3">
					{Object.entries(sampleTexts).map(([key]) => (
						<Button
							key={key}
							variant={selectedText === key ? 'default' : 'outline'}
							onClick={() => {
								setSelectedText(key as 'korean' | 'english' | 'arabic' | 'mixed');
								setCustomText('');
							}}
							className="capitalize font-multilang">
							{key === 'korean' && t('폰트테스트_언어_한국어')}
							{key === 'english' && t('폰트테스트_언어_영어')}
							{key === 'arabic' && t('폰트테스트_언어_아랍어')}
							{key === 'mixed' && t('폰트테스트_언어_혼합')}
						</Button>
					))}
				</div>
			</div>
			{/* #endregion */}

			{/* #region 커스텀 텍스트 입력 */}
			<div className="p-6 rounded-lg neu-flat">
				<h3 className="mb-4 text-lg font-semibold font-multilang">{t('폰트테스트_커스텀텍스트입력')}</h3>
				<textarea
					value={customText}
					onChange={(e) => setCustomText(e.target.value)}
					placeholder={t('폰트테스트_플레이스홀더')}
					className="p-4 w-full rounded-lg border resize-none border-border focus:outline-hidden focus:ring-2 focus:ring-primary font-multilang"
					rows={4}
				/>
			</div>
			{/* #endregion */}

			{/* #region 폰트 시스템 비교 */}
			<div className="p-6 rounded-lg neu-flat">
				<h3 className="mb-4 text-lg font-semibold font-multilang">{t('폰트테스트_폰트미리보기')}</h3>
				<div className="space-y-6">
					{/* MultiLang 폰트 (권장) */}
					<div>
						<label className="block mb-2 text-sm font-medium text-muted-foreground font-multilang">
							{t('폰트테스트_권장폰트')}
						</label>
						<p
							className={`font-multilang text-lg p-4 border rounded bg-green-500/10 ${
								isRTL ? 'text-end' : 'text-start'
							}`}
							dir={isRTL ? 'rtl' : 'ltr'}>
							{currentText}
						</p>
						<p className="mt-1 text-xs text-muted-foreground font-multilang">
							{t('폰트테스트_자동적용설명')}
						</p>
					</div>

					{/* 개별 폰트 비교 */}
					<div className="grid gap-4 md:grid-cols-3">
						<div>
							<label className="block mb-2 text-sm font-medium text-muted-foreground font-multilang">
								{t('폰트테스트_개별폰트_한국어')}
							</label>
							<p className="p-3 text-lg rounded border font-pretendard">
								{currentText}
							</p>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-muted-foreground font-multilang">
								{t('폰트테스트_개별폰트_영어')}
							</label>
							<p className="p-3 text-lg rounded border font-inter">
								{currentText}
							</p>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-muted-foreground font-multilang">
								{t('폰트테스트_개별폰트_아랍어')}
							</label>
							<p className="p-3 text-lg rounded border font-cairo">
								{currentText}
							</p>
						</div>
					</div>

					{/* Pretendard 웨이트 테스트 */}
					<div>
						<label className="block mb-2 text-sm font-medium text-muted-foreground font-multilang">
							{t('폰트테스트_웨이트테스트')}
						</label>
						<div className="grid gap-2">
							{[
								{ weight: 'font-thin', label: t('폰트테스트_웨이트_Thin') },
								{ weight: 'font-extralight', label: t('폰트테스트_웨이트_ExtraLight') },
								{ weight: 'font-light', label: t('폰트테스트_웨이트_Light') },
								{ weight: 'font-normal', label: t('폰트테스트_웨이트_Regular') },
								{ weight: 'font-medium', label: t('폰트테스트_웨이트_Medium') },
								{ weight: 'font-semibold', label: t('폰트테스트_웨이트_SemiBold') },
								{ weight: 'font-bold', label: t('폰트테스트_웨이트_Bold') },
								{ weight: 'font-extrabold', label: t('폰트테스트_웨이트_ExtraBold') },
								{ weight: 'font-black', label: t('폰트테스트_웨이트_Black') },
							].map(({ weight, label }) => (
								<div key={weight} className="p-2 rounded border">
									<div className="mb-1 text-xs text-muted-foreground font-multilang">{label}</div>
									<p className={`text-lg font-pretendard ${weight}`}>
										{t('폰트테스트_웨이트샘플')}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			{/* #endregion */}

			{/* #region 실제 적용 결과 */}
			<div className="p-8 rounded-lg neu-inset">
				<h3 className="mb-4 text-lg font-semibold font-multilang">{t('폰트테스트_실제적용결과')}</h3>
				<div
					className={`text-xl leading-relaxed font-multilang ${
						isRTL ? 'text-end' : 'text-start'
					}`}
					dir={isRTL ? 'rtl' : 'ltr'}>
					{currentText}
				</div>
				<div className="mt-4 text-sm text-muted-foreground font-multilang">
					{t('폰트테스트_설명노트')}
				</div>
			</div>
			{/* #endregion */}
		</div>
	);
	// #endregion
} 