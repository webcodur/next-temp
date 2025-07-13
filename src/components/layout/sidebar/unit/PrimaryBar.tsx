'use client';

import { useAtom } from 'jotai';
import { Menu } from 'lucide-react';
import { menuData } from '@/data/menuData';
import { defaults } from '@/data/sidebarConfig';
import { sidebarCollapsedAtom, activeTopMenuAtom } from '@/store/sidebar';
import { useState } from 'react';

export function PrimaryBar() {
	const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);
	const [activeTopMenu, setActiveTopMenu] = useAtom(activeTopMenuAtom);
	const [clickedMenu, setClickedMenu] = useState<string>('');

	const handleToggle = () => setIsCollapsed(!isCollapsed);
	
	const handleMenuClick = (topKey: string) => {
		// 마이크로 인터렉션 트리거
		setClickedMenu(topKey);
		setTimeout(() => setClickedMenu(''), 200);

		// 현재 active인 메뉴를 다시 클릭한 경우
		if (activeTopMenu === topKey && !isCollapsed) {
			// SecondaryPanel 닫기
			setIsCollapsed(true);
		} else {
			// 다른 메뉴를 클릭하거나 collapsed 상태인 경우
			if (isCollapsed) {
				setIsCollapsed(false);
			}
			setActiveTopMenu(topKey);
		}
	};

	const topKeys = Object.keys(menuData);

	return (
		<div
			style={{ minWidth: `${defaults.startColumnWidth}px` }}
			className="flex flex-col items-center h-full border-e border-border/20 shrink-0 sidebar-container">
			
      {/* 여닫기 버튼 */}
			<div className="flex justify-center items-center h-16">
				<button
					type="button"
					onClick={handleToggle}
					className="flex justify-center items-center w-12 h-12 rounded-xl transition-all duration-200 neu-raised hover:neu-inset cursor-pointer">
					<Menu className="w-6 h-6 text-foreground" />
				</button>
			</div>

			{/* 메뉴 아이콘 리스트 */}
			<div className="flex flex-col items-center px-3 py-3 space-y-3 w-full">
				{topKeys.map((topKey) => {
					const topItem = menuData[topKey];
					const isActive = activeTopMenu === topKey;
					const isClicked = clickedMenu === topKey;
					
					return (
						<button
							key={topKey}
							type="button"
							onClick={() => handleMenuClick(topKey)}
							className={`w-full h-12 rounded-xl flex items-center justify-center px-2 transition-all duration-200 group cursor-pointer ${
								isActive ? 'neu-inset' : 'neu-raised'
							} ${
								isClicked ? 'animate-click-feedback' : ''
							}`}>
							<topItem.icon
								className={`w-6 h-6 transition-all duration-200 ${
									isActive ? 'neu-icon-active' : 'neu-icon-inactive'
								} ${
									isClicked && isActive ? 'animate-icon-pulse' : ''
								}`}
							/>
						</button>
					);
				})}
			</div>
		</div>
	);
} 