'use client';

import { Menu, ChevronRight } from 'lucide-react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { useSidebarMenu } from '@/components/layout/sidebar/hooks';
import { menuData } from '@/data/menuData';
import { styles } from '@/data/sidebarConfig';
import { SideHeader } from '@/components/layout/sidebar/unit/sideHeader';
import { SideLColumn } from '@/components/layout/sidebar/unit/sideLColumn';
import { SideRColumn } from '@/components/layout/sidebar/unit/sideRColumn';

export function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);
	const {
		topMenu,
		midMenu,
		midExpanded,
		handleTopClick,
		handleMidClick,
		handleExpandAll,
		handleCollapseAll,
	} = useSidebarMenu();

	const topData = menuData[topMenu];

	return (
		<>
			{/* #region Toggle Button */}
			<button
				onClick={() => setIsCollapsed(!isCollapsed)}
				className={`
					fixed top-4 left-4 z-50 
					${styles.buttonSize} rounded-2xl
					transition-all duration-300 ease-in-out
					flex items-center justify-center
					bg-gradient-to-br from-white/80 to-gray-100/80
					shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.8)]
					text-muted-foreground border border-white/50
					hover:text-foreground 
					hover:shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.9)] 
					hover:-translate-y-0.5
					active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
					active:translate-y-0
				`}>
				{isCollapsed ? (
					<Menu className="w-7 h-7 drop-shadow-sm" />
				) : (
					<ChevronRight className="w-7 h-7 drop-shadow-sm" />
				)}
			</button>
			{/* #endregion */}

			<aside
				className={`fixed left-0 top-0 w-[350px] h-screen bg-muted/90 shadow-xl shadow-black/5 border-r border-border flex flex-col transition-transform duration-300 z-40 ${
					isCollapsed ? '-translate-x-full' : 'translate-x-0'
				}`}>
				{/* side_header */}
				<SideHeader
					onExpandAll={handleExpandAll}
					onCollapseAll={handleCollapseAll}
				/>

				{/* 메인 영역: side_Lcol + side_Rcol */}
				<div className="flex flex-1 overflow-hidden">
					{/* side_Lcol */}
					<SideLColumn topMenu={topMenu} onTopClick={handleTopClick} />

					{/* side_Rcol */}
					{topData && (
						<SideRColumn
							topData={topData}
							midMenu={midMenu}
							midExpanded={midExpanded}
							onMidClick={handleMidClick}
						/>
					)}
				</div>
			</aside>
		</>
	);
}
