'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from '@/hooks/useI18n';

export default function RTLDemoPage() {
	const t = useTranslations();
	const { currentLocale, changeLocale } = useLocale();
	const [testText, setTestText] = useState('Mixed text: Hello 안녕하세요 مرحبا بكم');

	const demoTexts = [
		{
			label: '한국어 텍스트',
			text: '주차 관리 시스템에 오신 것을 환영합니다. 차량 번호판을 입력해주세요.',
		},
		{
			label: 'English Text',
			text: 'Welcome to the parking management system. Please enter your license plate number.',
		},
		{
			label: 'Arabic Text (RTL)',
			text: 'مرحبا بكم في نظام إدارة المواقف. يرجى إدخال رقم لوحة السيارة الخاصة بكم.',
		},
		{
			label: 'Mixed Languages',
			text: 'Parking: 주차 공간 / موقف السيارات - Available: 사용 가능 / متاح',
		},
	];

	const testComponents = [
		{
			title: '기본 텍스트 방향',
			content: (
				<div className="space-y-4">
					{demoTexts.map((demo, index) => (
						<div key={index} className="neu-flat p-4 rounded-lg">
							<h4 className="font-medium text-gray-700 mb-2">{demo.label}</h4>
							<p className="font-multilang" dir="auto">
								{demo.text}
							</p>
						</div>
					))}
				</div>
			),
		},
		{
			title: '강제 RTL 방향',
			content: (
				<div className="space-y-4">
					{demoTexts.map((demo, index) => (
						<div key={index} className="neu-flat p-4 rounded-lg">
							<h4 className="font-medium text-gray-700 mb-2">{demo.label}</h4>
							<p className="font-multilang" dir="rtl" style={{ textAlign: 'right' }}>
								{demo.text}
							</p>
						</div>
					))}
				</div>
			),
		},
		{
			title: '강제 LTR 방향',
			content: (
				<div className="space-y-4">
					{demoTexts.map((demo, index) => (
						<div key={index} className="neu-flat p-4 rounded-lg">
							<h4 className="font-medium text-gray-700 mb-2">{demo.label}</h4>
							<p className="font-multilang" dir="ltr" style={{ textAlign: 'left' }}>
								{demo.text}
							</p>
						</div>
					))}
				</div>
			),
		},
	];

	return (
		<div className="p-6 space-y-8">
			<div className="text-center">
				<h1 className="mb-2 text-3xl font-bold text-gray-800">
					RTL/LTR 언어 방향 테스트
				</h1>
				<p className="text-gray-600">
					다국어 지원 및 텍스트 방향 제어 테스트 페이지
				</p>
			</div>

			{/* 언어 설정 */}
			<div className="neu-flat p-6 rounded-lg">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">현재 언어 설정</h2>
				<div className="flex flex-wrap gap-4 items-center">
					<div className="text-gray-700">
						현재 언어: <span className="font-medium">{currentLocale}</span>
					</div>
					<div className="flex gap-2">
						<button
							onClick={() => changeLocale('ko')}
							className={`px-4 py-2 rounded-lg transition-all ${
								currentLocale === 'ko' ? 'neu-inset' : 'neu-raised'
							}`}
						>
							한국어
						</button>
						<button
							onClick={() => changeLocale('en')}
							className={`px-4 py-2 rounded-lg transition-all ${
								currentLocale === 'en' ? 'neu-inset' : 'neu-raised'
							}`}
						>
							English
						</button>
						<button
							onClick={() => changeLocale('ar')}
							className={`px-4 py-2 rounded-lg transition-all ${
								currentLocale === 'ar' ? 'neu-inset' : 'neu-raised'
							}`}
						>
							العربية
						</button>
					</div>
				</div>
			</div>

			{/* 번역 테스트 */}
			<div className="neu-flat p-6 rounded-lg">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">다국어 번역 테스트</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div className="neu-flat p-4 rounded-lg">
						<p className="font-multilang text-lg">{t('공통_로딩중')}</p>
					</div>
					<div className="neu-flat p-4 rounded-lg">
						<p className="font-multilang text-lg">{t('메뉴_주차')}</p>
					</div>
					<div className="neu-flat p-4 rounded-lg">
						<p className="font-multilang text-lg">{t('공통_검색')}</p>
					</div>
				</div>
			</div>

			{/* 텍스트 방향 테스트 */}
			{testComponents.map((component, index) => (
				<div key={index} className="neu-flat p-6 rounded-lg">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						{component.title}
					</h2>
					{component.content}
				</div>
			))}

			{/* 동적 텍스트 테스트 */}
			<div className="neu-flat p-6 rounded-lg">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					동적 텍스트 입력 테스트
				</h2>
				<div className="space-y-4">
					<textarea
						value={testText}
						onChange={(e) => setTestText(e.target.value)}
						placeholder="다국어 텍스트를 입력해보세요..."
						className="w-full p-3 rounded-lg neu-inset font-multilang resize-none"
						rows={3}
					/>
					<div className="space-y-3">
						<div>
							<h4 className="font-medium text-gray-700 mb-2">자동 방향 (dir=&quot;auto&quot;)</h4>
							<div className="neu-flat p-4 rounded-lg">
								<p className="font-multilang" dir="auto">
									{testText}
								</p>
							</div>
						</div>
						<div>
							<h4 className="font-medium text-gray-700 mb-2">
								아랍어 감지 기반 RTL (실제 구현)
							</h4>
							<div className="neu-flat p-4 rounded-lg">
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
			<div className="neu-flat p-6 rounded-lg">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					UI 컴포넌트 RTL 테스트
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h4 className="font-medium text-gray-700 mb-3">버튼 컴포넌트</h4>
						<div className="space-y-2">
							<button className="neu-raised px-6 py-3 rounded-lg font-multilang">
								저장하기 Save حفظ
							</button>
							<button className="neu-raised px-6 py-3 rounded-lg font-multilang">
								취소 Cancel إلغاء
							</button>
						</div>
					</div>
					<div>
						<h4 className="font-medium text-gray-700 mb-3">입력 필드</h4>
						<div className="space-y-2">
							<input
								type="text"
								placeholder="이름 Name الاسم"
								className="w-full p-3 rounded-lg neu-inset font-multilang"
							/>
							<input
								type="text"
								placeholder="주차번호 Parking Number رقم الموقف"
								className="w-full p-3 rounded-lg neu-inset font-multilang"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* 폰트 렌더링 테스트 */}
			<div className="neu-flat p-6 rounded-lg">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">
					폰트 렌더링 테스트
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="neu-flat p-4 rounded-lg">
						<h4 className="font-medium text-gray-700 mb-2">한국어 (Pretendard)</h4>
						<p className="font-pretendard text-lg">
							주차 관리 시스템<br />
							가나다라마바사아차카타파하
						</p>
					</div>
					<div className="neu-flat p-4 rounded-lg">
						<h4 className="font-medium text-gray-700 mb-2">English (Inter)</h4>
						<p className="font-inter text-lg">
							Parking Management<br />
							ABCDEFGHIJKLMNOPQRSTUVWXYZ
						</p>
					</div>
					<div className="neu-flat p-4 rounded-lg">
						<h4 className="font-medium text-gray-700 mb-2">Arabic (Cairo)</h4>
						<p className="font-cairo text-lg" dir="rtl">
							إدارة المواقف<br />
							أبتثجحخدذرزسشصضطظعغفقكلمنهوي
						</p>
					</div>
				</div>
			</div>
		</div>
	);
} 