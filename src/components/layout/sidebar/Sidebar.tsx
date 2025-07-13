'use client';

import { useSidebarKeyboard } from './unit/control/useSidebarKeyboard';
import { PrimaryBar } from './unit/PrimaryBar';
import { defaults } from '@/data/sidebarConfig';

/**
 * 사이드바 컨테이너 컴포넌트
 * - PrimaryBar(아이콘 바)를 포함합니다.
 */
export function Sidebar() {
	useSidebarKeyboard();

	return (
		<aside
			style={{
				width: `${defaults.startColumnWidth}px`,
			}}
			className="flex h-screen bg-surface-2">
			<PrimaryBar />
		</aside>
	);
}
