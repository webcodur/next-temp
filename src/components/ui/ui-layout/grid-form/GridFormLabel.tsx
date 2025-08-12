'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { GridFormLabelProps } from './types';

// #region GridForm.Label 컴포넌트
const GridFormLabel = React.forwardRef<
	HTMLLabelElement,
	GridFormLabelProps & React.LabelHTMLAttributes<HTMLLabelElement>
>(({
	required = false,
	className,
	children,
	...props
}, ref) => {
	return (
		<label
			ref={ref}
			className={cn(
				'text-base font-medium text-foreground',
				'flex justify-start items-center px-4 py-2 font-multilang',
				'border-r text-start border-border/40',
				className
			)}
			{...props}
		>
			{children}
			{required && (
				<span className="ml-1 text-destructive" aria-label="필수">
					*
				</span>
			)}
		</label>
	);
});

GridFormLabel.displayName = 'GridFormLabel';
// #endregion

export default GridFormLabel;
