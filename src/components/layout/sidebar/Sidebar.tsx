'use client';

import { useAtom } from 'jotai';
import {
	sidebarCollapsedAtom,
	endPanelWidthAtom,
	isResizingAtom,
	isSideResizeControlHoveredAtom,
} from '@/store/sidebar';
import { useSidebarMenu } from '@/components/layout/sidebar/unit/header/useSidebarMenu';
import { useLocale } from '@/hooks/useI18n';
import { menuData } from '@/data/menuData';
import { SideHeader } from '@/components/layout/sidebar/unit/header/SideHeader';
import { SideStartPanel } from '@/components/layout/sidebar/unit/panel/SideStartPanel';
import { SideEndPanel } from '@/components/layout/sidebar/unit/panel/SideEndPanel';
import { defaults } from '@/data/sidebarConfig';
import { SideResizeControl } from './unit/control/SideResizeControl';

/**
 * 사이드바 메인 컴포넌트
 * - 시작 위치에 고정 배치되는 네비게이션 사이드바
 * - 헤더, 시작 패널(top 메뉴), 끝 패널(mid/bot 메뉴)로 구성
 * - 접힘/펼침 상태에 따른 RTL 지원 애니메이션 처리
 */
export function Sidebar() {
	// 사이드바 접힘 상태 관리
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
	const [endPanelWidth] = useAtom(endPanelWidthAtom);
	const [isResizing] = useAtom(isResizingAtom);
	const [isHovered] = useAtom(isSideResizeControlHoveredAtom);
	const { isRTL } = useLocale();

	const sidebarWidth = defaults.startColumnWidth + endPanelWidth;
	const showResizeIndicator = isResizing || isHovered;

	// RTL 지원 사이드바 애니메이션 처리
	const sidebarTransformStyle = {
		transform: isCollapsed 
			? `translateX(${isRTL ? '100%' : '-100%'})` 
			: 'translateX(0)',
		transition: isResizing ? 'none' : 'transform 200ms ease-in-out',
	};

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
				insetInlineStart: '0px',
				...sidebarTransformStyle,
			}}
			className={`fixed top-0 h-screen overflow-y-auto scrollbar-hide sidebar-container bg-surface-2 rounded-e-3xl will-change-transform z-40 border-e-2 ${showResizeIndicator ? 'border-brand' : 'border-transparent'}`}>
			{!isCollapsed && <SideResizeControl />}
			<div className="flex flex-col h-full">
				{/* 사이드바 헤더 영역 */}
				<SideHeader />

				{/* 메뉴 영역 - 시작(top 메뉴) + 끝(mid/bot 메뉴) */}
				<div className="flex flex-1 border-t border-border/50">
					<SideStartPanel topMenu={topMenu} onTopClick={handleTopClick} />
					<SideEndPanel
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
