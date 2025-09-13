'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/ui-input/button/Button';

// #region 타입 정의
export interface SubTab {
	id: string;
	label: string;
	count?: number;
}

export interface Tab {
	id: string;
	label: string;
	icon?: React.ReactNode;
	count?: number;
	subTabs?: SubTab[];
}

export interface TabsProps {
	tabs: Tab[];
	activeId: string;
	onTabChange: (id: string) => void;
	// 서브탭 관련
	activeSubTabId?: string;
	onSubTabChange?: (subTabId: string) => void;
	// 스타일링
	colorVariant?: 'primary' | 'secondary';
	// 레이아웃
	showSubTabs?: boolean;
}
// #endregion

// #region 탭 컴포넌트
const Tabs = React.forwardRef<
	HTMLDivElement,
	TabsProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'>
>(
	(
		{
			tabs,
			activeId,
			onTabChange,
			activeSubTabId,
			onSubTabChange,
            colorVariant = 'primary',
			showSubTabs = false,
			className,
			...props
		},
		ref,
	) => {
		
    // 색상 variant에 따른 스타일
		const colorStyles = {
			active: colorVariant === 'primary' ? 'text-primary border-primary' : 'text-secondary border-secondary',
			inactive: 'text-muted-foreground border-border hover:text-foreground',
		};

		// 현재 활성 탭 정보
		const activeTab = tabs.find(tab => tab.id === activeId);
        const hasSubTabs = showSubTabs && activeTab?.subTabs && activeTab.subTabs.length > 0;
		return (
			<div
				ref={ref}
				className={cn('relative', className)}
				{...props}
			>
				{/* 전체 탭 컨테이너 */}
				<div className="relative">
					{/* 탭 버튼들 */}
					<div className="flex relative">
						{tabs.map((tab, index) => {
							const isActive = activeId === tab.id;
							const isFirst = index === 0;
							const isLast = index === tabs.length - 1;
							
							return (
								<Button
									key={tab.id}
									variant="ghost"
									onClick={() => onTabChange(tab.id)}
									className={cn(
									'relative px-4 py-2 font-medium transition-colors duration-0 flex items-center justify-center text-sm cursor-pointer',
										// 모든 탭에 기본 border 적용
										'border-t-2 border-s-2',
										// 마지막 탭은 우측 border도 적용
										isLast && 'border-e-2',
										// Round 처리 - 상단 모서리
										'rounded-t-lg',
										// 첫 번째 탭의 왼쪽 상단 모서리 강화
										isFirst && 'rounded-tl-lg',
										// 마지막 탭의 오른쪽 상단 모서리 강화
										isLast && 'rounded-tr-lg',
										// 활성 탭 스타일
										isActive && `${colorStyles.active} bg-background z-20`,
										// 비활성 탭 스타일
									!isActive && `bg-muted/80 hover:bg-muted z-10 ${colorStyles.inactive} border-border`,
									)}
								>
									{tab.icon && (
										<span className={cn(
											"inline-block me-2",
											isActive ? 'neu-icon-active' : 'neu-icon-inactive'
										)}>
											{tab.icon}
										</span>
									)}
									<span>{tab.label}</span>
									{typeof tab.count === 'number' && (
										<span className="ms-1 text-xs opacity-70">
											({tab.count})
										</span>
									)}
									
									{/* 활성 탭에서 아래쪽을 덮는 덮개 */}
									{isActive && (
										<div 
											className="absolute -bottom-0.5 h-1 bg-background z-30"
											style={{
												insetInlineStart: 0,
												insetInlineEnd: 0,
											}}
										/>
									)}
								</Button>
							);
						})}
					</div>
				</div>
				
				{/* 하단 연결 라인 */}
				<div className="border-b-2 border-border"></div>

				{/* 서브탭이 있는 경우 - chip 형태 가로배치 */}
				{hasSubTabs && (
					<div className="flex flex-col border-s-2 border-e-2 border-border bg-background">
						{/* 서브탭 영역 */}
						<div className="flex flex-wrap gap-2 p-4 border-b border-border bg-muted/20">
							{activeTab?.subTabs?.map((subTab) => {
								const isSubActive = activeSubTabId === subTab.id;
								return (
									<Button
										key={subTab.id}
										variant={isSubActive ? "primary" : "outline"}
										size="sm"
										onClick={() => onSubTabChange?.(subTab.id)}
										className={cn(
											'px-3 py-1.5 text-sm transition-colors duration-0',
											isSubActive 
												? 'bg-primary text-primary-foreground border-primary' 
												: 'text-muted-foreground hover:text-foreground hover:border-foreground/20'
										)}
									>
										{subTab.label}
										{typeof subTab.count === 'number' && (
											<span className="ms-1 text-xs opacity-70">
												({subTab.count})
											</span>
										)}
									</Button>
								);
							})}
						</div>
					</div>
				)}

                {/* 서브탭 없는 경우: 타이틀/액션 영역 제거됨 (독립 모듈 사용) */}
			</div>
		);
	},
);

Tabs.displayName = 'Tabs';

export default Tabs;
// #endregion
