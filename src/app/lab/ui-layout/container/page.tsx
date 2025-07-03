'use client';

import React, { useState } from 'react';
import { RaisedContainer } from '@/components/ui/ui-layout/neumorphicContainer/RaisedContainer';
import { InsetContainer } from '@/components/ui/ui-layout/neumorphicContainer/InsetContainer';
import { FlatContainer } from '@/components/ui/ui-layout/neumorphicContainer/FlatContainer';
import { CircleContainer } from '@/components/ui/ui-layout/neumorphicContainer/CircleContainer';

export default function NeumorphicPage() {
	const [count, setCount] = useState(0);

	return (
		<div className="flex flex-col gap-8 p-8 min-h-screen bg-background">
			<div className="text-2xl font-bold">뉴모피즘 컴포넌트</div>

			{/* 양각 컨테이너 */}
			<div className="flex flex-col gap-6">
				<h2 className="text-xl font-semibold">양각 컨테이너 (Raised)</h2>
				<RaisedContainer className="max-w-md">
					<h3 className="mb-2 text-lg font-medium">양각 컨테이너 예시</h3>
					<p>현재 카운트: {count}</p>
					<div className="flex gap-2 mt-4">
						<button
							className="px-3 py-1 bg-primary/10 rounded"
							onClick={() => setCount((prev) => prev + 1)}>
							증가
						</button>
						<button
							className="px-3 py-1 bg-muted rounded"
							onClick={() => setCount(0)}>
							리셋
						</button>
					</div>
				</RaisedContainer>
			</div>

			{/* 음각 컨테이너 */}
			<div className="flex flex-col gap-6">
				<h2 className="text-xl font-semibold">음각 컨테이너 (Inset)</h2>
				<InsetContainer className="max-w-md">
					<h3 className="mb-2 text-lg font-medium">음각 컨테이너 예시</h3>
					<p>현재 카운트: {count}</p>
					<div className="flex gap-2 mt-4">
						<button
							className="px-3 py-1 bg-primary/10 rounded"
							onClick={() => setCount((prev) => prev + 1)}>
							증가
						</button>
						<button
							className="px-3 py-1 bg-muted rounded"
							onClick={() => setCount(0)}>
							리셋
						</button>
					</div>
				</InsetContainer>
			</div>

			{/* 평면 컨테이너 */}
			<div className="flex flex-col gap-6">
				<h2 className="text-xl font-semibold">평면 컨테이너 (Flat)</h2>
				<FlatContainer className="max-w-md">
					<h3 className="mb-2 text-lg font-medium">평면 컨테이너 예시</h3>
					<p>현재 카운트: {count}</p>
					<div className="flex gap-2 mt-4">
						<button
							className="px-3 py-1 bg-primary/10 rounded"
							onClick={() => setCount((prev) => prev + 1)}>
							증가
						</button>
						<button
							className="px-3 py-1 bg-muted rounded"
							onClick={() => setCount((prev) => prev - 1)}>
							감소
						</button>
					</div>
				</FlatContainer>

				<h2 className="mt-4 text-xl font-semibold">중첩 컨테이너</h2>
				<FlatContainer className="max-w-md">
					<h3 className="mb-2 text-lg font-medium">외부: 평면 컨테이너</h3>
					<RaisedContainer className="mb-4">
						<h4 className="font-medium">내부: 양각 컨테이너</h4>
						<p className="text-sm">양각 컨테이너 내부 콘텐츠</p>
					</RaisedContainer>
					<InsetContainer>
						<h4 className="font-medium">내부: 음각 컨테이너</h4>
						<p className="text-sm">음각 컨테이너 내부 콘텐츠</p>
					</InsetContainer>
				</FlatContainer>
			</div>

			{/* 원형 컨테이너 */}
			<div className="flex flex-col gap-6">
				<h2 className="text-xl font-semibold">원형 컨테이너 (Circle)</h2>
				<div className="flex justify-center">
					<CircleContainer>
						<div className="text-center">
							<div className="mb-2 text-2xl font-bold">{count}</div>
							<div className="text-sm">카운트</div>
						</div>
					</CircleContainer>
				</div>

				<div className="flex gap-4 justify-center">
					<button
						className="px-3 py-1 bg-primary/10 rounded"
						onClick={() => setCount((prev) => prev + 1)}>
						증가 (+1)
					</button>
					<button
						className="px-3 py-1 bg-destructive/10 rounded"
						onClick={() => setCount((prev) => prev - 1)}>
						감소 (-1)
					</button>
					<button
						className="px-3 py-1 bg-muted rounded"
						onClick={() => setCount(0)}>
						리셋
					</button>
				</div>
			</div>
		</div>
	);
}
