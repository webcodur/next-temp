/* 
  파일명: /components/layout/sidebar/unit/SecondaryPanel/SecondaryPanel.tsx
  기능: 사이드바의 세컨더리 패널 컴포넌트
  책임: 확장된 메뉴 트리와 네비게이션 링크를 제공하는 패널 (리사이즈 가능)
*/
'use client';

import { useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { ChevronsUpDown, Focus, Layers } from 'lucide-react';

import { useTranslations } from '@/hooks/ui-hooks/useI18n';
import { menuData } from '@/data/menuData';
import { activeTopMenuAtom, endPanelWidthAtom } from '@/store/ui';
import { defaults } from '@/data/sidebarConfig';

import { Button } from '@/components/ui/ui-input/button/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/ui-effects/tooltip/Tooltip';

import type { MidMenu } from '@/components/layout/sidebar/types';

import { useSecondaryMenu } from '../useSecondaryMenu';
import { MidMenu as MidMenuComponent } from './MidMenu/MidMenu';
import { ResizeHandle } from '../ResizeHandle/ResizeHandle';

function SecondaryPanel() {
	// #region 훅
	const t = useTranslations();
	const [activeTopMenu] = useAtom(activeTopMenuAtom);
	const [endPanelWidth] = useAtom(endPanelWidthAtom);
	const [localMidItems, setLocalMidItems] = useState<{ [key: string]: MidMenu }>({});

	const {
		midExpanded,
		singleOpenMode,
		handleMidClick,
		handleSingleOpenToggle,
		handleExpandAll,
		handleCollapseAll,
		initializeExpandedState,
	} = useSecondaryMenu();
	// #endregion

	// #region 상수
	const topData = menuData[activeTopMenu];
	// #endregion

	// #region 효과
	useEffect(() => {
		if (topData) {
			setLocalMidItems(topData.midItems);
			const allMidKeys = Object.keys(topData.midItems);
			initializeExpandedState(allMidKeys);
		}
	}, [activeTopMenu, topData, initializeExpandedState]);
	// #endregion

	// #region 유틸리티
	const handleExpandCollapseClick = () => {
		const allMidKeys = Object.keys(localMidItems);
		const areAllExpanded = allMidKeys.length > 0 && allMidKeys.every((key) => midExpanded.has(key));
		
		if (areAllExpanded) {
			handleCollapseAll();
		} else {
			handleExpandAll(allMidKeys);
		}
	};
	// #endregion

	// #region 렌더링
	if (!topData) return null;

	const allMidKeys = Object.keys(localMidItems);
	const areAllExpanded = allMidKeys.length > 0 && allMidKeys.every((key) => midExpanded.has(key));

	return (
		<TooltipProvider delayDuration={100}>
			<div
				style={{ width: `${endPanelWidth}px` }}
				className="flex relative flex-col h-full border-e border-border bg-serial-1">
				
        {/* Menu Controls */}
				<div className="flex flex-shrink-0 justify-between items-center px-[20px] h-16 border-b border-serial-3">
					{/* Mode Toggle */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="w-9 h-9 !shadow-none hover:!shadow-none hover:bg-muted/80" onClick={handleSingleOpenToggle}>
								{singleOpenMode ? (
									<Focus className="w-6 h-6 text-primary" />
								) : (
									<Layers className="w-6 h-6 text-muted-foreground" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" align="start">
							{singleOpenMode ? t('메뉴_다중열기모드') : t('메뉴_단일열기모드')}
						</TooltipContent>
					</Tooltip>

					<h2 className="text-xl font-semibold text-foreground">{t(topData.key)}</h2>

					{/* Expand/Collapse All */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="w-9 h-9 !shadow-none hover:!shadow-none hover:bg-muted/80" onClick={handleExpandCollapseClick}>
								<ChevronsUpDown className="w-6 h-6 text-muted-foreground" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" align="end">
							{areAllExpanded ? t('메뉴_전체접기') : t('메뉴_전체펼치기')}
						</TooltipContent>
					</Tooltip>
				</div>

				{/* Menu List */}
				<div className="overflow-y-auto flex-1 p-[20px] space-y-[10px]">
					{Object.entries(localMidItems).map(([midKey, midItem]) => (
						<MidMenuComponent
							key={midKey}
							midItem={midItem}
							isExpanded={midExpanded.has(midKey)}
							onToggle={() => handleMidClick(midKey)}
						/>
					))}
				</div>

				{/* 리사이즈 핸들 */}
				<ResizeHandle minWidth={defaults.minResizeWidth} maxWidth={defaults.maxResizeWidth} />
			</div>
		</TooltipProvider>
	);
	// #endregion
}

export default SecondaryPanel; 