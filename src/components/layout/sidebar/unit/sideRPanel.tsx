import {
	ChevronDown,
	ChevronsDown,
	ChevronsUp,
	Focus,
	Layers,
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

/**
 * 사이드바 우측 패널 Props 타입
 */
interface SideRPanelProps {
	topData: TopItem; // 현재 선택된 Top 메뉴 데이터
	midMenu: string; // 현재 선택된 Mid 메뉴 키
	midExpanded: Set<string>; // 펼쳐진 Mid 메뉴들의 키 집합
	singleOpenMode: boolean; // 단일 열기 모드 여부
	onMidClick: (midKey: string) => void; // Mid 메뉴 클릭 핸들러
	onSingleOpenToggle: () => void; // 단일/다중 모드 토글 핸들러
	onExpandAll?: () => void; // 전체 펼치기 핸들러 (선택사항)
	onCollapseAll?: () => void; // 전체 접기 핸들러 (선택사항)
}

/**
 * 사이드바 우측 패널 컴포넌트
 * - Mid/Bot 메뉴들을 계층적으로 표시
 * - 접힌/펼친 상태 관리 및 애니메이션 처리
 * - 단일/다중 열기 모드 지원
 * - 구현되지 않은 페이지 표시 기능
 */

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
			<div className="flex flex-col flex-1 h-full overflow-auto bg-gradient-to-b from-background/50 to-background/30">
				{/* 타이틀 및 제어 버튼 영역 */}
				<div className="flex items-center justify-between px-5 py-3 border-b border-border/40">
					{/* Top 메뉴 타이틀 */}
					<h2 className="text-base font-medium text-foreground">
						{topData.label}
					</h2>

					{/* 제어 버튼 그룹 */}
					<div className="flex items-center gap-1.5">
						{/* 단일/다중 모드 토글 버튼 */}
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

						{/* 전체 펼치기 버튼 */}
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

						{/* 전체 접기 버튼 */}
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

				{/* 메뉴 영역 - Mid/Bot 메뉴 계층 구조 */}
				<div className="flex-1 overflow-y-auto">
					<nav className="p-2.5 space-y-3">
						{Object.entries(topData.midItems).map(([midKey, midItem]) => (
							<div
								key={midKey}
								className="border border-transparent rounded-lg hover:bg-gradient-to-br hover:from-card/90 hover:to-secondary/80 hover:border-border">
								<Collapsible open={midExpanded.has(midKey)}>
									{/* Mid 메뉴 헤더 (클릭 가능) */}
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
											{/* 펼침/접힘 표시 화살표 */}
											<ChevronDown
												className={`w-5 h-5 transform transition-transform duration-300 ${midExpanded.has(midKey) ? 'rotate-180' : ''}`}
											/>
										</Button>
									</CollapsibleTrigger>

									{/* Bot 메뉴 목록 (접힌/펼친 콘텐츠) */}
									<CollapsibleContent className="mt-1.5 overflow-hidden data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up">
										<div className="pl-3 ml-2 space-y-2 border-l border-border/30">
											{midItem.botItems.map((botItem) => {
												const isActive = pathname === botItem.href;

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
															} rounded-md`}>
															<Link
																href={botItem.href}
																className={`w-full flex items-center justify-between ${
																	isActive
																		? 'text-primary font-medium'
																		: 'text-foreground/90'
																}`}>
																<span className="text-sm">{botItem.label}</span>
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
			</div>
		</TooltipProvider>
	);
}
// #endregion
