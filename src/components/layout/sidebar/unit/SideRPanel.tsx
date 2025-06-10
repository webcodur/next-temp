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
	midMenu?: string; // 현재 선택된 Mid 메뉴 키 (선택 사항)
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

	// 현재 경로가 midItem의 botItems 중 하나와 일치하는지 확인하는 함수
	const isMidMenuActive = (midItem: typeof topData.midItems[string]) => {
		return midItem.botItems.some(botItem => pathname === botItem.href);
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
					<h2 className="text-base font-bold text-foreground text-center flex-1">
						{topData.label} <span className="text-sm">메뉴</span>
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
										variant="outline"
										onClick={() => onMidClick(midKey)}
										className={`w-full justify-between h-auto py-2.5 px-2 rounded-lg group min-w-0 !neu-flat !bg-white !text-black !border-none hover:!bg-white hover:!text-black hover:shadow-md hover:scale-[1.01] ${
											isMidMenuActive(midItem) 
												? '!bg-[#a0a0a0] !text-black !font-bold !shadow-none' 
												: ''
										}`}>
										<span
											className={`text-sm font-medium truncate flex-1 text-left`}>
											{midItem.label}
										</span>
										{/* 펼침/접힘 표시 화살표 */}
										<ChevronDown
											className={`w-4 h-4 transform flex-shrink-0 ${
												midExpanded.has(midKey) ? 'rotate-180' : ''
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
															className={`relative flex items-center ml-4 pl-3 pr-1.5 py-2.5 text-sm rounded-md font-medium group text-left min-w-0 max-w-full overflow-hidden neu-flat bg-white text-black hover:bg-white hover:text-black hover:shadow-md hover:scale-[1.01] ${
																isActive
																	? '!bg-[#a0a0a0] !text-black font-bold !shadow-none'
																	: ''
															}`}
															style={{
																width: 'calc(100% - 1rem)', // ml-4를 고려한 정확한 width 계산
															}}>
															{/* 아이템 라벨 */}
															<span className="flex-1 truncate">
																{botItem.label}
															</span>
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
