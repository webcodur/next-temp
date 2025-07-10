'use client';

import { useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import { singleOpenModeAtom } from '@/store/sidebar';

export function useSecondaryMenu() {
	const [midExpanded, setMidExpanded] = useState(new Set<string>());
	const [singleOpenMode, setSingleOpenMode] = useAtom(singleOpenModeAtom);

	const handleMidClick = useCallback(
		(midKey: string) => {
			if (singleOpenMode) {
				// 단일 열기 모드 로직
				setMidExpanded((prev) => {
					// 이미 열려있는 항목을 클릭하면 닫는다
					if (prev.has(midKey)) {
						return new Set<string>();
					}
					// 다른 항목을 클릭하면 그것만 연다
					return new Set([midKey]);
				});
			} else {
				// 다중 열기 모드 로직
				setMidExpanded((prev) => {
					const newExpanded = new Set(prev);
					if (newExpanded.has(midKey)) {
						newExpanded.delete(midKey);
					} else {
						newExpanded.add(midKey);
					}
					return newExpanded;
				});
			}
		},
		[singleOpenMode]
	);

	const handleSingleOpenToggle = () => setSingleOpenMode((prev) => !prev);
	const handleExpandAll = (allKeys: string[]) =>
		setMidExpanded(new Set(allKeys));
	const handleCollapseAll = () => setMidExpanded(new Set());

	return {
		midExpanded,
		singleOpenMode,
		handleMidClick,
		handleSingleOpenToggle,
		handleExpandAll,
		handleCollapseAll,
	};
}
