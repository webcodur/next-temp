'use client';

import { Menu, ChevronRight } from 'lucide-react';
import { useAtom } from 'jotai';
import { sidebarCollapsedAtom } from '@/store/sidebar';
import { useSidebarMenu } from '@/components/layout/sidebar/hooks';
import { menuData } from '@/data/menuData';
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
					fixed top-0 left-0 z-50 
					w-12 h-12
					transition-all duration-300 ease-in-out
					flex items-center justify-center
					bg-gradient-to-br from-white/95 to-gray-100/85
					shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.95),inset_1px_1px_2px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
					text-muted-foreground border-2 border-gray-400/60
					hover:text-foreground 
					hover:shadow-[3px_3px_6px_rgba(0,0,0,0.18),-1px_-1px_2px_rgba(255,255,255,1),inset_1px_1px_2px_rgba(255,255,255,0.95),inset_-1px_-1px_2px_rgba(0,0,0,0.08)] 
					hover:border-gray-500/70
					active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]
					active:border-gray-600/80
					overflow-hidden
					${
						isCollapsed
							? 'clip-path-[polygon(0_0,100%_0,0_100%)]'
							: 'clip-path-[polygon(0_0,100%_0,0_100%)]'
					}
				`}
				style={{
					clipPath: 'polygon(0 0, 100% 0, 0 100%)',
					backgroundImage: 'url(/images/metallic-pattern.png)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					backgroundBlendMode: 'overlay',
				}}>
				{/* 메탈릭 패턴 오버레이 */}
				<div
					className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-gray-200/40"
					style={{
						clipPath: 'polygon(0 0, 100% 0, 0 100%)',
					}}
				/>

				{/* 구분선 효과 */}
				<div
					className="absolute inset-0 border-b-2 border-r-2 border-gray-500/70"
					style={{
						clipPath: 'polygon(0 0, 100% 0, 0 100%)',
						borderImageSource:
							'linear-gradient(135deg, rgba(156,163,175,0.8), rgba(75,85,99,0.9))',
						borderImageSlice: 1,
					}}
				/>

				<div className="absolute z-10 top-1.5 left-1.5">
					{isCollapsed ? (
						<Menu
							className="w-4 h-4 text-white stroke-2"
							style={{
								textShadow: `
									-2px -2px 0 #000,
									2px -2px 0 #000,
									-2px 2px 0 #000,
									2px 2px 0 #000,
									0 -2px 0 #000,
									0 2px 0 #000,
									-2px 0 0 #000,
									2px 0 0 #000,
									-1px -1px 0 #000,
									1px -1px 0 #000,
									-1px 1px 0 #000,
									1px 1px 0 #000,
									0 -1px 0 #000,
									0 1px 0 #000,
									-1px 0 0 #000,
									1px 0 0 #000
								`,
								filter:
									'drop-shadow(0 0 2px rgba(0,0,0,1)) drop-shadow(1px 1px 3px rgba(0,0,0,0.9))',
							}}
						/>
					) : (
						<ChevronRight
							className="w-4 h-4 text-white stroke-2"
							style={{
								textShadow: `
									-2px -2px 0 #000,
									2px -2px 0 #000,
									-2px 2px 0 #000,
									2px 2px 0 #000,
									0 -2px 0 #000,
									0 2px 0 #000,
									-2px 0 0 #000,
									2px 0 0 #000,
									-1px -1px 0 #000,
									1px -1px 0 #000,
									-1px 1px 0 #000,
									1px 1px 0 #000,
									0 -1px 0 #000,
									0 1px 0 #000,
									-1px 0 0 #000,
									1px 0 0 #000
								`,
								filter:
									'drop-shadow(0 0 2px rgba(0,0,0,1)) drop-shadow(1px 1px 3px rgba(0,0,0,0.9))',
							}}
						/>
					)}
				</div>
			</button>
			{/* #endregion */}

			<aside
				className={`
					fixed left-0 top-0 w-[350px] h-screen 
					bg-gradient-to-br from-gray-50/95 via-white/98 to-gray-100/90
					flex flex-col transition-transform duration-300 z-40 
					shadow-[8px_8px_16px_rgba(0,0,0,0.12),_-8px_-8px_16px_rgba(255,255,255,0.9),_4px_4px_8px_rgba(0,0,0,0.08)_inset]
					border border-white/50 rounded-r-3xl
					${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
				`}>
				{/* side_header */}
				<SideHeader />

				{/* 메인 영역: side_Lcol + side_Rcol */}
				<div className="flex flex-1 overflow-hidden border-t border-gray-300/50">
					{/* side_Lcol */}
					<SideLColumn topMenu={topMenu} onTopClick={handleTopClick} />

					{/* side_Rcol */}
					{topData && (
						<SideRColumn
							topData={topData}
							midMenu={midMenu}
							midExpanded={midExpanded}
							onMidClick={handleMidClick}
							onExpandAll={handleExpandAll}
							onCollapseAll={handleCollapseAll}
						/>
					)}
				</div>
			</aside>
		</>
	);
}
