'use client';

import React from 'react';
import { DotPattern, BorderBeam, Ripple, FlickeringGrid, TextAnimate, NumberTicker } from '@/components/ui/ui-effects/animation';

export default function AnimationTestPage() {
	return (
		<div className="container p-6 mx-auto space-y-8">
			{/* 페이지 헤더 */}
			<div className="text-center">
				<h1 className="mb-4 text-3xl font-bold">애니메이션 효과 테스트</h1>
				<p className="text-muted-foreground">
					다양한 애니메이션 효과들을 테스트합니다.
				</p>
			</div>

			{/* DotPattern 테스트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold">DotPattern</h2>
				<div className="relative h-64 w-full overflow-hidden rounded-lg border">
					<DotPattern
						width={20}
						height={20}
						glow={true}
						className="opacity-50"
					/>
					<div className="absolute inset-0 flex items-center justify-center">
						<p className="text-lg font-medium">Dot Pattern Background</p>
					</div>
				</div>
			</div>

			{/* BorderBeam 테스트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold">BorderBeam</h2>
				<div className="relative h-32 w-full overflow-hidden rounded-lg border">
					<BorderBeam />
					<div className="absolute inset-0 flex items-center justify-center">
						<p className="text-lg font-medium">Border Beam Effect</p>
					</div>
				</div>
			</div>

			{/* Ripple 테스트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold">Ripple</h2>
				<div className="relative h-32 w-full overflow-hidden rounded-lg border">
					<Ripple />
					<div className="absolute inset-0 flex items-center justify-center">
						<p className="text-lg font-medium">Ripple Effect</p>
					</div>
				</div>
			</div>

			{/* FlickeringGrid 테스트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold">FlickeringGrid</h2>
				<div className="relative h-64 w-full overflow-hidden rounded-lg border">
					<FlickeringGrid />
					<div className="absolute inset-0 flex items-center justify-center">
						<p className="text-lg font-medium">Flickering Grid Effect</p>
					</div>
				</div>
			</div>

			{/* TextAnimate 테스트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold">TextAnimate</h2>
				<div className="h-32 w-full flex items-center justify-center">
					<TextAnimate>Animated Text</TextAnimate>
				</div>
			</div>

			{/* NumberTicker 테스트 */}
			<div className="p-6 rounded-lg neu-flat">
				<h2 className="mb-4 text-xl font-semibold">NumberTicker</h2>
				<div className="h-32 w-full flex items-center justify-center">
					<NumberTicker value={12345} />
				</div>
			</div>
		</div>
	);
} 