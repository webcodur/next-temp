'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { activeTopMenuAtom, singleOpenModeAtom } from '@/store/sidebar';

// #region 로컬스토리지 키 상수
const SIDEBAR_EXPANDED_KEY = 'sidebar_mid_expanded';
// #endregion

// #region 유틸리티 함수
/**
 * localStorage에서 펼침 상태 복원
 */
const loadExpandedState = (topMenuKey: string): Set<string> => {
	try {
		const stored = localStorage.getItem(
			`${SIDEBAR_EXPANDED_KEY}_${topMenuKey}`
		);
		if (stored) {
			const parsed = JSON.parse(stored);
			return new Set(Array.isArray(parsed) ? parsed : []);
		}
	} catch (error) {
		console.warn('메뉴 펼침 상태 로딩 실패:', error);
	}
	return new Set<string>();
};

/**
 * localStorage에 펼침 상태 저장
 */
const saveExpandedState = (topMenuKey: string, expanded: Set<string>) => {
	try {
		localStorage.setItem(
			`${SIDEBAR_EXPANDED_KEY}_${topMenuKey}`,
			JSON.stringify(Array.from(expanded))
		);
	} catch (error) {
		console.warn('메뉴 펼침 상태 저장 실패:', error);
	}
};
// #endregion

export function useSecondaryMenu() {
	const [activeTopMenu] = useAtom(activeTopMenuAtom);
	const [singleOpenMode, setSingleOpenMode] = useAtom(singleOpenModeAtom);
	const [midExpanded, setMidExpanded] = useState<Set<string>>(new Set());

	// #region 초기 상태 복원
	useEffect(() => {
		if (activeTopMenu) {
			const savedState = loadExpandedState(activeTopMenu);
			setMidExpanded(savedState);
		}
	}, [activeTopMenu]);

	// #region 상태 변경 시 저장
	useEffect(() => {
		if (activeTopMenu) {
			saveExpandedState(activeTopMenu, midExpanded);
		}
	}, [activeTopMenu, midExpanded]);
	// #endregion

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

	const handleSingleOpenToggle = useCallback(
		() => setSingleOpenMode(!singleOpenMode),
		[setSingleOpenMode, singleOpenMode]
	);

	const handleExpandAll = useCallback(
		(allKeys: string[]) => setMidExpanded(new Set(allKeys)),
		[]
	);

	const handleCollapseAll = useCallback(() => setMidExpanded(new Set()), []);

	// 새로운 메뉴에 대해 기본 펼침 상태 설정 (저장된 상태가 없을 때만)
	const initializeExpandedState = useCallback((allKeys: string[]) => {
		setMidExpanded((prev) => {
			// 저장된 상태가 있음: 유지
			if (prev.size > 0) {
				return prev;
			}
			// 저장된 상태가 없음: 모든 항목 펼치기
			return new Set(allKeys);
		});
	}, []);

	return {
		midExpanded,
		singleOpenMode,
		handleMidClick,
		handleSingleOpenToggle,
		handleExpandAll,
		handleCollapseAll,
		initializeExpandedState,
	};
}
