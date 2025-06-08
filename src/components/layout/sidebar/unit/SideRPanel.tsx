import {
	ChevronDown,
	ChevronsDown,
	ChevronsUp,
	Focus,
	Layers,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type { TopItem } from '@/components/layout/sidebar/types';
import { Button } from '@/components/ui/Button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip/Tooltip';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/Collapsible';

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
	const router = useRouter();

	// botMenu 클릭 처리 - 즉시 페이지 이동 (상태는 useEffect에서 자동 처리)
	const handleBotMenuClick = (href: string) => {
		router.push(href);
	};

	return (
		<TooltipProvider>
			<div className="flex flex-col flex-1 h-full overflow-hidden bg-gradient-to-b from-background/50 to-background/30">
				{/* 타이틀 및 제어 버튼 영역 */}
				<div className="flex items-center justify-between px-3 py-3 border-b border-border/40">
					{/* 좌측: 단일/다중 모드 토글 버튼 */}
					<div className="flex items-center">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={onSingleOpenToggle}
									className="rounded-md w-6 h-6 hover:bg-muted/40">
									{singleOpenMode ? (
										<Focus className="w-4 h-4 neu-icon-active" />
									) : (
										<Layers className="w-4 h-4 neu-icon-inactive" />
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
					</div>

					{/* 가운데: Top 메뉴 타이틀 */}
					<h2 className="text-sm font-medium text-foreground text-center flex-1">
						{topData.label}
					</h2>

					{/* 우측: 전체 열기/닫기 버튼들 - 수직 배치 */}
					<div className="flex flex-col gap-1">
						{/* 전체 접기 버튼 */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={onCollapseAll}
									className="rounded-md w-6 h-5 hover:bg-muted/40">
									<ChevronsUp className="w-3.5 h-3.5 neu-icon-inactive" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>전체 메뉴 접기</p>
							</TooltipContent>
						</Tooltip>

						{/* 전체 펼치기 버튼 */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={onExpandAll}
									className="rounded-md w-6 h-5 hover:bg-muted/40">
									<ChevronsDown className="w-3.5 h-3.5 neu-icon-inactive" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<p>전체 메뉴 펼치기</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>

				{/* 메뉴 영역 - Mid/Bot 메뉴 계층 구조 */}
				<div className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-hide">
					<nav className="min-w-0 px-1.5 py-3 space-y-2">
						{Object.entries(topData.midItems).map(([midKey, midItem]) => (
							<Collapsible key={midKey} open={midExpanded.has(midKey)}>
								{/* Mid 메뉴 헤더 (클릭 가능) */}
								<CollapsibleTrigger asChild>
									<Button
										variant="ghost"
										onClick={() => onMidClick(midKey)}
										className={`w-full justify-between h-auto py-2.5 px-2 rounded-lg transition-all duration-200 group min-w-0 ${
											midMenu === midKey
												? 'neu-inset'
												: 'neu-raised hover:scale-[1.01] hover:bg-primary/5 hover:border-primary/20'
										}`}>
										<span
											className={`text-sm font-medium transition-colors duration-200 truncate flex-1 text-left ${
												midMenu === midKey ? '' : 'group-hover:text-primary/80'
											}`}>
											{midItem.label}
										</span>
										{/* 펼침/접힘 표시 화살표 */}
										<ChevronDown
											className={`w-4 h-4 transform transition-all duration-300 flex-shrink-0 ${
												midExpanded.has(midKey) ? 'rotate-180' : ''
											} ${
												midMenu === midKey
													? ''
													: 'group-hover:text-primary/70 group-hover:scale-105'
											}`}
										/>
									</Button>
								</CollapsibleTrigger>

								{/* Bot 메뉴 목록 (접힌/펼친 콘텐츠) */}
								<CollapsibleContent className="mt-2 overflow-hidden data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up">
									<div className="relative min-w-0 ml-1 mr-1 overflow-hidden">
										{/* 메인 수직 점선 - midMenu 하단에서 마지막 botMenu 중앙까지 */}
										<div
											className="absolute left-0 w-0.5 border-l-2 border-dashed border-muted-foreground/30"
											style={{
												top: '0px',
												height: `${(midItem.botItems.length - 1) * 44 + 18}px`,
											}}></div>

										{/* 트리 컨테이너 */}
										<div className="space-y-0 overflow-hidden">
											{midItem.botItems.map((botItem, index) => {
												const isActive = pathname === botItem.href;

												return (
													<div
														key={botItem.href}
														className={`relative h-11 transition-all duration-300 ease-out overflow-hidden ${
															midExpanded.has(midKey)
																? 'opacity-100 translate-y-0'
																: 'opacity-0 translate-y-2'
														}`}
														style={{
															transitionDelay: midExpanded.has(midKey)
																? `${index * 50}ms`
																: `${(midItem.botItems.length - index - 1) * 30}ms`,
														}}>
														{/* 수평 점선 연결선 */}
														<div
															className="absolute h-0.5 border-t-2 border-dashed border-muted-foreground/30"
															style={{
																left: '4px',
																top: '18px',
																width: '14px',
															}}></div>

														{/* 수평선 종료점 (봇메뉴 앞) */}
														<div
															className="absolute w-1 h-1 rounded-full bg-muted-foreground/40"
															style={{ left: '19px', top: '17.5px' }}></div>

														{/* 메뉴 아이템 */}
														<button
															onClick={() => handleBotMenuClick(botItem.href)}
															className={`relative flex items-center ml-4 pl-2 pr-1.5 py-2.5 text-sm rounded-xl font-medium transition-all duration-200 group text-left min-w-0 max-w-full overflow-hidden ${
																isActive
																	? 'neu-inset bg-primary/5 text-primary border border-primary/20'
																	: 'neu-flat hover:bg-primary/3 hover:text-primary/80 hover:border-primary/10'
															}`}
															style={{
																width: 'calc(100% - 1rem)', // ml-4를 고려한 정확한 width 계산
															}}>
															{/* 아이템 라벨 */}
															<span
																className={`relative z-10 flex items-center gap-1.5 transition-all duration-200 min-w-0 flex-1 overflow-hidden ${
																	isActive
																		? ''
																		: 'group-hover:font-semibold group-hover:translate-x-1'
																}`}>
																<span className="flex-1 truncate">
																	{botItem.label}
																</span>
																{isActive && (
																	<div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse flex-shrink-0"></div>
																)}
																{!isActive && (
																	<div className="flex-shrink-0 w-1 h-1 transition-opacity duration-200 rounded-full opacity-0 bg-primary/50 group-hover:opacity-100"></div>
																)}
															</span>

															{/* 호버 시 배경 효과 */}
															<div className="absolute inset-0 transition-all duration-200 opacity-0 rounded-xl bg-gradient-to-r from-primary/5 via-primary/3 to-transparent group-hover:opacity-100"></div>

															{/* 왼쪽 슬라이드 인디케이터 */}
															<div className="absolute left-0 w-1 h-0 transition-all duration-200 -translate-y-1/2 rounded-r-full top-1/2 bg-primary/70 group-hover:h-6"></div>
														</button>
													</div>
												);
											})}
										</div>
									</div>
								</CollapsibleContent>
							</Collapsible>
						))}
					</nav>
				</div>
			</div>
		</TooltipProvider>
	);
}
// #endregion
