'use client';

import React from 'react';
import { ListHighlightMarker } from '@/components/ui/ui-data/list-highlight-marker/ListHighlightMarker';
import { useTranslations } from '@/hooks/useI18n';

export default function ListHighlightMarkerPage() {
	const t = useTranslations();

	// 기본 리스트 항목들
	const basicItems = [
		{ id: '1', label: `${t('리스트하이라이트_아이템')} 1` },
		{ id: '2', label: `${t('리스트하이라이트_아이템')} 2` },
		{ id: '3', label: `${t('리스트하이라이트_아이템')} 3` },
		{ id: '4', label: `${t('리스트하이라이트_아이템')} 4` },
		{ id: '5', label: `${t('리스트하이라이트_아이템')} 5` },
	];

	// 비활성화 항목이 포함된 리스트
	const mixedItems = [
		{ id: '1', label: `${t('리스트하이라이트_아이템')} 1` },
		{ id: '2', label: `${t('리스트하이라이트_아이템')} 2` },
		{ id: '3', label: `${t('리스트하이라이트_아이템')} 3 ${t('리스트하이라이트_비활성화')}`, disabled: true },
		{ id: '4', label: `${t('리스트하이라이트_아이템')} 4` },
		{ id: '5', label: `${t('리스트하이라이트_아이템')} 5 ${t('리스트하이라이트_비활성화')}`, disabled: true },
		{ id: '6', label: `${t('리스트하이라이트_아이템')} 6` },
		{ id: '7', label: `${t('리스트하이라이트_아이템')} 7` },
		{ id: '8', label: `${t('리스트하이라이트_아이템')} 8` },
	];

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div>
				<h1 className="text-3xl font-bold mb-4">{t('리스트하이라이트_제목')}</h1>
				<p className="text-gray-600 mb-8">{t('리스트하이라이트_설명')}</p>
			</div>

			{/* 기본 리스트 */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold">{t('리스트하이라이트_기본리스트')}</h2>
				<p className="text-gray-600">
					{t('리스트하이라이트_클릭선택')}
				</p>
				<p className="text-sm text-gray-500">{t('리스트하이라이트_키보드조작')}</p>
				<ListHighlightMarker
					items={basicItems}
					onSelectionChange={(selectedIds) => {
						console.log('Selected items:', selectedIds);
					}}
				/>
			</div>

			{/* 비활성화 항목 포함 */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold">{t('리스트하이라이트_비활성화항목')}</h2>
				<p className="text-gray-600">{t('리스트하이라이트_일부비활성화')}</p>
				<ListHighlightMarker
					items={mixedItems}
					onSelectionChange={(selectedIds) => {
						console.log('Mixed list selected items:', selectedIds);
					}}
				/>
			</div>
		</div>
	);
}
