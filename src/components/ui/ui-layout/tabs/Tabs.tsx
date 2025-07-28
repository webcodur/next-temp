'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// #region 타입 정의
export interface Tab {
	id: string;
	label: string;
	icon?: React.ReactNode;
}

export interface TabsProps {
	tabs: Tab[];
	activeId: string;
	onTabChange: (id: string) => void;
	colorVariant?: 'primary' | 'secondary';
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

		return (
			<div
				ref={ref}
				className={cn('relative', className)}
				{...props}
			>
				{/* 전체 탭 컨테이너 - 연속적인 상단 border */}
				<div className="relative rounded-t-lg border-t-2 border-s-2 border-e-2 border-border">
					{/* 탭 버튼들 */}
					<div className="flex relative">
						{tabs.map((tab, index) => {
							const isActive = activeId === tab.id;
							
							return (
								<button
									key={tab.id}
									onClick={() => onTabChange(tab.id)}
									className={cn(
										'relative px-4 py-2 font-medium transition-all duration-200 flex items-center justify-center text-sm cursor-pointer',
										// 비활성 탭은 배경색 적용
										!isActive && 'bg-muted/50',
										// 활성 탭 스타일
										isActive && `${colorStyles.active} bg-background`,
										// 비활성 탭 스타일
										!isActive && `${colorStyles.inactive}`,
										// 탭 간 구분선 (마지막 탭 제외)
										index < tabs.length - 1 && 'border-e border-border',
									)}
								>
									{tab.icon && <span className="inline-block me-2">{tab.icon}</span>}
									<span>{tab.label}</span>
									
									{/* 활성 탭에서 아래쪽을 덮는 덮개 */}
									{isActive && (
										<div 
											className="absolute -bottom-1 h-1.5 bg-background"
											style={{
												insetInlineStart: 0,
												insetInlineEnd: 0,
											}}
										/>
									)}
								</button>
							);
						})}
					</div>
				</div>
				
				{/* 하단 연결 라인 - 단순화 */}
				<div className="h-0.5 bg-border"></div>
			</div>
		);
	},
);

Tabs.displayName = 'Tabs';

export default Tabs;
// #endregion
