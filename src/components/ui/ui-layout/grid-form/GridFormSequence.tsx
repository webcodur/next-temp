'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { GridFormSequenceProps } from './types';

// #region GridForm.Sequence 컴포넌트
const GridFormSequence = React.forwardRef<
	HTMLDivElement,
	GridFormSequenceProps & React.HTMLAttributes<HTMLDivElement>
>(({
	sequence,
	total,
	className,
	...props
}, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				'flex justify-center items-center px-2 py-2',
				'border-r bg-muted/20 border-border/40',
				'text-sm font-medium text-muted-foreground',
				'min-h-full',
				className
			)}
			{...props}
		>
			{typeof total === 'number' && total > 0 ? `${sequence}/${total}` : sequence}
		</div>
	);
});

GridFormSequence.displayName = 'GridFormSequence';
// #endregion

export default GridFormSequence;
