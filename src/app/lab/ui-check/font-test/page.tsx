'use client';

import { useState } from 'react';
import { detectLanguage, getFontClass, isRTL } from '@/utils/language';
import { Button } from '@/components/ui/button/Button';
import { LanguageSwitcher } from '@/components/ui/language-switcher/LanguageSwitcher';
import { useTranslations } from '@/hooks/useI18n';

export default function FontTestPage() {
	const t = useTranslations();
	const [selectedText, setSelectedText] = useState<
		'korean' | 'english' | 'arabic' | 'mixed'
	>('korean');
	const [customText, setCustomText] = useState('');

	// 언어팩에서 샘플 텍스트 가져오기
	const sampleTexts = {
		korean: t('폰트테스트_샘플_한국어'),
		english: t('폰트테스트_샘플_영어'),
		arabic: t('폰트테스트_샘플_아랍어'),
		mixed: t('폰트테스트_샘플_혼합'),
	};

	const currentText = customText || sampleTexts[selectedText];
	const detectedLang = detectLanguage(currentText);
	const fontClass = getFontClass(detectedLang);
	const isRtl = isRTL(detectedLang);

	return (
		<div className="p-6 space-y-8">
			{/* 언어 전환기 */}
			<div className="flex justify-end">
				<LanguageSwitcher />
			</div>

			<div className="text-center">
				<h1 className="mb-4 text-3xl font-bold">{t('폰트테스트_제목')}</h1>
				<p className="text-gray-600">{t('폰트테스트_설명')}</p>
			</div>

			{/* #region 언어 선택 버튼 */}
			<div className="p-6 rounded-lg neu-flat">
				<h3 className="mb-4 text-lg font-semibold">
					{t('폰트테스트_샘플텍스트선택')}
				</h3>
				<div className="flex flex-wrap gap-3">
					{Object.entries(sampleTexts).map(([key]) => (
						<Button
							key={key}
							variant={selectedText === key ? 'default' : 'outline'}
							onClick={() => {
								setSelectedText(
									key as 'korean' | 'english' | 'arabic' | 'mixed'
								);
								setCustomText('');
							}}
							className="capitalize">
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
				<h3 className="mb-4 text-lg font-semibold">
					{t('폰트테스트_커스텀텍스트입력')}
				</h3>
				<textarea
					value={customText}
					onChange={(e) => setCustomText(e.target.value)}
					placeholder={t('폰트테스트_플레이스홀더')}
					className="p-4 w-full rounded-lg border border-gray-300 resize-none focus:outline-hidden focus:ring-2 focus:ring-blue-500"
					rows={4}
				/>
			</div>
			{/* #endregion */}

			{/* #region 언어 감지 결과 */}
			<div className="grid gap-6 md:grid-cols-2">
				<div className="p-6 rounded-lg neu-flat">
					<h3 className="mb-4 text-lg font-semibold">
						{t('폰트테스트_감지결과')}
					</h3>
					<div className="space-y-3">
						<div className="flex justify-between">
							<span className="font-medium">{t('폰트테스트_감지된언어')}:</span>
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium ${
									detectedLang === 'ko'
										? 'bg-blue-100 text-blue-800'
										: detectedLang === 'ar'
											? 'bg-green-100 text-green-800'
											: detectedLang === 'en'
												? 'bg-purple-100 text-purple-800'
												: 'bg-orange-100 text-orange-800'
								}`}>
								{detectedLang === 'ko' && t('폰트테스트_언어_한국어')}
								{detectedLang === 'ar' && t('폰트테스트_언어_아랍어')}
								{detectedLang === 'en' && t('폰트테스트_언어_영어')}
								{detectedLang === 'mixed' && t('폰트테스트_언어_혼합')}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="font-medium">{t('폰트테스트_적용된폰트')}:</span>
							<span className="text-gray-600">{fontClass}</span>
						</div>
						<div className="flex justify-between">
							<span className="font-medium">{t('폰트테스트_텍스트방향')}:</span>
							<span className="text-gray-600">
								{isRtl ? t('폰트테스트_방향_우좌') : t('폰트테스트_방향_좌우')}
							</span>
						</div>
					</div>
				</div>

				<div className="p-6 rounded-lg neu-flat">
					<h3 className="mb-4 text-lg font-semibold">
						{t('폰트테스트_폰트미리보기')}
					</h3>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-gray-600">
								MultiLang ({t('공통_자동선택')})
							</label>
							<p
								className={`font-multilang text-lg p-3 border rounded ${isRtl ? 'text-right' : 'text-left'}`}>
								{currentText}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-600">
								Pretendard ({t('공통_한국어전용')})
							</label>
							<p className="p-3 text-lg rounded border font-pretendard">
								{currentText}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-600">
								Inter ({t('공통_영어전용')})
							</label>
							<p className="p-3 text-lg rounded border font-inter">
								{currentText}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-600">
								Cairo ({t('공통_아랍어전용')})
							</label>
							<p className="p-3 text-lg rounded border font-cairo">
								{currentText}
							</p>
						</div>
					</div>
				</div>
			</div>
			{/* #endregion */}

			{/* #region 실제 적용 예시 */}
			<div className="p-8 rounded-lg neu-inset">
				<h3 className="mb-4 text-lg font-semibold">
					{t('폰트테스트_실제적용결과')}
				</h3>
				<div
					className={`text-xl leading-relaxed ${fontClass} ${isRtl ? 'text-right' : 'text-left'}`}
					dir={isRtl ? 'rtl' : 'ltr'}>
					{currentText}
				</div>
				<div className="mt-4 text-sm text-gray-500">
					{t('폰트테스트_설명노트')}
				</div>
			</div>
			{/* #endregion */}
		</div>
	);
}
