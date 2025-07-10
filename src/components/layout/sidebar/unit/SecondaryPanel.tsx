'use client';

import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { sidebarCollapsedAtom, activeTopMenuAtom } from '@/store/sidebar';
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
	const [isCollapsed] = useAtom(sidebarCollapsedAtom);
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
	if (!topData) return null;
	if (isCollapsed) return null;

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
				className="h-full flex flex-col overflow-y-auto scrollbar-hide">
				{/* Location Title */}
				<div className="h-16 px-4 flex flex-row items-center justify-start gap-3 border-b border-border/50">
					<Image src="/icons/testLogo/lg.png" alt="System Logo" width={30} height={30} />
					<div>
						<h1 className="text-lg font-bold text-foreground truncate">LG U+</h1>
						<p className="text-xs text-muted-foreground">시니어 레지던스</p>
					</div>
				</div>
				{/* Menu Controls */}
				<div className="flex justify-between items-center h-14 px-4 border-b border-border/50">
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
				<nav className="flex flex-col gap-2 p-2">
					{Object.entries(topData.midItems).map(([midKey, midItem]) => (
						<Collapsible
							key={midKey}
							open={midExpanded.has(midKey)}
							onOpenChange={() => handleMidClick(midKey)}>
							<CollapsibleTrigger className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-3 neu-raised">
								<span className="font-semibold text-foreground">{t(midItem.key)}</span>
								<ChevronRight
									className={`w-5 h-5 transition-transform duration-200 ${
										midExpanded.has(midKey) ? 'rotate-90' : ''
									}`}
								/>
							</CollapsibleTrigger>
							<CollapsibleContent className="py-1 px-2 mt-1 rounded-lg bg-surface-1">
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