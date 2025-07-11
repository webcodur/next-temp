'use client';

import { useAtom } from 'jotai';
import { PanelLeft } from 'lucide-react';
import { menuData } from '@/data/menuData';
import { defaults } from '@/data/sidebarConfig';
import { sidebarCollapsedAtom, activeTopMenuAtom } from '@/store/sidebar';

export function PrimaryBar() {
	const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);
	const [activeTopMenu, setActiveTopMenu] = useAtom(activeTopMenuAtom);

	const handleToggle = () => setIsCollapsed(!isCollapsed);
	const handleMenuClick = (topKey: string) => {
		if (isCollapsed) {
			setIsCollapsed(false);
		}
		setActiveTopMenu(topKey);
	};

	const topKeys = Object.keys(menuData);

	return (
		<div
			style={{ minWidth: `${defaults.startColumnWidth}px` }}
			className="h-full border-e border-border/20 shrink-0 flex flex-col items-center">
			{/* 여닫기 버튼 */}
			<div className="h-16 flex items-center justify-center">
				<button
					type="button"
					onClick={handleToggle}
					className="w-12 h-12 rounded-xl flex items-center justify-center neu-raised hover:neu-inset transition-all duration-200">
					<PanelLeft className="w-6 h-6 text-foreground" />
				</button>
			</div>

			{/* 메뉴 아이콘 리스트 */}
			<div className="flex flex-col items-center px-3 py-3 space-y-3 w-full">
				{topKeys.map((topKey) => {
					const topItem = menuData[topKey];
					const isActive = activeTopMenu === topKey;
					return (
						<button
							key={topKey}
							type="button"
							onClick={() => handleMenuClick(topKey)}
							className={`w-full h-12 rounded-xl flex items-center justify-center px-2 transition-all duration-200 group ${isActive ? 'neu-inset' : 'neu-raised'}`}>
							<topItem.icon
								className={`w-6 h-6 transition-all duration-200 ${isActive ? 'neu-icon-active' : 'neu-icon-inactive'}`}
							/>
						</button>
					);
				})}
			</div>
		</div>
	);
} 