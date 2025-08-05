'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/ui-input/button/Button';

// #region 타입 정의
export interface Tab {
	id: string;
	label: string;
	icon?: React.ReactNode;
	title?: string;
	subtitle?: string;
}

export interface TabsProps {
	tabs: Tab[];
	activeId: string;
	onTabChange: (id: string) => void;
	colorVariant?: 'primary' | 'secondary';
	endContent?: React.ReactNode;
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
			colorVariant = 'primary',
			endContent,
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
										'relative px-4 py-2 font-medium transition-all duration-200 flex items-center justify-center text-sm cursor-pointer',
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
										!isActive && `bg-muted/50 z-10 ${colorStyles.inactive} border-border`,
									)}
								>
									{tab.icon && <span className="inline-block me-2">{tab.icon}</span>}
									<span>{tab.label}</span>
									
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

				{/* 활성 탭 정보 표시 영역 */}
				{(activeTab?.title || activeTab?.subtitle || endContent) && (
					<div className="flex justify-between items-center px-4 py-3 border-s-2 border-e-2 border-border bg-background">
						
            {/* Start 영역 - 제목 & 부제목 */}
						<div className="flex flex-col p-4">
							{activeTab?.title && (
								<h3 className="text-lg font-semibold text-foreground">
									{activeTab.title}
								</h3>
							)}
							{activeTab?.subtitle && (
								<p className="mt-1 text-md text-foreground">
									{activeTab.subtitle}
								</p>
							)}
						</div>

						{/* End 영역 - 사용자 정의 컨텐츠 */}
						{endContent && (
							<div className="flex-shrink-0">
								{endContent}
							</div>
						)}
					</div>
				)}
			</div>
		);
	},
);

Tabs.displayName = 'Tabs';

export default Tabs;
// #endregion
