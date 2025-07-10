'use client';

import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { PrimaryBar } from './unit/PrimaryBar';
import { SecondaryPanel } from './unit/SecondaryPanel';
import { defaults } from '@/data/sidebarConfig';

/**
 * 사이드바 컨테이너 컴포넌트
 * - PrimaryBar(아이콘 바)와 SecondaryPanel(상세 메뉴)을 포함.
 * - flex 레이아웃으로 두 컴포넌트를 배치.
 */
export function Sidebar() {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);

	// 패널 너비 계산
	const panelWidth = isCollapsed ? defaults.collapsedWidth : defaults.expandedWidth;
	const sidebarWidth = defaults.startColumnWidth + panelWidth;

	return (
		<aside
			style={{
				width: `${sidebarWidth}px`,
				insetInlineStart: '0px',
			}}
			className="fixed top-0 h-screen flex sidebar-container bg-surface-2 rounded-e-3xl will-change-transform z-40 transition-all duration-200 ease-in-out">
			<PrimaryBar />
			<SecondaryPanel />
		</aside>
	);
}
