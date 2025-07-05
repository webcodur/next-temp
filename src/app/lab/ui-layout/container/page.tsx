'use client';

import React, { useState } from 'react';
import { RaisedContainer } from '@/components/ui/ui-layout/neumorphicContainer/RaisedContainer';
import { InsetContainer } from '@/components/ui/ui-layout/neumorphicContainer/InsetContainer';
import { FlatContainer } from '@/components/ui/ui-layout/neumorphicContainer/FlatContainer';
import { CircleContainer } from '@/components/ui/ui-layout/neumorphicContainer/CircleContainer';
import { useTranslations } from '@/hooks/useI18n';

export default function NeumorphicPage() {
	const t = useTranslations();
	const [count, setCount] = useState(0);

	return (
		<div className="flex flex-col gap-8 p-8 min-h-screen bg-background">
			<div className="text-2xl font-bold">{t('컨테이너테스트_제목')}</div>

			{/* 양각 컨테이너 */}
			<div className="flex flex-col gap-6">
				<h2 className="text-xl font-semibold">{t('컨테이너테스트_양각컨테이너')}</h2>
				<RaisedContainer className="max-w-md">
					<h3 className="mb-2 text-lg font-medium">{t('컨테이너테스트_양각컨테이너예시')}</h3>
					<p>{t('컨테이너테스트_현재카운트').replace('{count}', count.toString())}</p>
					<div className="flex gap-2 mt-4">
						<button
							className="px-3 py-1 bg-primary/10 rounded"
							onClick={() => setCount((prev) => prev + 1)}>
							{t('컨테이너테스트_증가')}
						</button>
						<button
							className="px-3 py-1 bg-muted rounded"
							onClick={() => setCount(0)}>
							{t('컨테이너테스트_리셋')}
						</button>
					</div>
				</RaisedContainer>
			</div>

			{/* 음각 컨테이너 */}
			<div className="flex flex-col gap-6">
				<h2 className="text-xl font-semibold">{t('컨테이너테스트_음각컨테이너')}</h2>
				<InsetContainer className="max-w-md">
					<h3 className="mb-2 text-lg font-medium">{t('컨테이너테스트_음각컨테이너예시')}</h3>
					<p>{t('컨테이너테스트_현재카운트').replace('{count}', count.toString())}</p>
					<div className="flex gap-2 mt-4">
						<button
							className="px-3 py-1 bg-primary/10 rounded"
							onClick={() => setCount((prev) => prev + 1)}>
							{t('컨테이너테스트_증가')}
						</button>
						<button
							className="px-3 py-1 bg-muted rounded"
							onClick={() => setCount(0)}>
							{t('컨테이너테스트_리셋')}
						</button>
					</div>
				</InsetContainer>
			</div>

			{/* 평면 컨테이너 */}
			<div className="flex flex-col gap-6">
				<h2 className="text-xl font-semibold">{t('컨테이너테스트_평면컨테이너')}</h2>
				<FlatContainer className="max-w-md">
					<h3 className="mb-2 text-lg font-medium">{t('컨테이너테스트_평면컨테이너예시')}</h3>
					<p>{t('컨테이너테스트_현재카운트').replace('{count}', count.toString())}</p>
					<div className="flex gap-2 mt-4">
						<button
							className="px-3 py-1 bg-primary/10 rounded"
							onClick={() => setCount((prev) => prev + 1)}>
							{t('컨테이너테스트_증가')}
						</button>
						<button
							className="px-3 py-1 bg-muted rounded"
							onClick={() => setCount((prev) => prev - 1)}>
							{t('컨테이너테스트_감소')}
						</button>
					</div>
				</FlatContainer>

				<h2 className="mt-4 text-xl font-semibold">{t('컨테이너테스트_중첩컨테이너')}</h2>
				<FlatContainer className="max-w-md">
					<h3 className="mb-2 text-lg font-medium">{t('컨테이너테스트_외부평면컨테이너')}</h3>
					<RaisedContainer className="mb-4">
						<h4 className="font-medium">{t('컨테이너테스트_내부양각컨테이너')}</h4>
						<p className="text-sm">{t('컨테이너테스트_양각컨테이너내부콘텐츠')}</p>
					</RaisedContainer>
					<InsetContainer>
						<h4 className="font-medium">{t('컨테이너테스트_내부음각컨테이너')}</h4>
						<p className="text-sm">{t('컨테이너테스트_음각컨테이너내부콘텐츠')}</p>
					</InsetContainer>
				</FlatContainer>
			</div>

			{/* 원형 컨테이너 */}
			<div className="flex flex-col gap-6">
				<h2 className="text-xl font-semibold">{t('컨테이너테스트_원형컨테이너')}</h2>
				<div className="flex justify-center">
					<CircleContainer>
						<div className="text-center">
							<div className="mb-2 text-2xl font-bold">{count}</div>
							<div className="text-sm">{t('컨테이너테스트_카운트')}</div>
						</div>
					</CircleContainer>
				</div>

				<div className="flex gap-4 justify-center">
					<button
						className="px-3 py-1 bg-primary/10 rounded"
						onClick={() => setCount((prev) => prev + 1)}>
						{t('컨테이너테스트_증가1')}
					</button>
					<button
						className="px-3 py-1 bg-destructive/10 rounded"
						onClick={() => setCount((prev) => prev - 1)}>
						{t('컨테이너테스트_감소1')}
					</button>
					<button
						className="px-3 py-1 bg-muted rounded"
						onClick={() => setCount(0)}>
						{t('컨테이너테스트_리셋')}
					</button>
				</div>
			</div>
		</div>
	);
}
