'use client';

import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { useSidebarMenu } from '@/components/layout/sidebar/hooks';
import { menuData } from '@/data/menuData';
import { SideHeader } from '@/components/layout/sidebar/unit/sideHeader';
import { SideLPanel } from '@/components/layout/sidebar/unit/sideLPanel';
import { SideRPanel } from '@/components/layout/sidebar/unit/sideRPanel';
import { defaults } from '@/data/sidebarConfig';

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

	return (
		<>
			<aside
				style={{ width: `${defaults.sidebarWidth}px` }}
				className={`
					fixed left-0 top-0 h-screen 
					neumorphic-container
					flex flex-col transition-transform duration-300 z-40 
					rounded-r-3xl
					${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
				`}>
				{/* side_header */}
				<SideHeader />

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
