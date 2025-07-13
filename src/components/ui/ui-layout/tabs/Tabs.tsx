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
	align?: 'start' | 'center' | 'end';
	size?: 'sm' | 'md' | 'lg';
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
			align = 'start',
			size = 'md',
			className,
			...props
		},
		ref,
	) => {
		const alignClasses = {
			start: 'justify-start',
			center: 'justify-center',
			end: 'justify-end',
		};

		const sizeClasses = {
			sm: 'text-xs py-1',
			md: 'text-sm py-2',
			lg: 'text-base py-2',
		};

		return (
			<div
				ref={ref}
				className={cn('relative p-2 rounded-xl neu-elevated', className)}
				{...props}
			>
				<div className={cn('flex relative z-10', alignClasses[align])}>
					{tabs.map(tab => (
						<button
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
							className={cn(
								'relative px-3 mx-1 rounded-lg font-medium transition-all duration-200 flex items-center justify-center',
								sizeClasses[size],
								activeId === tab.id
									? 'text-primary neu-inset'
									: 'text-muted-foreground hover:text-primary neu-raised',
							)}
						>
							{tab.icon && <span className="inline-block me-2">{tab.icon}</span>}
							<span className="relative z-10">{tab.label}</span>
						</button>
					))}
				</div>
			</div>
		);
	},
);

Tabs.displayName = 'Tabs';

export default Tabs;
// #endregion
