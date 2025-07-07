/*
  파일명: src/app/lab/system-testing/rtl-demo/page.tsx
  기능: RTL(Right-to-Left) 언어 지원을 테스트하는 데모 페이지
  책임: `dir` 속성 및 `text-align`을 포함한 RTL 스타일링, 다국어 텍스트 렌더링, 언어 전환 기능을 시각적으로 검증한다.
*/

'use client';

import React, { useState } from 'react';

import { useTranslations, useLocale } from '@/hooks/useI18n';

export default function RTLDemoPage() {
	// #region 훅
	const t = useTranslations();
	const { currentLocale, changeLocale } = useLocale();
	// #endregion

	// #region 상태
	const [testText, setTestText] = useState(t('RTL데모_기본테스트텍스트'));
	// #endregion

	// #region 상수
	const demoTexts = [
		{
			label: t('RTL데모_한국어텍스트'),
			text: t('RTL데모_한국어샘플'),
		},
		{
			label: t('RTL데모_영어텍스트'),
			text: t('RTL데모_영어샘플'),
		},
		{
			label: t('RTL데모_아랍어텍스트'),
			text: t('RTL데모_아랍어샘플'),
		},
		{
			label: t('RTL데모_혼합언어'),
			text: t('RTL데모_혼합샘플'),
		},
	];

	const testComponents = [
		{
			title: t('RTL데모_기본텍스트방향'),
			content: (
				<div className="space-y-4">
					{demoTexts.map((demo, index) => (
						<div key={index} className="p-4 rounded-lg neu-flat">
							<h4 className="mb-2 font-medium text-gray-700 font-multilang">{demo.label}</h4>
							<p className="font-multilang" dir="auto">
								{demo.text}
							</p>
						</div>
					))}
				</div>
			),
		},
		{
			title: t('RTL데모_강제RTL방향'),
			content: (
				<div className="space-y-4">
					{demoTexts.map((demo, index) => (
						<div key={index} className="p-4 rounded-lg neu-flat">
							<h4 className="mb-2 font-medium text-gray-700 font-multilang">{demo.label}</h4>
							<p className="font-multilang" dir="rtl" style={{ textAlign: 'right' }}>
								{demo.text}
							</p>
						</div>
					))}
				</div>
			),
		},
		{
			title: t('RTL데모_강제LTR방향'),
			content: (
				<div className="space-y-4">
					{demoTexts.map((demo, index) => (
						<div key={index} className="p-4 rounded-lg neu-flat">
							<h4 className="mb-2 font-medium text-gray-700 font-multilang">{demo.label}</h4>
							<p className="font-multilang" dir="ltr" style={{ textAlign: 'left' }}>
								{demo.text}
							</p>
						</div>
					))}
				</div>
			),
		},
	];
	// #endregion

	// #region 렌더링
	return (
		<div className="p-6 space-y-8">
			<div className="text-center">
				<h1 className="mb-2 text-3xl font-bold text-gray-800 font-multilang">
					{t('RTL데모_제목')}
				</h1>
				<p className="text-gray-600 font-multilang">
					{t('RTL데모_설명')}
				</p>
			</div>

			{/* 언어 설정 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-gray-800 font-multilang">{t('RTL데모_현재언어설정')}</h2>
				<div className="flex flex-wrap gap-4 items-center">
					<div className="text-gray-700 font-multilang">
						{t('RTL데모_현재언어')}: <span className="font-medium">{currentLocale}</span>
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => changeLocale('ko')}
							className={`px-4 py-2 rounded-lg transition-all font-multilang ${
								currentLocale === 'ko' ? 'neu-inset' : 'neu-raised'
							}`}
						>
							{t('RTL데모_한국어버튼')}
						</button>
						<button
							onClick={() => changeLocale('en')}
							className={`px-4 py-2 rounded-lg transition-all font-multilang ${
								currentLocale === 'en' ? 'neu-inset' : 'neu-raised'
							}`}
						>
							{t('RTL데모_영어버튼')}
						</button>
						<button
							onClick={() => changeLocale('ar')}
							className={`px-4 py-2 rounded-lg transition-all font-multilang ${
								currentLocale === 'ar' ? 'neu-inset' : 'neu-raised'
							}`}
						>
							{t('RTL데모_아랍어버튼')}
						</button>
					</div>
				</div>
			</div>

			{/* 번역 테스트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-gray-800 font-multilang">{t('RTL데모_다국어번역테스트')}</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					<div className="p-4 rounded-lg neu-flat">
						<p className="text-lg font-multilang">{t('공통_로딩중')}</p>
					</div>
					<div className="p-4 rounded-lg neu-flat">
						<p className="text-lg font-multilang">{t('메뉴_주차')}</p>
					</div>
					<div className="p-4 rounded-lg neu-flat">
						<p className="text-lg font-multilang">{t('공통_검색')}</p>
					</div>
				</div>
			</div>

			{/* 텍스트 방향 테스트 */}
			{testComponents.map((component, index) => (
				<div key={index} className="p-6 rounded-lg neu-flat">
					<h2 className="mb-4 text-xl font-semibold text-gray-800 font-multilang">
						{component.title}
					</h2>
					{component.content}
				</div>
			))}

			{/* 동적 텍스트 테스트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-gray-800 font-multilang">
					{t('RTL데모_동적텍스트테스트')}
				</h2>
				<div className="space-y-4">
					<textarea
						value={testText}
						onChange={(e) => setTestText(e.target.value)}
						placeholder={t('RTL데모_텍스트입력플레이스홀더')}
						className="p-3 w-full rounded-lg resize-none neu-inset font-multilang"
						rows={3}
					/>
					<div className="space-y-3">
						<div>
							<h4 className="mb-2 font-medium text-gray-700 font-multilang">{t('RTL데모_자동방향')}</h4>
							<div className="p-4 rounded-lg neu-flat">
								<p className="font-multilang" dir="auto">
									{testText}
								</p>
							</div>
						</div>
						<div>
							<h4 className="mb-2 font-medium text-gray-700 font-multilang">
								{t('RTL데모_아랍어감지RTL')}
							</h4>
							<div className="p-4 rounded-lg neu-flat">
								<p
									className="font-multilang"
									dir={/[\u0600-\u06FF]/.test(testText) ? 'rtl' : 'ltr'}
									style={{
										textAlign: /[\u0600-\u06FF]/.test(testText) ? 'right' : 'left',
									}}
								>
									{testText}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 컴포넌트 내부 텍스트 방향 테스트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-gray-800 font-multilang">
					{t('RTL데모_UI컴포넌트테스트')}
				</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<h4 className="mb-3 font-medium text-gray-700 font-multilang">{t('RTL데모_버튼컴포넌트')}</h4>
						<div className="space-y-2">
							<button className="px-6 py-3 rounded-lg neu-raised font-multilang">
								{t('RTL데모_저장버튼')}
							</button>
							<button className="px-6 py-3 rounded-lg neu-raised font-multilang">
								{t('RTL데모_취소버튼')}
							</button>
						</div>
					</div>
					<div>
						<h4 className="mb-3 font-medium text-gray-700 font-multilang">{t('RTL데모_입력필드')}</h4>
						<div className="space-y-2">
							<input
								type="text"
								placeholder={t('RTL데모_이름플레이스홀더')}
								className="p-3 w-full rounded-lg neu-inset font-multilang"
							/>
							<input
								type="text"
								placeholder={t('RTL데모_주차번호플레이스홀더')}
								className="p-3 w-full rounded-lg neu-inset font-multilang"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* 폰트 렌더링 테스트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold text-gray-800 font-multilang">
					{t('RTL데모_폰트렌더링테스트')}
				</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="p-4 rounded-lg neu-flat">
						<h4 className="mb-2 font-medium text-gray-700 font-multilang">{t('RTL데모_한국어폰트')}</h4>
						<p className="text-lg font-pretendard">
							{t('RTL데모_한국어폰트샘플')}
						</p>
					</div>
					<div className="p-4 rounded-lg neu-flat">
						<h4 className="mb-2 font-medium text-gray-700 font-multilang">{t('RTL데모_영어폰트')}</h4>
						<p className="text-lg font-inter">
							{t('RTL데모_영어폰트샘플')}
						</p>
					</div>
					<div className="p-4 rounded-lg neu-flat">
						<h4 className="mb-2 font-medium text-gray-700 font-multilang">{t('RTL데모_아랍어폰트')}</h4>
						<p className="text-lg font-cairo" dir="rtl">
							{t('RTL데모_아랍어폰트샘플')}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
	// #endregion
} 