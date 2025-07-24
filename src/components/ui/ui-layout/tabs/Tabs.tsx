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
			active: colorVariant === 'primary' ? 'text-primary' : 'text-secondary',
			hover: colorVariant === 'primary' ? 'hover:text-primary' : 'hover:text-secondary',
		};

		return (
			<div
				ref={ref}
				className={cn('relative rounded-xl neu-elevated', className)}
				{...props}
			>
				<div className="flex relative z-10 gap-3 justify-center px-3 py-3">
					{tabs.map(tab => (
						<button
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
							className={cn(
								'relative flex-1 px-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center text-base py-2 border-b-2 ',
								activeId === tab.id
									? `${colorStyles.active} neu-inset`
									: `text-muted-foreground ${colorStyles.hover} neu-raised`,
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
