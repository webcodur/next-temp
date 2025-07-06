'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ListHighlightMarker from '@/components/ui/ui-data/list-highlight-marker/ListHighlightMarker';
import { useTranslations } from '@/hooks/useI18n';

export default function ListHighlightMarkerPage() {
	const t = useTranslations();
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
	const [mixedSelectedIds, setMixedSelectedIds] = useState<string[]>([]);

	// 기본 리스트 항목들
	const basicItems = useMemo(() => [
		{ id: '1', label: `${t('리스트하이라이트_아이템')} 1` },
		{ id: '2', label: `${t('리스트하이라이트_아이템')} 2` },
		{ id: '3', label: `${t('리스트하이라이트_아이템')} 3` },
		{ id: '4', label: `${t('리스트하이라이트_아이템')} 4` },
		{ id: '5', label: `${t('리스트하이라이트_아이템')} 5` },
	], [t]);

	// 비활성화 항목이 포함된 리스트
	const mixedItems = useMemo(() => [
		{ id: '1', label: `${t('리스트하이라이트_아이템')} 1` },
		{ id: '2', label: `${t('리스트하이라이트_아이템')} 2` },
		{ id: '3', label: `${t('리스트하이라이트_아이템')} 3 ${t('리스트하이라이트_비활성화')}`, disabled: true },
		{ id: '4', label: `${t('리스트하이라이트_아이템')} 4` },
		{ id: '5', label: `${t('리스트하이라이트_아이템')} 5 ${t('리스트하이라이트_비활성화')}`, disabled: true },
		{ id: '6', label: `${t('리스트하이라이트_아이템')} 6` },
		{ id: '7', label: `${t('리스트하이라이트_아이템')} 7` },
		{ id: '8', label: `${t('리스트하이라이트_아이템')} 8` },
	], [t]);

	// 선택 처리 함수
	const handleSelect = (id: string, selectedList: string[], setSelectedList: (ids: string[]) => void) => {
		const newSelectedIds = selectedList.includes(id)
			? selectedList.filter(selectedId => selectedId !== id)
			: [...selectedList, id];
		setSelectedList(newSelectedIds);
		console.log('Selected items:', newSelectedIds);
	};

	// 키보드 네비게이션 처리
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'ArrowUp') {
				event.preventDefault();
				setHighlightedIndex(prev => Math.max(0, prev - 1));
			} else if (event.key === 'ArrowDown') {
				event.preventDefault();
				setHighlightedIndex(prev => Math.min(basicItems.length - 1, prev + 1));
			} else if (event.key === 'Enter' && highlightedIndex >= 0) {
				event.preventDefault();
				const item = basicItems[highlightedIndex];
				if (item) {
					handleSelect(item.id, selectedIds, setSelectedIds);
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [highlightedIndex, selectedIds, basicItems]);

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
				<div className="border rounded-lg overflow-hidden">
					{basicItems.map((item, index) => (
						<ListHighlightMarker
							key={item.id}
							index={index}
							totalCount={basicItems.length}
							isSelected={selectedIds.includes(item.id)}
							isHighlighted={highlightedIndex === index}
							onClick={() => handleSelect(item.id, selectedIds, setSelectedIds)}
						>
							<span className="font-medium">{item.label}</span>
						</ListHighlightMarker>
					))}
				</div>
			</div>

			{/* 비활성화 항목 포함 */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold">{t('리스트하이라이트_비활성화항목')}</h2>
				<p className="text-gray-600">{t('리스트하이라이트_일부비활성화')}</p>
				<div className="border rounded-lg overflow-hidden">
					{mixedItems.map((item, index) => (
						<ListHighlightMarker
							key={item.id}
							index={index}
							totalCount={mixedItems.length}
							isSelected={mixedSelectedIds.includes(item.id)}
							isHighlighted={false}
							disabled={item.disabled}
							onClick={() => handleSelect(item.id, mixedSelectedIds, setMixedSelectedIds)}
						>
							<span className="font-medium">{item.label}</span>
						</ListHighlightMarker>
					))}
				</div>
			</div>
		</div>
	);
}
