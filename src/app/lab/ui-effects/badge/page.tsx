'use client';

import React from 'react';
import { Badge } from '@/components/ui/ui-effects/badge/Badge';
import { useTranslations } from '@/hooks/useI18n';

const BadgePage = () => {
	const t = useTranslations();

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">{t('배지_제목')}</h1>
					<p className="text-gray-600">{t('배지_설명')}</p>
				</div>

				<div className="space-y-8">
					{/* 기본 배지 */}
					<section className="bg-white rounded-lg p-6 shadow-xs">
						<h2 className="text-xl font-semibold mb-4">{t('배지_기본배지')}</h2>
						<div className="space-x-4 flex items-center">
							<Badge>{t('배지_Default')}</Badge>
							<Badge variant="secondary">{t('배지_Secondary')}</Badge>
							<Badge variant="destructive">{t('배지_Destructive')}</Badge>
							<Badge variant="outline">{t('배지_Outline')}</Badge>
						</div>
					</section>

					{/* 스타일 변형 */}
					<section className="bg-white rounded-lg p-6 shadow-xs">
						<h2 className="text-xl font-semibold mb-4">{t('배지_스타일변형')}</h2>
						<div className="space-x-4 flex items-center">
							<Badge className="text-xs">{t('배지_SmallText')}</Badge>
							<Badge className="text-sm">{t('배지_MediumText')}</Badge>
							<Badge className="text-base px-3 py-1">{t('배지_LargeText')}</Badge>
						</div>
					</section>

					{/* 사용 예시 */}
					<section className="bg-white rounded-lg p-6 shadow-xs">
						<h2 className="text-xl font-semibold mb-4">{t('배지_사용예시')}</h2>
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<span>{t('배지_온라인상태')}</span>
								<Badge variant="default">{t('배지_Online')}</Badge>
							</div>
							<div className="flex items-center space-x-2">
								<span>{t('배지_새메시지')}</span>
								<Badge variant="destructive">5</Badge>
							</div>
							<div className="flex items-center space-x-2">
								<span>{t('배지_업데이트필요')}</span>
								<Badge variant="outline">{t('배지_Update')}</Badge>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default BadgePage; 