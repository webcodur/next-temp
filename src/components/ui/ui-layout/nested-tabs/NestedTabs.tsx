'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

// #region 타입 정의
export interface SubTab {
	id: string;
	label: string;
	icon?: React.ReactNode;
	content: React.ReactNode;
}

export interface TopTab {
	id: string;
	label: string;
	icon?: React.ReactNode;
	subTabs: SubTab[];
}

export interface NestedTabsProps {
	tabs: TopTab[];
	variant?: 'default' | 'filled';
	align?: 'start' | 'center' | 'end';
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}
// #endregion

// #region 중첩 탭 컴포넌트
const NestedTabs = React.forwardRef<
	HTMLDivElement,
	NestedTabsProps & React.HTMLAttributes<HTMLDivElement>
>(({
	tabs,
	variant = 'default',
	align = 'start',
	size = 'md',
	className,
	...props
}, ref) => {
	const [activeTopId, setActiveTopId] = useState<string>(tabs[0]?.id);
	const [activeSubId, setActiveSubId] = useState<string>(tabs[0]?.subTabs[0]?.id);

	const handleTopTabClick = (topId: string) => {
		setActiveTopId(topId);
		const newTopTab = tabs.find(tab => tab.id === topId);
		if (newTopTab?.subTabs[0]) {
			setActiveSubId(newTopTab.subTabs[0].id);
		}
	};

	const activeTopTab = useMemo(() => tabs.find(tab => tab.id === activeTopId), [tabs, activeTopId]);
	const activeSubTabContent = useMemo(() => {
		return activeTopTab?.subTabs.find(subTab => subTab.id === activeSubId)?.content;
	}, [activeTopTab, activeSubId]);
	
	const alignClasses = {
		start: 'justify-start',
		center: 'justify-center',
		end: 'justify-end',
	};

	const sizeClasses = {
		sm: 'text-xs py-2',
		md: 'text-sm py-3',
		lg: 'text-base py-4',
	};

	return (
		<div
			ref={ref}
			className={cn(
				'relative overflow-hidden rounded-2xl neu-flat transition-all duration-200',
				variant === 'filled' && 'bg-muted',
				className
			)}
			{...props}
		>
			{/* 1단계 탭 헤더 */}
			<div className="overflow-hidden relative p-2 rounded-xl neu-flat">
				<div className={cn("flex relative z-10", alignClasses[align])}>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => handleTopTabClick(tab.id)}
							className={cn(
								'relative px-6 mx-1 rounded-lg font-medium transition-all duration-200',
								sizeClasses[size],
								activeTopId === tab.id
									? 'text-brand neu-inset'
									: 'text-muted-foreground hover:text-brand neu-raised'
							)}
						>
							{tab.icon && <span className="inline-block me-2">{tab.icon}</span>}
							<span className="relative z-10">{tab.label}</span>
						</button>
					))}
				</div>
			</div>

			{/* 2단계 탭 헤더 */}
			{activeTopTab && activeTopTab.subTabs.length > 0 && (
				<div className="overflow-hidden relative p-2 mt-4 rounded-xl neu-flat">
					<div className={cn("flex relative z-10", alignClasses[align])}>
						{activeTopTab.subTabs.map((subTab) => (
							<button
								key={subTab.id}
								onClick={() => setActiveSubId(subTab.id)}
								className={cn(
									'relative px-4 mx-1 rounded-md font-medium transition-all duration-200',
									sizeClasses.sm, // 서브탭은 작은 사이즈로 고정
									activeSubId === subTab.id
										? 'text-brand neu-inset'
										: 'text-muted-foreground hover:text-brand neu-raised'
								)}
							>
								{subTab.icon && <span className="inline-block me-2">{subTab.icon}</span>}
								<span className="relative z-10">{subTab.label}</span>
							</button>
						))}
					</div>
				</div>
			)}
			
			{/* 탭 컨텐츠 */}
			<div className="overflow-hidden relative p-6 mt-6 rounded-xl neu-flat">
				<div className="relative z-10">
					<div className="transition-opacity duration-200 animate-fadeIn">
						{activeSubTabContent}
					</div>
				</div>
			</div>
		</div>
	);
});

NestedTabs.displayName = 'NestedTabs';

export default NestedTabs;
// #endregion 