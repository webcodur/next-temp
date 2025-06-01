import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
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
}

// #region side_Rcol: 사이드바 우측 컬럼 컴포넌트
export function SideRColumn({
	topData,
	midMenu,
	midExpanded,
	onMidClick,
}: SideRColumnProps) {
	return (
		<TooltipProvider>
			<div className="flex flex-col flex-1 bg-gradient-to-b from-background/50 to-background/30">
				{/* side_Rcol: mid/bot 메뉴 영역 */}
				<div className="flex-1 overflow-y-auto scrollbar-hide">
					<nav className="p-2 space-y-1">
						{Object.entries(topData.midItems).map(([midKey, midItem]) => (
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
											{midItem.botItems.map((botItem) => (
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
						))}
					</nav>
				</div>
			</div>
		</TooltipProvider>
	);
}
// #endregion
