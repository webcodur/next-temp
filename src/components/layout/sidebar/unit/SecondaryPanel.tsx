'use client';

import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { activeTopMenuAtom } from '@/store/sidebar';
import { menuData } from '@/data/menuData';
import { defaults } from '@/data/sidebarConfig';
import { useSecondaryMenu } from './useSecondaryMenu';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/ui-layout/collapsible/Collapsible';
import { Button } from '@/components/ui/ui-input/button/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/ui-effects/tooltip/Tooltip';
import { ChevronRight, ChevronsUpDown, Focus, Layers } from 'lucide-react';
import { useTranslations } from '@/hooks/useI18n';

export function SecondaryPanel() {
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

	const topData = menuData[activeTopMenu];

	useEffect(() => {
		if (topData) {
			const allMidKeys = Object.keys(topData.midItems);
			handleExpandAll(allMidKeys);
		}
	}, [activeTopMenu, topData, handleExpandAll]);

	if (!topData) return null;

	const allMidKeys = Object.keys(topData.midItems);
	const areAllExpanded = allMidKeys.length > 0 && allMidKeys.every((key) => midExpanded.has(key));

	const handleExpandCollapseClick = () => {
		if (areAllExpanded) {
			handleCollapseAll();
		} else {
			handleExpandAll(allMidKeys);
		}
	};

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
				<nav className="flex-1 p-2 overflow-y-auto">
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
													className={`block p-2 rounded-md text-sm transition-colors ${
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
} 