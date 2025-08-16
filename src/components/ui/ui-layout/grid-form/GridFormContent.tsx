'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { GridFormContentProps } from './types';

// #region GridForm.Content 컴포넌트
const GridFormContent = React.forwardRef<
	HTMLDivElement,
	GridFormContentProps & React.HTMLAttributes<HTMLDivElement>
>(({
	direction = 'column',
	gap = '12px',
	className,
	children,
	...props
}, ref) => {
	const directionClasses = {
		column: 'flex-col',
		row: 'flex-row flex-wrap',
	};

	return (
		<div
			ref={ref}
			className={cn(
				'flex min-h-full',
				directionClasses[direction],
				// direction이 column일 때는 justify-center, row일 때는 items-center
				direction === 'column' ? 'justify-center' : 'items-center',
				className
			)}
			style={{
				gap,
			}}
			{...props}
		>
			{children}
		</div>
	);
});

GridFormContent.displayName = 'GridFormContent';
// #endregion

export default GridFormContent;
