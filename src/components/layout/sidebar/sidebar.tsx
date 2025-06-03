'use client';

import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { useSidebarMenu } from '@/components/layout/sidebar/hooks';
import { menuData } from '@/data/menuData';
import { SideHeader } from '@/components/layout/sidebar/unit/sideHeader';
import { SideLPanel } from '@/components/layout/sidebar/unit/sideLPanel';
import { SideRPanel } from '@/components/layout/sidebar/unit/sideRPanel';

export function Sidebar() {
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
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

	const topData = menuData[topMenu];

	// 메뉴검색 결과 선택 시 해당 메뉴로 이동
	const handleMenuNavigate = (result: {
		topKey: string;
		midKey: string;
		botLabel?: string;
		href?: string;
	}) => {
		// top 메뉴 변경
		if (topMenu !== result.topKey) {
			handleTopClick(result.topKey);
		}

		// mid 메뉴 확장 확인 및 처리
		setTimeout(() => {
			if (!midExpanded.has(result.midKey)) {
				handleMidClick(result.midKey);
			}
		}, 100); // top 메뉴 변경 후 약간의 지연

		// bot 메뉴가 있고 href가 있다면 페이지 이동
		if (result.href) {
			setTimeout(() => {
				if (result.href) {
					window.location.href = result.href;
				}
			}, 200);
		}
	};

	return (
		<>
			<aside
				className={`
					fixed left-0 top-0 w-[350px] h-screen 
					neumorphic-container
					flex flex-col transition-transform duration-300 z-40 
					rounded-r-3xl
					${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
				`}>
				{/* side_header */}
				<SideHeader onMenuNavigate={handleMenuNavigate} />

				{/* 메인 영역: side_Lpanel + side_Rpanel */}
				<div className="flex flex-1 overflow-hidden border-t border-border/50">
					{/* side_Lpanel */}
					<SideLPanel topMenu={topMenu} onTopClick={handleTopClick} />

					{/* side_Rpanel */}
					{topData && (
						<SideRPanel
							topData={topData}
							midMenu={midMenu}
							midExpanded={midExpanded}
							singleOpenMode={singleOpenMode}
							onMidClick={handleMidClick}
							onSingleOpenToggle={handleSingleOpenToggle}
							onExpandAll={handleExpandAll}
							onCollapseAll={handleCollapseAll}
						/>
					)}
				</div>
			</aside>
		</>
	);
}
