'use client';

import { useState } from 'react';
import { FlipText } from '@/components/ui/flip-text';
import { Button } from '@/components/ui/button';
import { Variants } from 'framer-motion';

export default function FlipTextPage() {
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
		<div className="neu-flat p-8 space-y-8">
			<div className="space-y-4">
				<h1 className="text-3xl font-bold text-foreground">
					FlipText 컴포넌트
				</h1>
				<p className="text-muted-foreground">
					텍스트의 각 문자를 개별적으로 회전시키는 애니메이션 컬포넌트입니다.
				</p>
			</div>

			{/* 기본 사용법 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">기본 사용법</h2>
				<div className="neu-inset p-6 rounded-lg bg-background/50">
					<div className="space-y-4">
						<FlipText className="text-lg">안녕하세요!</FlipText>
						<FlipText className="text-xl text-primary">
							Welcome to FlipText
						</FlipText>
					</div>
				</div>
			</section>

			{/* 애니메이션 제어 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">애니메이션 제어</h2>
				<div className="neu-inset p-6 rounded-lg bg-background/50 space-y-6">
					<div className="space-y-2">
						<h3 className="font-medium text-sm text-muted-foreground">
							빠른 애니메이션 (duration: 0.3, delayMultiple: 0.05)
						</h3>
						<FlipText duration={0.3} delayMultiple={0.05} className="text-lg">
							빠른 애니메이션
						</FlipText>
					</div>

					<div className="space-y-2">
						<h3 className="font-medium text-sm text-muted-foreground">
							느린 애니메이션 (duration: 1.0, delayMultiple: 0.15)
						</h3>
						<FlipText duration={1.0} delayMultiple={0.15} className="text-lg">
							느린 애니메이션
						</FlipText>
					</div>
				</div>
			</section>

			{/* 커스텀 요소 타입 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">커스텀 요소 타입</h2>
				<div className="neu-inset p-6 rounded-lg bg-background/50 space-y-4">
					<FlipText as="h1" className="text-2xl font-bold">
						제목 (H1)
					</FlipText>
					<FlipText as="p" className="text-base text-muted-foreground">
						문단 텍스트 (P)
					</FlipText>
					<FlipText
						as="code"
						className="text-sm bg-muted px-2 py-1 rounded font-mono">
						코드 텍스트 (CODE)
					</FlipText>
				</div>
			</section>

			{/* 커스텀 애니메이션 변형 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">커스텀 애니메이션 변형</h2>
				<div className="neu-inset p-6 rounded-lg bg-background/50 space-y-6">
					<div className="space-y-2">
						<h3 className="font-medium text-sm text-muted-foreground">
							슬라이드 + 스케일
						</h3>
						<FlipText
							variants={slideVariants}
							className="text-lg text-blue-600">
							슬라이드 애니메이션
						</FlipText>
					</div>

					<div className="space-y-2">
						<h3 className="font-medium text-sm text-muted-foreground">
							Y축 회전
						</h3>
						<FlipText
							variants={rotateYVariants}
							className="text-lg text-green-600">
							Y축 회전 애니메이션
						</FlipText>
					</div>

					<div className="space-y-2">
						<h3 className="font-medium text-sm text-muted-foreground">
							스케일 + Z축 회전
						</h3>
						<FlipText
							variants={scaleVariants}
							duration={0.8}
							delayMultiple={0.1}
							className="text-lg text-purple-600">
							복합 애니메이션
						</FlipText>
					</div>
				</div>
			</section>

			{/* 실시간 테스트 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">실시간 테스트</h2>
				<div className="neu-inset p-6 rounded-lg bg-background/50 space-y-4">
					<div className="space-y-2">
						<label className="block text-sm font-medium">텍스트 입력:</label>
						<input
							type="text"
							value={customText}
							onChange={(e) => setCustomText(e.target.value)}
							className="neu-inset px-3 py-2 rounded border-0 bg-background w-full"
							placeholder="애니메이션할 텍스트를 입력하세요"
						/>
					</div>

					<div className="space-y-2">
						<Button
							onClick={() => setShowDemo(!showDemo)}
							className="neu-raised">
							{showDemo ? '애니메이션 숨기기' : '애니메이션 보기'}
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
				<h2 className="text-xl font-semibold">다국어 지원</h2>
				<div className="neu-inset p-6 rounded-lg bg-background/50 space-y-4">
					<FlipText className="text-lg font-multilang">
						안녕하세요 Hello مرحبا
					</FlipText>
					<FlipText
						className="text-base font-multilang text-muted-foreground"
						duration={0.8}
						delayMultiple={0.12}>
						다국어 폰트 시스템과 함께 사용
					</FlipText>
				</div>
			</section>

			{/* 활용 예시 */}
			<section className="space-y-4">
				<h2 className="text-xl font-semibold">활용 예시</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="neu-inset p-6 rounded-lg bg-background/50 space-y-3">
						<h3 className="font-medium text-sm text-muted-foreground">
							로딩 텍스트
						</h3>
						<FlipText
							className="text-lg text-blue-600"
							duration={0.6}
							delayMultiple={0.1}>
							로딩 중...
						</FlipText>
					</div>

					<div className="neu-inset p-6 rounded-lg bg-background/50 space-y-3">
						<h3 className="font-medium text-sm text-muted-foreground">
							브랜드 텍스트
						</h3>
						<FlipText
							as="h2"
							className="text-2xl font-bold text-primary"
							duration={0.7}
							delayMultiple={0.08}>
							BRAND
						</FlipText>
					</div>

					<div className="neu-inset p-6 rounded-lg bg-background/50 space-y-3">
						<h3 className="font-medium text-sm text-muted-foreground">
							키 메시지
						</h3>
						<FlipText
							className="text-lg font-semibold text-green-600"
							variants={slideVariants}>
							성공적으로 완료!
						</FlipText>
					</div>

					<div className="neu-inset p-6 rounded-lg bg-background/50 space-y-3">
						<h3 className="font-medium text-sm text-muted-foreground">
							인트로 텍스트
						</h3>
						<FlipText
							className="text-xl text-purple-600"
							duration={1.2}
							delayMultiple={0.2}>
							환영합니다
						</FlipText>
					</div>
				</div>
			</section>
		</div>
	);
}
