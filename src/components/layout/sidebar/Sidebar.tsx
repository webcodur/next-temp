'use client';

import { useAtom } from 'jotai';
import {
	sidebarCollapsedAtom,
	rPanelWidthAtom,
	isResizingAtom,
	isResizeHandleHoveredAtom,
} from '@/store/sidebar';
import { useSidebarMenu } from '@/components/layout/sidebar/hooks';
import { menuData } from '@/data/menuData';
import { SideHeader } from '@/components/layout/sidebar/unit/SideHeader';
import { SideLPanel } from '@/components/layout/sidebar/unit/SideLPanel';
import { SideRPanel } from '@/components/layout/sidebar/unit/SideRPanel';
import { defaults } from '@/data/sidebarConfig';
import { ResizeHandle } from './unit/ResizeHandle';

/**
 * 사이드바 메인 컴포넌트
 * - 좌측 고정 위치에 배치되는 네비게이션 사이드바
 * - 헤더, 좌측 패널(top 메뉴), 우측 패널(mid/bot 메뉴)로 구성
 * - 접힘/펼침 상태에 따른 애니메이션 처리
 */
export function Sidebar() {
	// 사이드바 접힘 상태 관리
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
	const [rPanelWidth] = useAtom(rPanelWidthAtom);
	const [isResizing] = useAtom(isResizingAtom);
	const [isHovered] = useAtom(isResizeHandleHoveredAtom);

	const sidebarWidth = defaults.leftColumnWidth + rPanelWidth;
	const showResizeIndicator = isResizing || isHovered;
	const transitionClass = isResizing ? 'transition-transform' : 'transition-all';

	// 사이드바 메뉴 상태 및 핸들러 관리
	const {
		topMenu,
		midMenu,
		midExpanded,
		singleOpenMode,
		handleTopClick,
		handleMidClick,
		handleSingleOpenToggle,
		handleExpandAll,
		handleCollapseAll,
	} = useSidebarMenu();

	// 현재 선택된 top 메뉴의 데이터
	const topData = menuData[topMenu];

	return (
		<aside
			style={{
				width: `${sidebarWidth}px`,
			}}
			className={`fixed left-0 top-0 h-screen overflow-y-auto scrollbar-hide sidebar-container rounded-r-3xl will-change-transform ${transitionClass} duration-200 ease-in-out ${
				isCollapsed ? '-translate-x-full' : 'translate-x-0'
			} z-40 border-r-2 ${showResizeIndicator ? 'border-blue-500' : 'border-transparent'}`}>
			{!isCollapsed && <ResizeHandle />}
			<div className="flex flex-col h-full">
				{/* 사이드바 헤더 영역 */}
				<SideHeader />

				{/* 메뉴 영역 - 좌측(top 메뉴) + 우측(mid/bot 메뉴) */}
				<div className="flex flex-1 border-t border-border/50">
					<SideLPanel topMenu={topMenu} onTopClick={handleTopClick} />
					<SideRPanel
						topKey={topMenu}
						topData={topData}
						midMenu={midMenu}
						midExpanded={midExpanded}
						singleOpenMode={singleOpenMode}
						onMidClick={handleMidClick}
						onSingleOpenToggle={handleSingleOpenToggle}
						onExpandAll={handleExpandAll}
						onCollapseAll={handleCollapseAll}
					/>
				</div>
			</div>
		</aside>
	);
}
