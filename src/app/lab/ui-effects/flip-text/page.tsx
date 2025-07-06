'use client';

import React, { useState } from 'react';
import { FlipText } from '@/components/ui/ui-effects/flip-text/FlipText';
import { Button } from '@/components/ui/ui-input/button/Button';
import { Variants } from 'framer-motion';
import { useTranslations } from '@/hooks/useI18n';

export default function FlipTextPage() {
	const t = useTranslations();
	const [showDemo, setShowDemo] = useState(false);
	const [customText, setCustomText] = useState('Hello World!');

	// 커스텀 애니메이션 변형들
	const slideVariants: Variants = {
		hidden: {
			x: -50,
			opacity: 0,
			scale: 0.8,
		},
		visible: {
			x: 0,
			opacity: 1,
			scale: 1,
		},
	};

	const rotateYVariants: Variants = {
		hidden: {
			rotateY: 90,
			opacity: 0,
		},
		visible: {
			rotateY: 0,
			opacity: 1,
		},
	};

	const scaleVariants: Variants = {
		hidden: {
			scale: 0,
			opacity: 0,
			rotateZ: 180,
		},
		visible: {
			scale: 1,
			opacity: 1,
			rotateZ: 0,
		},
	};

	return (
		<div className="p-8 space-y-8 neu-flat">
			<div className="space-y-4">
				<h1 className="text-3xl font-bold text-foreground">
					{t('플립텍스트_제목')}
				</h1>
				<p className="text-muted-foreground">
					{t('플립텍스트_설명')}
				</p>
			</div>

			{/* 기본 사용법 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">{t('플립텍스트_기본사용법')}</h2>
				<div className="p-6 rounded-lg neu-inset bg-background/50">
					<div className="space-y-4">
						<FlipText className="text-lg">{t('플립텍스트_안녕하세요')}</FlipText>
						<FlipText className="text-xl text-primary">
							Welcome to FlipText
						</FlipText>
					</div>
				</div>
			</section>

			{/* 애니메이션 제어 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">{t('플립텍스트_애니메이션제어')}</h2>
				<div className="p-6 space-y-6 rounded-lg neu-inset bg-background/50">
					<div className="space-y-2">
						<h3 className="text-sm font-medium text-muted-foreground">
							{t('플립텍스트_빠른애니메이션설명')}
						</h3>
						<FlipText duration={0.3} delayMultiple={0.05} className="text-lg">
							{t('플립텍스트_빠른애니메이션')}
						</FlipText>
					</div>

					<div className="space-y-2">
						<h3 className="text-sm font-medium text-muted-foreground">
							{t('플립텍스트_느린애니메이션설명')}
						</h3>
						<FlipText duration={1.0} delayMultiple={0.15} className="text-lg">
							{t('플립텍스트_느린애니메이션')}
						</FlipText>
					</div>
				</div>
			</section>

			{/* 커스텀 요소 타입 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">{t('플립텍스트_커스텀요소타입')}</h2>
				<div className="p-6 space-y-4 rounded-lg neu-inset bg-background/50">
					<FlipText as="h1" className="text-2xl font-bold">
						{t('플립텍스트_제목H1')}
					</FlipText>
					<FlipText as="p" className="text-base text-muted-foreground">
						{t('플립텍스트_문단텍스트P')}
					</FlipText>
					<FlipText
						as="code"
						className="px-2 py-1 font-mono text-sm rounded bg-muted">
						{t('플립텍스트_코드텍스트CODE')}
					</FlipText>
				</div>
			</section>

			{/* 커스텀 애니메이션 변형 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">{t('플립텍스트_커스텀애니메이션변형')}</h2>
				<div className="p-6 space-y-6 rounded-lg neu-inset bg-background/50">
					<div className="space-y-2">
						<h3 className="text-sm font-medium text-muted-foreground">
							{t('플립텍스트_슬라이드스케일')}
						</h3>
						<FlipText
							variants={slideVariants}
							className="text-lg text-blue-600">
							{t('플립텍스트_슬라이드애니메이션')}
						</FlipText>
					</div>

					<div className="space-y-2">
						<h3 className="text-sm font-medium text-muted-foreground">
							{t('플립텍스트_Y축회전')}
						</h3>
						<FlipText
							variants={rotateYVariants}
							className="text-lg text-green-600">
							{t('플립텍스트_Y축회전애니메이션')}
						</FlipText>
					</div>

					<div className="space-y-2">
						<h3 className="text-sm font-medium text-muted-foreground">
							{t('플립텍스트_스케일Z축회전')}
						</h3>
						<FlipText
							variants={scaleVariants}
							duration={0.8}
							delayMultiple={0.1}
							className="text-lg text-purple-600">
							{t('플립텍스트_복합애니메이션')}
						</FlipText>
					</div>
				</div>
			</section>

			{/* 실시간 테스트 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">{t('플립텍스트_실시간테스트')}</h2>
				<div className="p-6 space-y-4 rounded-lg neu-inset bg-background/50">
					<div className="space-y-2">
						<label className="block text-sm font-medium">{t('플립텍스트_텍스트입력')}</label>
						<input
							type="text"
							value={customText}
							onChange={(e) => setCustomText(e.target.value)}
							className="px-3 py-2 w-full rounded border-0 neu-inset bg-background"
							placeholder={t('플립텍스트_텍스트입력플레이스홀더')}
						/>
					</div>

					<div className="space-y-2">
						<Button
							onClick={() => setShowDemo(!showDemo)}
							className="neu-raised">
							{showDemo ? t('플립텍스트_애니메이션숨기기') : t('플립텍스트_애니메이션보기')}
						</Button>
					</div>

					{showDemo && (
						<div className="pt-4 border-t">
							<FlipText
								key={customText}
								className="text-xl font-semibold text-primary">
								{customText}
							</FlipText>
						</div>
					)}
				</div>
			</section>

			{/* 다국어 텍스트 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">{t('플립텍스트_다국어지원')}</h2>
				<div className="p-6 space-y-4 rounded-lg neu-inset bg-background/50">
					<FlipText className="text-lg font-multilang">
						안녕하세요 Hello مرحبا
					</FlipText>
					<FlipText
						className="text-base font-multilang text-muted-foreground"
						duration={0.8}
						delayMultiple={0.12}>
						{t('플립텍스트_다국어폰트시스템')}
					</FlipText>
				</div>
			</section>

			{/* 활용 예시 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">{t('플립텍스트_활용예시')}</h2>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="p-6 space-y-3 rounded-lg neu-inset bg-background/50">
						<h3 className="text-sm font-medium text-muted-foreground">
							{t('플립텍스트_로딩텍스트')}
						</h3>
						<FlipText
							className="text-lg text-blue-600"
							duration={0.6}
							delayMultiple={0.1}>
							{t('플립텍스트_로딩중')}
						</FlipText>
					</div>

					<div className="p-6 space-y-3 rounded-lg neu-inset bg-background/50">
						<h3 className="text-sm font-medium text-muted-foreground">
							{t('플립텍스트_브랜드텍스트')}
						</h3>
						<FlipText
							as="h2"
							className="text-2xl font-bold text-primary"
							duration={0.7}
							delayMultiple={0.08}>
							{t('플립텍스트_PRIMARY')}
						</FlipText>
					</div>

					<div className="p-6 space-y-3 rounded-lg neu-inset bg-background/50">
						<h3 className="text-sm font-medium text-muted-foreground">
							{t('플립텍스트_키메시지')}
						</h3>
						<FlipText
							className="text-lg font-semibold text-green-600"
							variants={slideVariants}>
							{t('플립텍스트_성공적으로완료')}
						</FlipText>
					</div>

					<div className="p-6 space-y-3 rounded-lg neu-inset bg-background/50">
						<h3 className="text-sm font-medium text-muted-foreground">
							{t('플립텍스트_인트로텍스트')}
						</h3>
						<FlipText
							className="text-xl text-purple-600"
							duration={1.2}
							delayMultiple={0.2}>
							{t('플립텍스트_환영합니다')}
						</FlipText>
					</div>
				</div>
			</section>
		</div>
	);
}
