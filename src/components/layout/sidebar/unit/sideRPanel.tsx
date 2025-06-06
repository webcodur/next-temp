import {
	ChevronDown,
	ChevronsDown,
	ChevronsUp,
	Focus,
	Layers,
	ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { TopItem } from '@/components/layout/sidebar/types';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip/tooltip';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { isImplementedPage } from '@/data/implementedPages';

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
	const pathname = usePathname();

	return (
		<TooltipProvider>
			<div className="flex flex-col flex-1 h-full bg-gradient-to-b from-background/50 to-background/30">
				{/* 타이틀 영역 */}
				<div className="flex items-center justify-between px-5 py-3 border-b border-border/40">
					<h2 className="text-base font-medium text-foreground">
						{topData.label}
					</h2>

					<div className="flex items-center gap-1.5">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={onSingleOpenToggle}
									className="rounded-md w-7 h-7 hover:bg-muted/40">
									{singleOpenMode ? (
										<Focus className="w-5 h-5 text-primary" />
									) : (
										<Layers className="w-5 h-5 text-muted-foreground" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>
									{singleOpenMode
										? '단일 패널 열기 모드'
										: '다중 패널 열기 모드'}
								</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={onExpandAll}
									className="rounded-md w-7 h-7 hover:bg-muted/40">
									<ChevronsDown className="w-5 h-5 text-muted-foreground" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>전체 메뉴 펼치기</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={onCollapseAll}
									className="rounded-md w-7 h-7 hover:bg-muted/40">
									<ChevronsUp className="w-5 h-5 text-muted-foreground" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>전체 메뉴 접기</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>

				{/* 메뉴 영역 */}
				<div className="flex-1 overflow-y-auto">
					<nav className="p-2.5 space-y-3">
						{Object.entries(topData.midItems).map(([midKey, midItem]) => (
							<div
								key={midKey}
								className="border border-transparent rounded-lg hover:bg-gradient-to-br hover:from-card/90 hover:to-secondary/80 hover:border-border">
								<Collapsible open={midExpanded.has(midKey)}>
									<CollapsibleTrigger asChild>
										<Button
											variant="ghost"
											onClick={() => onMidClick(midKey)}
											className={`w-full justify-between h-auto py-2.5 px-3.5 rounded-none ${
												midMenu === midKey
													? 'bg-accent/80 text-foreground shadow-sm ring-1 ring-border/50'
													: 'text-foreground'
											}`}>
											<span className="text-base font-medium">
												{midItem.label}
											</span>
											<ChevronDown
												className={`w-5 h-5 transform transition-transform duration-300 ${midExpanded.has(midKey) ? 'rotate-180' : ''}`}
											/>
										</Button>
									</CollapsibleTrigger>

									<CollapsibleContent className="mt-1.5 overflow-hidden data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up">
										<div className="pl-3 ml-2 space-y-2 border-l border-border/30">
											{midItem.botItems.map((botItem) => {
												const isActive = pathname === botItem.href;
												const implemented = isImplementedPage(botItem.href);

												return (
													<div key={botItem.href}>
														<Button
															variant="ghost"
															size="sm"
															asChild
															className={`w-full justify-between h-auto px-4 py-1.5 text-sm border ${
																isActive
																	? 'border-primary/60 shadow-sm'
																	: 'border-transparent hover:border-border'
															} rounded-md ${
																!implemented ? 'opacity-75' : ''
															}`}>
															<Link
																href={botItem.href}
																className={`w-full flex items-center justify-between ${
																	isActive
																		? 'text-primary font-medium'
																		: 'text-foreground/90'
																}`}>
																<span className="text-sm">{botItem.label}</span>
																{!implemented && (
																	<ExternalLink className="w-3 h-3 opacity-50" />
																)}
															</Link>
														</Button>
													</div>
												);
											})}
										</div>
									</CollapsibleContent>
								</Collapsible>
							</div>
						))}
					</nav>
				</div>

				{/* 하단 범례 */}
				<div className="p-3 text-xs text-muted-foreground bg-muted/20 border-t border-border/60">
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 bg-primary rounded-full"></div>
							<span>구현된 페이지</span>
						</div>
						<div className="flex items-center gap-2">
							<ExternalLink className="w-3 h-3 opacity-50" />
							<span>템플릿 페이지</span>
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
// #endregion
