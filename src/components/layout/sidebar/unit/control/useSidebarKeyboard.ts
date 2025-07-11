'use client';

import { useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';

/**
 * 사이드바 키보드 단축키를 관리하는 훅
 * - Ctrl+B: 사이드바 토글
 */
export function useSidebarKeyboard() {
	const [isCollapsed, setSidebarCollapsed] = useAtom(sidebarCollapsedAtom);

	const handleKeyboardToggle = useCallback(() => {
		setSidebarCollapsed(!isCollapsed);
	}, [isCollapsed, setSidebarCollapsed]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && (event.key === 'b' || event.key === 'B')) {
				event.preventDefault();
				handleKeyboardToggle();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyboardToggle]);
}
