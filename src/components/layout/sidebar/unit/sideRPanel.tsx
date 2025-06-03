import { ChevronDown, ChevronUp } from 'lucide-react';
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

interface SideRPanelProps {
	topData: TopItem;
	midMenu: string;
	midExpanded: Set<string>;
	singleOpenMode: boolean;
	onMidClick: (midKey: string) => void;
	onSingleOpenToggle: () => void;
	onExpandAll?: () => void;
	onCollapseAll?: () => void;
}

// #region side_Rpanel: 사이드바 우측 패널 컴포넌트
export function SideRPanel({
	topData,
	midMenu,
	midExpanded,
	singleOpenMode,
	onMidClick,
	onSingleOpenToggle,
	onExpandAll,
	onCollapseAll,
}: SideRPanelProps) {
	return (
		<TooltipProvider>
			<div className="flex flex-col flex-1 bg-gradient-to-b from-background/50 to-background/30">
				{/* 선택된 메뉴 타이틀 영역 */}
				<div className="px-3 py-2 border-b border-border/40">
					<div className="flex items-center justify-center gap-2">
						<topData.icon className="w-5 h-5 text-primary" />
						<h2 className="text-lg font-semibold text-foreground">
							{topData.label}
						</h2>
					</div>
				</div>

				{/* 전체 접힘/펼침 버튼 영역 */}
				<div className="flex items-stretch gap-1 p-1 border-b border-border/60">
					{/* 하나만 열기 토글 체크박스 영역 */}
					<div className="flex-1 border-2 border-border/60 rounded-md bg-muted/20 flex items-center">
						<Tooltip>
							<TooltipTrigger asChild>
								<div
									onClick={onSingleOpenToggle}
									className={`neumorphic-toggle-checkbox w-full px-2 py-1.5 ${
										singleOpenMode ? 'active' : ''
									}`}
									role="switch"
									aria-checked={singleOpenMode}
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											onSingleOpenToggle();
										}
									}}>
									<span className="checkbox-text">하나만 열기</span>
									<div className="checkbox-container">
										<div className="checkbox-indicator"></div>
									</div>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>{singleOpenMode ? '하나만 열기 ON' : '하나만 열기 OFF'}</p>
							</TooltipContent>
						</Tooltip>
					</div>

					{/* 전체 닫기/열기 버튼 영역 */}
					<div className="flex-1 border-2 border-border/60 rounded-md bg-muted/20">
						<div className="flex flex-col">
							{/* 전체 닫기 버튼 */}
							<Button
								variant="ghost"
								onClick={onCollapseAll}
								className="h-5 px-2 py-0.5 text-xs transition-colors border-b rounded-b-none hover:bg-muted/60 border-border/30"
								title="전체 접기">
								<ChevronUp className="w-3 h-3 mr-0.5" />
								<span className="font-medium">전체 닫기</span>
							</Button>
							{/* 전체 열기 버튼 */}
							<Button
								variant="ghost"
								onClick={onExpandAll}
								className="h-5 px-2 py-0.5 text-xs transition-colors rounded-t-none hover:bg-muted/60"
								title="전체 펼치기">
								<ChevronDown className="w-3 h-3 mr-0.5" />
								<span className="font-medium">전체 열기</span>
							</Button>
						</div>
					</div>
				</div>

				{/* side_Rpanel: mid/bot 메뉴 영역 */}
				<div className="flex-1 overflow-y-auto scrollbar-hide">
					<nav className="p-1.5 space-y-2">
						{Object.entries(topData.midItems).map(([midKey, midItem]) => (
							<div
								key={midKey}
								className="overflow-hidden border border-transparent rounded-lg hover:bg-gradient-to-br hover:from-card/90 hover:to-secondary/80 hover:border-border group transition-none">
								<Collapsible
									open={midExpanded.has(midKey)}
									className="overflow-hidden">
									{/* side_Rpanel: mid 메뉴 버튼 */}
									<CollapsibleTrigger asChild>
										<Button
											variant="ghost"
											onClick={() => onMidClick(midKey)}
											className={`w-full justify-between h-auto p-2 rounded-none transition-none ${
												midMenu === midKey
													? 'bg-accent/80 text-foreground shadow-sm ring-1 ring-border/50'
													: 'text-foreground'
											}`}>
											<div className="flex items-center gap-2">
												{midItem.icon && (
													<midItem.icon className="w-4 h-4 text-primary" />
												)}
												<span className="text-base font-medium">
													{midItem.label}
												</span>
											</div>
											<ChevronDown
												className={`w-4 h-4 ${
													midExpanded.has(midKey) ? 'rotate-180' : ''
												}`}
											/>
										</Button>
									</CollapsibleTrigger>

									{/* side_Rpanel: bot 메뉴 항목들 */}
									<CollapsibleContent className="mt-0.5">
										<div className="pl-2 ml-2 space-y-0.5 border-l-2 border-border/30">
											{midItem.botItems.map((botItem) => (
												<Tooltip key={botItem.href}>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															asChild
															className="justify-start w-full h-auto p-1.5 text-sm rounded-md border border-transparent hover:border-border group-hover:text-primary transition-none">
															<Link
																href={botItem.href}
																className="flex items-center gap-2 text-foreground hover:text-foreground group-hover:text-primary transition-none">
																{botItem.icon && (
																	<botItem.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
																)}
																<span className="text-sm font-normal">
																	{botItem.label}
																</span>
															</Link>
														</Button>
													</TooltipTrigger>
													<TooltipContent side="right">
														<p>{botItem.label}</p>
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
