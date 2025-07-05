import {
	ChevronsDown,
	ChevronsUp,
	Focus,
	Layers,
	Minus,
	Plus,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { useState, useEffect, useRef } from 'react';
import { recentMenusAtom, rPanelWidthAtom, isResizingAtom } from '@/store/sidebar';
import type { TopItem } from '@/components/layout/sidebar/types';
import { Button } from '@/components/ui/ui-input/button/Button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/ui-effects/tooltip/Tooltip';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/ui-layout/collapsible/Collapsible';
import { BotMenu } from '../types';
import { useTranslations } from '@/hooks/useI18n';

/**
 * 사이드바 우측 패널 Props 타입
 */
interface SideRPanelProps {
	topKey: string; // 현재 선택된 Top 메뉴 키
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
	topKey,
	topData,
	midExpanded,
	singleOpenMode,
	onMidClick,
	onSingleOpenToggle,
	onExpandAll,
	onCollapseAll,
}: SideRPanelProps) {
	const pathname = usePathname();
	const [recentMenus, setRecentMenus] = useAtom(recentMenusAtom);
	const [rPanelWidth] = useAtom(rPanelWidthAtom);
	const [isResizing] = useAtom(isResizingAtom);
	const t = useTranslations();
	
	// 전체 펼침/접힘 상태 확인
	const allMidKeys = Object.keys(topData.midItems);
	const areAllExpanded =
		allMidKeys.length > 0 && allMidKeys.every((key) => midExpanded.has(key));

	// 제목 클릭 핸들러: 전체 펼침/접힘 토글
	const handleTitleClick = () => {
		if (areAllExpanded) {
			onCollapseAll?.();
		} else {
			onExpandAll?.();
		}
	};
	
	// Hydration 에러 방지: 클라이언트 마운트 완료 후에만 조건부 렌더링 활성화
	const [isMounted, setIsMounted] = useState(false);
	
	// 툴팁 상태 관리
	const [tooltipOpen, setTooltipOpen] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// 툴팁 표시 제어
	const handleTooltipMouseEnter = () => {
		setIsHovering(true);
		if (tooltipTimeoutRef.current) {
			clearTimeout(tooltipTimeoutRef.current);
		}
		setTooltipOpen(true);
	};

	const handleTooltipMouseLeave = () => {
		setIsHovering(false);
		if (tooltipTimeoutRef.current) {
			clearTimeout(tooltipTimeoutRef.current);
		}
		setTooltipOpen(false);
	};

	const handleModeToggleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		console.log(`[UI] 모드 토글 버튼 클릭: ${singleOpenMode ? '단일' : '다중'} 모드`);
		
		// 클릭 시 툴팁을 잠깐 닫고 다시 열기
		setTooltipOpen(false);
		
		// 모드 변경
		onSingleOpenToggle();
		
		// 마우스가 여전히 위에 있으면 300ms 후 툴팁 다시 표시
		if (isHovering) {
			tooltipTimeoutRef.current = setTimeout(() => {
				if (isHovering) {
					setTooltipOpen(true);
				}
			}, 300);
		}
	};

	// 컴포넌트 언마운트 시 타이머 정리
	useEffect(() => {
		return () => {
			if (tooltipTimeoutRef.current) {
				clearTimeout(tooltipTimeoutRef.current);
			}
		};
	}, []);

	// 최근 접속 메뉴에 추가하는 함수
	const addToRecentMenus = (midKey: string, botItem: BotMenu) => {
		console.log('사이드바 직접 클릭 기록:', { topKey, midKey, botItem }); // 디버깅용

		const recentMenuData = {
			type: 'bot' as const,
			topKey,
			midKey: midKey || '',
			item: {
				key: botItem.key,
				href: botItem.href,
			},
			accessedAt: Date.now(),
		};

		// 기존 항목 중에서 같은 href를 가진 항목 제거
		const filteredRecents = recentMenus.filter(
			(recent) => recent.item.href !== botItem.href
		);

		// 새 항목을 맨 앞에 추가하고 최대 10개까지만 유지
		const updatedRecents = [recentMenuData, ...filteredRecents].slice(0, 10);

		console.log('업데이트된 최근 메뉴 (사이드바):', updatedRecents); // 디버깅용

		setRecentMenus(updatedRecents);

		// localStorage에 즉시 저장 (jotai atomWithStorage가 비동기일 수 있으므로)
		try {
			localStorage.setItem('recentMenus', JSON.stringify(updatedRecents));
		} catch (error) {
			console.error('최근 메뉴 저장 실패 (사이드바):', error);
		}
	};

	// botMenu 클릭 처리 - 최근 접속 메뉴에 기록
	const handleBotMenuClick = (midKey: string, botItem: BotMenu) => {
		addToRecentMenus(midKey, botItem);
	};

	// 현재 경로가 midItem의 botItems 중 하나와 일치하는지 확인하는 함수
	const isMidMenuActive = (midItem: (typeof topData.midItems)[string]) => {
		return midItem.botItems.some((botItem) => pathname === botItem.href);
	};

	return (
		<TooltipProvider delayDuration={0}>
			<div
				className={`flex overflow-hidden flex-col h-full bg-gradient-to-b from-background/30 to-background/10 border-s border-border/30 pe-4 ${!isResizing ? 'transition-all duration-200 ease-in-out' : ''}`}
				style={{ width: `${rPanelWidth}px` }}>
				{/* 타이틀 및 제어 버튼 영역 */}
				<div className="flex justify-between items-center px-3 py-3 border-b border-border/40">
					{/* 좌측: 단일/다중 모드 토글 버튼 */}
					<div className="flex items-center">
						<Tooltip open={tooltipOpen}>
							<TooltipTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={handleModeToggleClick}
									onMouseEnter={handleTooltipMouseEnter}
									onMouseLeave={handleTooltipMouseLeave}
									className={`w-6 h-6 rounded-md transition-all duration-150 cursor-pointer ${
										isMounted && singleOpenMode 
											? 'bg-brand/10 hover:bg-brand/20' 
											: 'hover:bg-muted/40'
									}`}>
									{isMounted && singleOpenMode ? (
										<Focus className="w-4 h-4 cursor-pointer neu-icon-active" />
									) : (
										<Layers className="w-4 h-4 cursor-pointer neu-icon-inactive hover:text-brand" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<div className="text-center">
									<div className="font-medium">
										{isMounted && singleOpenMode
											? t('사이드바_단일패널모드')
											: t('사이드바_다중패널모드')}
									</div>
									<div className="text-xs opacity-80">
										{isMounted && singleOpenMode
											? t('사이드바_다중전환')
											: t('사이드바_단일전환')}
									</div>
								</div>
							</TooltipContent>
						</Tooltip>
					</div>

					{/* 가운데: Top 메뉴 타이틀 */}
					<h2
						className="flex-1 text-base font-bold text-center cursor-pointer text-foreground"
						onClick={handleTitleClick}>
						{t(`메뉴_${topKey}`)} <span className="text-sm">{t('공통_메뉴')}</span>
					</h2>

					{/* 우측: 전체 열기/닫기 버튼들 - 수직 배치 */}
					<div className="flex flex-col gap-1">
						{/* 전체 접기 버튼 */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										void onCollapseAll?.();
									}}
									className="w-6 h-5 rounded-md transition-all duration-150 cursor-pointer hover:bg-muted/40 hover:scale-105">
									<ChevronsUp className="w-3.5 h-3.5 neu-icon-inactive cursor-pointer" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">
								<div className="text-center">
									<div className="font-medium">{t('사이드바_전체접기')}</div>
									<div className="text-xs opacity-80">{t('사이드바_모든하위닫기')}</div>
								</div>
							</TooltipContent>
						</Tooltip>

						{/* 전체 펼치기 버튼 */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										void onExpandAll?.();
									}}
									className="w-6 h-5 rounded-md transition-all duration-150 cursor-pointer hover:bg-muted/40 hover:scale-105">
									<ChevronsDown className="w-3.5 h-3.5 neu-icon-inactive cursor-pointer" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">
								<div className="text-center">
									<div className="font-medium">{t('사이드바_전체펼치기')}</div>
									<div className="text-xs opacity-80">{t('사이드바_모든하위열기')}</div>
								</div>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>

				{/* 메뉴 영역 - Mid/Bot 메뉴 계층 구조 */}
				<div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-hide">
					<nav className="min-w-0 px-1.5 py-3 space-y-2">
						{Object.entries(topData.midItems).map(([midKey, midItem]) => (
							<Collapsible key={midKey} open={midExpanded.has(midKey)}>
								{/* Mid 메뉴 헤더 (클릭 가능) */}
								<CollapsibleTrigger asChild>
									<Button
										type="button"
										variant="outline"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											onMidClick(midKey);
										}}
										className={`w-full justify-between h-auto py-2.5 px-2 rounded-lg group min-w-0 border-none! transition-all duration-200 cursor-pointer ${
											isMidMenuActive(midItem)
												? 'neu-inset text-brand! font-bold'
												: 'neu-flat'
										}`}>
										<span
											className={`flex-1 text-sm font-medium text-start truncate`}>
											{t(`메뉴_${midKey}`)}
										</span>
										{/* 펼침/접힘 표시 아이콘 */}
										{midExpanded.has(midKey) ? (
											<Minus className="w-4 h-4 cursor-pointer shrink-0" />
										) : (
											<Plus className="w-4 h-4 cursor-pointer shrink-0" />
										)}
									</Button>
								</CollapsibleTrigger>

								{/* Bot 메뉴 목록 (접힌/펼친 콘텐츠) */}
								<CollapsibleContent className="mt-2 overflow-hidden data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up">
									<div className="overflow-hidden relative me-1 ms-1 min-w-0">
										{/* 메인 수직선 - z-index를 낮게 설정하여 배경에 배치 */}
										<div
											className="absolute left-2 w-0.5 border-l-2 border-solid border-muted-foreground/25 z-0"
											style={{
												top: '0px',
												height: `${(midItem.botItems.length - 1) * 44 + 18}px`,
											}}></div>

										{/* 트리 컨테이너 */}
										<div className="overflow-hidden relative z-10 space-y-0">
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
														{/* 수평 연결선 - 길이를 줄여서 메뉴 아이템과 겹치지 않도록 */}
														<div
															className="absolute h-0.5 border-t-2 border-solid border-muted-foreground/25 z-0"
															style={{
																left: '8px',
																top: '18px',
																width: '10px',
															}}></div>

														{/* 수평선 종료점 (봇메뉴 앞) - 위치 조정하여 잘리지 않도록 */}
														<div
															className="absolute z-0 w-1 h-1 rounded-full bg-muted-foreground/30"
															style={{ left: '19px', top: '17.5px' }}></div>

														{/* 메뉴 아이템 - z-index를 높게 설정하고 불투명 배경 적용 */}
														<Link
															href={botItem.href}
															onClick={() =>
																handleBotMenuClick(midKey, botItem)
															}
															className={`relative flex items-center justify-between ms-7 ps-3 py-2 text-sm rounded-md text-start group hover:pe-2 transition-all duration-200 cursor-pointer z-20 ${
																isActive
																	? 'neu-inset text-brand! font-bold bg-background':'neu-flat bg-background/95 backdrop-blur-sm'}`}
															style={{
																width: 'calc(100% - 1.75rem)', // ms-7을 고려한 정확한 width 계산
															}}>
															{/* 아이템 라벨 */}
															<span className="flex-1 truncate">
																{t(`메뉴_${botItem.key}`)}
															</span>
															{/* 호버 시 우측 점 인디케이터 */}
															<div className="w-2 h-2 rounded-full bg-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-none!" />
														</Link>
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
