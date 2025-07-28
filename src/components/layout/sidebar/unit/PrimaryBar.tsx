/* 
  파일명: /components/layout/sidebar/unit/PrimaryBar.tsx
  기능: 사이드바의 메인 아이콘 바 컴포넌트
  책임: 토글 버튼과 메뉴 아이콘들을 제공하는 세로 네비게이션 바
*/ // ------------------------------
'use client';

import { useState } from 'react';

import { useAtom } from 'jotai';

import { menuData } from '@/data/menuData';
import { defaults } from '@/data/sidebarConfig';
import { sidebarCollapsedAtom, activeTopMenuAtom } from '@/store/sidebar';

export function PrimaryBar() {
	// #region 상태
	const [isCollapsed, setIsCollapsed] = useAtom(sidebarCollapsedAtom);
	const [activeTopMenu, setActiveTopMenu] = useAtom(activeTopMenuAtom);
	const [clickedMenu, setClickedMenu] = useState<string>('');
	// #endregion

	// #region 핸들러
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

	const handlePrimaryBarClick = () => {
		setIsCollapsed(!isCollapsed);
	};

	const stopPropagation = (e: React.MouseEvent) => {
		e.stopPropagation();
	};
	// #endregion

	// #region 렌더링
	const topKeys = Object.keys(menuData);

	return (
		<div
			style={{ minWidth: `${defaults.startColumnWidth}px` }}
			className="flex flex-col items-center h-full cursor-pointer border-e border-border/20 shrink-0 sidebar-container bg-serial-3"
			onClick={handlePrimaryBarClick}>

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
							onClick={(e) => {
								stopPropagation(e);
								handleMenuClick(topKey);
							}}
							className={`w-full h-12 rounded-xl flex items-center justify-center px-2 transition-all duration-200 group cursor-pointer ${
								isActive ? 'neu-inset' : 'neu-raised'
							} ${
								isClicked ? 'animate-click-feedback' : ''}`}>
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
	// #endregion
} 