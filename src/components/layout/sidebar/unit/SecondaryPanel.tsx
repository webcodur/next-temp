/* 
  파일명: /components/layout/sidebar/unit/SecondaryPanel.tsx
  기능: 사이드바의 세컨더리 패널 컴포넌트
  책임: 확장된 메뉴 트리와 네비게이션 링크를 제공하는 패널
*/ // ------------------------------
'use client';

import { useEffect } from 'react';

import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronsUpDown, Focus, Layers } from 'lucide-react';

import { useTranslations } from '@/hooks/useI18n';
import { activeTopMenuAtom } from '@/store/sidebar';

import { Button } from '@/components/ui/ui-input/button/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/ui-effects/tooltip/Tooltip';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/ui-layout/collapsible/Collapsible';

import { menuData } from '@/data/menuData';
import { defaults } from '@/data/sidebarConfig';

import { useSecondaryMenu } from './useSecondaryMenu';

export function SecondaryPanel() {
	// #region 훅
	const t = useTranslations();
	const pathname = usePathname();
	const [activeTopMenu] = useAtom(activeTopMenuAtom);

	const {
		midExpanded,
		singleOpenMode,
		handleMidClick,
		handleSingleOpenToggle,
		handleExpandAll,
		handleCollapseAll,
	} = useSecondaryMenu();
	// #endregion

	// #region 상수
	const topData = menuData[activeTopMenu];
	// #endregion

	// #region 효과
	useEffect(() => {
		if (topData) {
			const allMidKeys = Object.keys(topData.midItems);
			handleExpandAll(allMidKeys);
		}
	}, [activeTopMenu, topData, handleExpandAll]);
	// #endregion

	// #region 유틸리티
	const handleExpandCollapseClick = () => {
		const allMidKeys = Object.keys(topData.midItems);
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

	const allMidKeys = Object.keys(topData.midItems);
	const areAllExpanded = allMidKeys.length > 0 && allMidKeys.every((key) => midExpanded.has(key));

	return (
		<TooltipProvider delayDuration={100}>
			<div
				style={{ width: `${defaults.expandedWidth}px` }}
				className="flex flex-col h-full border-e border-border/20 bg-surface-2 sidebar-container">
				{/* Menu Controls */}
				<div className="flex flex-shrink-0 justify-between items-center px-4 h-14 border-b border-border/50">
					{/* Mode Toggle */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleSingleOpenToggle}>
								{singleOpenMode ? (
									<Focus className="w-5 h-5 text-primary" />
								) : (
									<Layers className="w-5 h-5 text-muted-foreground" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" align="start">
							{singleOpenMode ? t('메뉴_다중열기모드') : t('메뉴_단일열기모드')}
						</TooltipContent>
					</Tooltip>

					<h2 className="text-lg font-semibold text-foreground">{t(topData.key)}</h2>

					{/* Expand/Collapse All */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleExpandCollapseClick}>
								<ChevronsUpDown className="w-5 h-5 text-muted-foreground" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="bottom" align="end">
							{areAllExpanded ? t('메뉴_전체접기') : t('메뉴_전체펼치기')}
						</TooltipContent>
					</Tooltip>
				</div>

				{/* Menu List */}
				<nav className="overflow-y-auto flex-1 p-2 min-h-0">
					{Object.entries(topData.midItems).map(([midKey, midItem]) => (
						<Collapsible
							key={midKey}
							open={midExpanded.has(midKey)}
							onOpenChange={() => handleMidClick(midKey)}>
							<CollapsibleTrigger className="flex justify-between items-center p-2 w-full rounded-lg hover:bg-surface-3 neu-raised">
								<span className="font-semibold text-foreground">{t(midItem.key)}</span>
								<ChevronRight
									className={`w-5 h-5 transition-transform duration-200 ${
										midExpanded.has(midKey) ? 'rotate-90' : ''
									}`}
								/>
							</CollapsibleTrigger>
							<CollapsibleContent className="px-2 py-1 mt-1 rounded-lg bg-surface-1">
								<ul className="flex flex-col gap-1">
									{midItem.botItems.map((botItem) => {
										const isActive = pathname === botItem.href;
										return (
											<li key={botItem.key}>
												<Link
													href={botItem.href}
													className={`block p-2 rounded-md text-sm ${
														isActive
															? 'text-primary-foreground bg-primary'
															: 'text-foreground hover:bg-surface-3'
													}`}>
													{t(botItem.key)}
												</Link>
											</li>
										);
									})}
								</ul>
							</CollapsibleContent>
						</Collapsible>
					))}
				</nav>
			</div>
		</TooltipProvider>
	);
	// #endregion
} 