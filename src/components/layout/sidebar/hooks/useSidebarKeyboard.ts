'use client';

import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import {
	sidebarCollapsedAtom,
	headerToggleVisibleAtom,
} from '@/store/sidebar';
import { animations } from '@/data/sidebarConfig';

/**
 * 사이드바 키보드 단축키를 관리하는 훅
 * - Ctrl+B: 사이드바 토글
 */
export function useSidebarKeyboard() {
	const [isMainCollapsed, setSidebarCollapsed] = useAtom(sidebarCollapsedAtom);
	const [, setHeaderToggleVisible] = useAtom(headerToggleVisibleAtom);

	// 지연 함수
	const delay = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	const handleKeyboardToggle = useCallback(async () => {
		if (isMainCollapsed) {
			// 오프닝 시퀀스: 사이드바 펼치기 → 대기 → 헤더 토글 표시
			setSidebarCollapsed(false);
			await delay(animations.sidebarDuration);
			setHeaderToggleVisible(true);
		} else {
			// 클로징 시퀀스: 헤더 토글 숨기기 → 대기 → 사이드바 접기
			setHeaderToggleVisible(false);
			await delay(animations.headerToggleDuration);
			setSidebarCollapsed(true);
		}
	}, [isMainCollapsed, setSidebarCollapsed, setHeaderToggleVisible]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Ctrl+B 조합 확인
			if (event.ctrlKey && event.key === 'b') {
				event.preventDefault();
				void handleKeyboardToggle();
			}
		};

		// 전역 키보드 이벤트 리스너 등록
		window.addEventListener('keydown', handleKeyDown);

		// 클린업 함수
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyboardToggle]);
} 