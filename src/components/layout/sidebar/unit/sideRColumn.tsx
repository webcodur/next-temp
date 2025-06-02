import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { TopItem } from '@/components/layout/sidebar/types';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface SideRColumnProps {
	topData: TopItem;
	midMenu: string;
	midExpanded: Set<string>;
	onMidClick: (midKey: string) => void;
	onExpandAll?: () => void;
	onCollapseAll?: () => void;
}

// #region side_Rcol: 사이드바 우측 컬럼 컴포넌트
export function SideRColumn({
	topData,
	midMenu,
	midExpanded,
	onMidClick,
	onExpandAll,
	onCollapseAll,
}: SideRColumnProps) {
	const [menuSearchQuery, setMenuSearchQuery] = useState('');

	const handleMenuSearchChange = (value: string) => {
		setMenuSearchQuery(value);
	};

	const handleMenuSearchClear = () => {
		setMenuSearchQuery('');
	};

	// 메뉴 필터링 로직
	const filteredTopData =
		menuSearchQuery.trim() === ''
			? topData
			: {
					...topData,
					midItems: Object.fromEntries(
						Object.entries(topData.midItems).filter(
							([, midItem]) =>
								midItem.label
									.toLowerCase()
									.includes(menuSearchQuery.toLowerCase()) ||
								midItem.botItems.some((botItem) =>
									botItem.label
										.toLowerCase()
										.includes(menuSearchQuery.toLowerCase())
								)
						)
					),
				};

	return (
		<TooltipProvider>
			<div className="flex flex-col flex-1 bg-gradient-to-b from-background/50 to-background/30">
				{/* 검색창 + 전체 접힘/펼침 버튼 영역 */}
				<div className="flex items-center gap-2 p-1.5 border-b border-gray-300/60">
					{/* 메뉴 검색창 */}
					<div
						className="
						flex-1 flex items-center gap-1 p-1 rounded-lg
						bg-gradient-to-br from-white/80 to-gray-200/70
						shadow-[3px_3px_6px_rgba(0,0,0,0.15),_-3px_-3px_6px_rgba(255,255,255,0.9)]
						border border-gray-400/40
						transition-all duration-200 
						hover:shadow-[2px_2px_4px_rgba(0,0,0,0.18),_-2px_-2px_4px_rgba(255,255,255,1)]
						focus-within:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.12),_inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
						focus-within:border-gray-500/50
					">
						<div className="flex-1 relative">
							<input
								type="text"
								placeholder="메뉴 검색"
								value={menuSearchQuery}
								onChange={(e) => handleMenuSearchChange(e.target.value)}
								className="
									w-full h-6 px-2 pr-6 text-xs rounded-md
									bg-gradient-to-br from-white/60 to-gray-100/40
									shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08)]
									border border-gray-400/30
									outline-none 
									text-gray-800
									placeholder:text-gray-500
									transition-all duration-200
									focus:shadow-[inset_3px_3px_4px_rgba(0,0,0,0.12)]
									focus:border-gray-500/40
								"
							/>
							{menuSearchQuery && (
								<Button
									variant="ghost"
									size="sm"
									onClick={handleMenuSearchClear}
									className="
										absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 p-0 rounded-md
										bg-gradient-to-br from-white/70 to-gray-200/50
										shadow-[1px_1px_2px_rgba(0,0,0,0.12),_-1px_-1px_2px_rgba(255,255,255,0.8)]
										hover:shadow-[1px_1px_2px_rgba(0,0,0,0.15),_-1px_-1px_2px_rgba(255,255,255,1)]
										active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]
										border border-gray-400/30
										transition-all duration-150
									">
									<X className="w-2.5 h-2.5 text-gray-600" />
								</Button>
							)}
						</div>
						<Search className="w-3 h-3 text-gray-500" />
					</div>

					{/* 전체 접힘/펼침 버튼들 */}
					<Button
						variant="ghost"
						size="sm"
						onClick={onCollapseAll}
						className="h-6 w-6 p-0 hover:bg-muted/60 transition-colors"
						title="전체 접기">
						<ChevronUp className="w-3 h-3" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={onExpandAll}
						className="h-6 w-6 p-0 hover:bg-muted/60 transition-colors"
						title="전체 펼치기">
						<ChevronDown className="w-3 h-3" />
					</Button>
				</div>

				{/* side_Rcol: mid/bot 메뉴 영역 */}
				<div className="flex-1 overflow-y-auto scrollbar-hide">
					<nav className="p-1.5 space-y-1">
						{Object.entries(filteredTopData.midItems).map(
							([midKey, midItem]) => (
								<div
									key={midKey}
									className="rounded-lg border border-transparent overflow-hidden hover:bg-gradient-to-br hover:from-white/90 hover:to-gray-200/80 hover:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.95)] hover:border-white/80 group">
									<Collapsible
										open={midExpanded.has(midKey)}
										className="overflow-hidden">
										{/* side_Rcol: mid 메뉴 버튼 */}
										<CollapsibleTrigger asChild>
											<Button
												variant="ghost"
												onClick={() => onMidClick(midKey)}
												className={`w-full justify-between h-auto p-2 rounded-none ${
													midMenu === midKey
														? 'bg-accent/80 text-black shadow-sm ring-1 ring-border/50'
														: 'text-black'
												}`}>
												<span className="text-base font-medium">
													{midItem.label}
												</span>
												<ChevronDown
													className={`w-4 h-4 transition-all duration-200 ${
														midExpanded.has(midKey) ? 'rotate-180' : ''
													}`}
												/>
											</Button>
										</CollapsibleTrigger>

										{/* side_Rcol: bot 메뉴 항목들 */}
										<CollapsibleContent className="mt-0.5">
											<div className="pl-2 ml-2 space-y-0.5 border-l-2 border-border/30">
												{midItem.botItems
													.filter(
														(botItem) =>
															menuSearchQuery.trim() === '' ||
															botItem.label
																.toLowerCase()
																.includes(menuSearchQuery.toLowerCase())
													)
													.map((botItem) => (
														<Tooltip key={botItem.href}>
															<TooltipTrigger asChild>
																<Button
																	variant="ghost"
																	size="sm"
																	asChild
																	className="justify-start w-full h-auto p-1.5 text-sm rounded-md border border-transparent hover:bg-gradient-to-br hover:from-white/90 hover:to-gray-200/90 hover:shadow-[5px_5px_10px_rgba(0,0,0,0.2),-5px_-5px_10px_rgba(255,255,255,0.95)] hover:border-white/80 group-hover:text-primary">
																	<Link
																		href={botItem.href}
																		className="block text-black hover:text-black group-hover:text-primary">
																		<span className="text-sm font-normal">
																			{botItem.label}
																		</span>
																	</Link>
																</Button>
															</TooltipTrigger>
															<TooltipContent side="right">
																<p className="text-xs">
																	{botItem.description || '설명이 없습니다'}
																</p>
															</TooltipContent>
														</Tooltip>
													))}
											</div>
										</CollapsibleContent>
									</Collapsible>
								</div>
							)
						)}
					</nav>
				</div>
			</div>
		</TooltipProvider>
	);
}
// #endregion
