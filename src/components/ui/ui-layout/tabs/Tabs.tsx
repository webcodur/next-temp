'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// #region 타입 정의
export interface Tab {
	id: string;
	label: string;
	icon?: React.ReactNode;
}

export interface TabsProps {
	tabs: Tab[];
	children: React.ReactNode[];
	variant?: 'default' | 'filled';
	align?: 'start' | 'center' | 'end';
	size?: 'sm' | 'md' | 'lg';
	// Three.js 컴포넌트 언마운트를 위한 옵션
	forceRemount?: boolean;
}
// #endregion

// #region 탭 컴포넌트
const Tabs = React.forwardRef<
	HTMLDivElement,
	TabsProps & React.HTMLAttributes<HTMLDivElement>
>(({
	tabs,
	children,
	variant = 'default',
	align = 'start',
	size = 'md',
	forceRemount = true, // 기본값을 true로 설정
	className,
	...props
}, ref) => {
	const [activeId, setActiveId] = useState<string>(tabs[0]?.id);

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
				'relative rounded-2xl transition-all duration-200', 
				variant === 'filled' && 'bg-muted',
				className
			)}
			{...props}
		>
			{/* 탭 헤더 */}
			<div className="relative p-4 rounded-xl neu-elevated">
				<div className={cn("flex relative z-10", alignClasses[align])}>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveId(tab.id)}
							className={cn(
								'relative px-6 mx-1 rounded-lg font-medium transition-all duration-200',
								sizeClasses[size],
								activeId === tab.id 
									? 'text-primary neu-inset' 
									: 'text-muted-foreground hover:text-primary neu-raised'
							)}
						>
							{tab.icon && (
								<span className="inline-block me-2">
									{tab.icon}
								</span>
							)}
							<span className="relative z-10">{tab.label}</span>
						</button>
					))}
				</div>
			</div>

			{/* 탭 컨텐츠 */}
			<div className="relative p-6 mt-6 rounded-xl neu-elevated">
				<div className="relative z-10">
					{forceRemount ? (
						// 조건부 렌더링: 활성 탭만 렌더링 (Three.js 컴포넌트 완전 언마운트)
						tabs.map((tab, idx) => 
							activeId === tab.id ? (
								<div 
									key={tab.id} 
									className="transition-opacity duration-200 animate-fadeIn"
								>
									{children[idx]}
								</div>
							) : null
						)
					) : (
						// 기존 방식: 모든 컨텐츠 렌더링 후 visibility로 제어
						tabs.map((tab, idx) => (
							<div 
								key={tab.id} 
								className={cn(
									"transition-opacity duration-200",
									activeId === tab.id 
										? 'block animate-fadeIn' 
										: 'hidden'
								)}
							>
								{children[idx]}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
});

Tabs.displayName = 'Tabs';

export default Tabs;
// #endregion
