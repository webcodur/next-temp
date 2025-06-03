import {
	ChevronDown,
	ChevronsDown,
	ChevronsUp,
	Layers,
	SplitSquareVertical,
} from 'lucide-react';
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
				{/* 선택된 메뉴 타이틀 영역 - 한 줄로 정렬 */}
				<div className="flex items-center justify-between px-5 py-3 border-b border-border/40">
					{/* 타이틀 */}
					<h2 className="text-base font-medium tracking-tight text-foreground">
						{topData.label}
					</h2>

					{/* 컨트롤 버튼 영역 */}
					<div className="flex items-center gap-1.5">
						{/* 단일/다중 열기 토글 */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={onSingleOpenToggle}
									className="w-7 h-7 rounded-md hover:bg-muted/40">
									{singleOpenMode ? (
										<SplitSquareVertical className="w-5 h-5 text-primary" />
									) : (
										<Layers className="w-5 h-5 text-muted-foreground" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>
									{singleOpenMode
										? '단일 메뉴만 열기 모드'
										: '여러 메뉴 동시 열기 모드'}
								</p>
							</TooltipContent>
						</Tooltip>

						{/* 전체 펼치기 */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={onExpandAll}
									className="w-7 h-7 rounded-md hover:bg-muted/40">
									<ChevronsDown className="w-5 h-5 text-muted-foreground" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>전체 메뉴 펼치기</p>
							</TooltipContent>
						</Tooltip>

						{/* 전체 접기 */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={onCollapseAll}
									className="w-7 h-7 rounded-md hover:bg-muted/40">
									<ChevronsUp className="w-5 h-5 text-muted-foreground" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>전체 메뉴 접기</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>

				{/* side_Rpanel: mid/bot 메뉴 영역 */}
				<div className="flex-1 overflow-y-auto scrollbar-hide">
					<nav className="p-2.5 space-y-3">
						{Object.entries(topData.midItems).map(([midKey, midItem]) => (
							<div
								key={midKey}
								className="overflow-hidden transition-none border border-transparent rounded-lg hover:bg-gradient-to-br hover:from-card/90 hover:to-secondary/80 hover:border-border group">
								<Collapsible
									open={midExpanded.has(midKey)}
									className="overflow-hidden">
									{/* side_Rpanel: mid 메뉴 버튼 */}
									<CollapsibleTrigger asChild>
										<Button
											variant="ghost"
											onClick={() => onMidClick(midKey)}
											className={`w-full justify-between h-auto py-2.5 px-3.5 rounded-none transition-none ${
												midMenu === midKey
													? 'bg-accent/80 text-foreground shadow-sm ring-1 ring-border/50'
													: 'text-foreground'
											}`}>
											<span className="text-base font-medium">
												{midItem.label}
											</span>
											<ChevronDown
												className={`w-5 h-5 ${
													midExpanded.has(midKey) ? 'rotate-180' : ''
												}`}
											/>
										</Button>
									</CollapsibleTrigger>

									{/* side_Rpanel: bot 메뉴 항목들 */}
									<CollapsibleContent className="mt-1.5">
										<div className="pl-3 ml-2 space-y-2 border-l border-border/30">
											{midItem.botItems.map((botItem) => (
												<Tooltip key={botItem.href}>
													<TooltipTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															asChild
															className="justify-start w-full h-auto px-4 py-1.5 text-sm transition-none border border-transparent rounded-md hover:border-border">
															<Link
																href={botItem.href}
																className="w-full text-primary">
																<span className="text-sm font-medium">
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
