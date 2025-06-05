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
		<aside
			style={{ width: `${defaults.sidebarWidth}px` }}
			className={`fixed left-4 top-0 h-screen overflow-y-auto scrollbar-hide neumorphic-container rounded-r-3xl ${
				isCollapsed ? '-translate-x-full' : 'translate-x-0'
			} transition-transform duration-300 z-40`}>
			<div className="flex flex-col h-full">
				<SideHeader />

				<div className="flex flex-1 border-t border-border/50">
					<SideLPanel topMenu={topMenu} onTopClick={handleTopClick} />

					{topData && (
						<div className="flex-1 overflow-auto">
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
						</div>
					)}
				</div>
			</div>
		</aside>
	);
}
