'use client';

import { useState } from 'react';
import { isRTL } from '@/utils/language';
import { Button } from '@/components/ui/button/Button';
import { LanguageSwitcher } from '@/components/ui/language-switcher/LanguageSwitcher';
export default function FontTestPage() {
	const [selectedText, setSelectedText] = useState<
		'korean' | 'english' | 'arabic' | 'mixed'
	>('korean');
	const [customText, setCustomText] = useState('');

	// 샘플 텍스트들
	const sampleTexts = {
		korean: '안녕하세요! 한국어 텍스트입니다. 가나다라마바사아자차카타파하.',
		english: 'Hello! This is English text. The quick brown fox jumps over the lazy dog.',
		arabic: 'مرحبا! هذا نص عربي. النص العربي يُكتب من اليمين إلى اليسار.',
		mixed: 'Mixed 텍스트 مختلط - Hello 안녕하세요 مرحبا 123 ABC 가나다',
	};

	const currentText = customText || sampleTexts[selectedText];
	const hasArabicText = isRTL(currentText);

	return (
		<div className="p-6 space-y-8">
			{/* 언어 전환기 */}
			<div className="flex justify-end">
				<LanguageSwitcher />
			</div>

			<div className="text-center">
				<h1 className="mb-4 text-3xl font-bold">폰트 시스템 테스트</h1>
				<p className="text-gray-600">
					font-multilang 클래스로 모든 언어 폰트가 자동 적용되는지 확인합니다.
				</p>
			</div>

			{/* #region 샘플 텍스트 선택 */}
			<div className="p-6 rounded-lg neu-flat">
				<h3 className="mb-4 text-lg font-semibold">샘플 텍스트 선택</h3>
				<div className="flex flex-wrap gap-3">
					{Object.entries(sampleTexts).map(([key]) => (
						<Button
							key={key}
							variant={selectedText === key ? 'default' : 'outline'}
							onClick={() => {
								setSelectedText(key as 'korean' | 'english' | 'arabic' | 'mixed');
								setCustomText('');
							}}
							className="capitalize">
							{key === 'korean' && '한국어'}
							{key === 'english' && '영어'}
							{key === 'arabic' && '아랍어'}
							{key === 'mixed' && '혼합'}
						</Button>
					))}
				</div>
			</div>
			{/* #endregion */}

			{/* #region 커스텀 텍스트 입력 */}
			<div className="p-6 rounded-lg neu-flat">
				<h3 className="mb-4 text-lg font-semibold">커스텀 텍스트 입력</h3>
				<textarea
					value={customText}
					onChange={(e) => setCustomText(e.target.value)}
					placeholder="원하는 텍스트를 입력하세요..."
					className="p-4 w-full rounded-lg border border-gray-300 resize-none focus:outline-hidden focus:ring-2 focus:ring-blue-500"
					rows={4}
				/>
			</div>
			{/* #endregion */}

			{/* #region 폰트 시스템 비교 */}
			<div className="p-6 rounded-lg neu-flat">
				<h3 className="mb-4 text-lg font-semibold">폰트 시스템 비교</h3>
				<div className="space-y-6">
					{/* MultiLang 폰트 (권장) */}
					<div>
						<label className="text-sm font-medium text-gray-600 mb-2 block">
							✅ font-multilang (권장) - 모든 언어 자동 처리
						</label>
						<p
							className={`font-multilang text-lg p-4 border rounded bg-green-50 ${
								hasArabicText ? 'text-right' : 'text-left'
							}`}
							dir={hasArabicText ? 'rtl' : 'ltr'}>
							{currentText}
						</p>
						<p className="text-xs text-gray-500 mt-1">
							한글은 Pretendard, 영어는 Inter, 아랍어는 Cairo가 자동 적용됩니다.
						</p>
					</div>

					{/* 개별 폰트 비교 */}
					<div className="grid gap-4 md:grid-cols-3">
						<div>
							<label className="text-sm font-medium text-gray-600 mb-2 block">
								font-pretendard (한국어)
							</label>
							<p className="font-pretendard text-lg p-3 border rounded">
								{currentText}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-600 mb-2 block">
								font-inter (영어)
							</label>
							<p className="font-inter text-lg p-3 border rounded">
								{currentText}
							</p>
						</div>
						<div>
							<label className="text-sm font-medium text-gray-600 mb-2 block">
								font-cairo (아랍어)
							</label>
							<p className="font-cairo text-lg p-3 border rounded">
								{currentText}
							</p>
						</div>
					</div>

					{/* Pretendard 웨이트 테스트 */}
					<div>
						<label className="text-sm font-medium text-gray-600 mb-2 block">
							Pretendard 웨이트 테스트 (100-900)
						</label>
						<div className="grid gap-2">
							{[
								{ weight: 'font-thin', label: 'Thin (100)' },
								{ weight: 'font-extralight', label: 'ExtraLight (200)' },
								{ weight: 'font-light', label: 'Light (300)' },
								{ weight: 'font-normal', label: 'Regular (400)' },
								{ weight: 'font-medium', label: 'Medium (500)' },
								{ weight: 'font-semibold', label: 'SemiBold (600)' },
								{ weight: 'font-bold', label: 'Bold (700)' },
								{ weight: 'font-extrabold', label: 'ExtraBold (800)' },
								{ weight: 'font-black', label: 'Black (900)' },
							].map(({ weight, label }) => (
								<div key={weight} className="p-2 border rounded">
									<div className="text-xs text-gray-500 mb-1">{label}</div>
									<p className={`font-pretendard text-lg ${weight}`}>
										가나다라마바사 ABCDEFG 123456
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
				<h3 className="mb-4 text-lg font-semibold">실제 적용 결과</h3>
				<div
					className={`text-xl leading-relaxed font-multilang ${
						hasArabicText ? 'text-right' : 'text-left'
					}`}
					dir={hasArabicText ? 'rtl' : 'ltr'}>
					{currentText}
				</div>
				<div className="mt-4 text-sm text-gray-500">
					위 텍스트는 font-multilang 클래스로 각 문자에 최적화된 폰트가 자동 적용됩니다.
				</div>
			</div>
			{/* #endregion */}
		</div>
	);
} 