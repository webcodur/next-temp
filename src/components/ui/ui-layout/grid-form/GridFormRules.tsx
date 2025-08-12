'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { GridFormRulesProps } from './types';

// #region GridForm.Rules 컴포넌트
const GridFormRules = React.forwardRef<
	HTMLDivElement,
	GridFormRulesProps & React.HTMLAttributes<HTMLDivElement>
>(({
	className,
	children,
	...props
}, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				'flex justify-start items-center px-4 py-2',
				'text-sm text-muted-foreground font-multilang',
				'min-h-full',
				className
			)}
			{...props}
		>
			<span className="truncate">{children}</span>
		</div>
	);
});

GridFormRules.displayName = 'GridFormRules';
// #endregion

export default GridFormRules;
