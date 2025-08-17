'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Grid, List } from 'lucide-react';
import type { GridFormViewMode } from './types';

// #region GridFormViewSelector 타입 정의
export interface GridFormViewSelectorProps {
	viewMode: GridFormViewMode;
	onViewModeChange: (viewMode: GridFormViewMode) => void;
	className?: string;
}
// #endregion

// #region GridFormViewSelector 컴포넌트
const GridFormViewSelector: React.FC<GridFormViewSelectorProps> = ({
	viewMode,
	onViewModeChange,
	className,
}) => {
	const viewOptions = [
		{
			mode: 'default' as GridFormViewMode,
			icon: Grid,
			label: '기본뷰',
			description: '2열 구조 (필드명-필드값) - 행당 2개씩',
		},
		{
			mode: 'detail' as GridFormViewMode,
			icon: List,
			label: '상세뷰',
			description: '4열 구조 (순서-필드명-필드값-룰)',
		},
	];

	return (
		<div className={cn(
			'flex gap-1 items-center p-1 rounded-lg neu-flat bg-muted/30',
			className
		)}>
			{viewOptions.map(({ mode, icon: Icon, label, description }) => (
				<button
					key={mode}
					type="button"
					onClick={() => onViewModeChange(mode)}
					className={cn(
						'flex items-center justify-center p-2 rounded-md',
						'text-sm font-medium',
						viewMode === mode
							? 'neu-inset bg-background text-foreground'
							: 'neu-raised text-muted-foreground hover:text-foreground'
					)}
					title={`${label} - ${description}`}
				>
					<Icon className="w-4 h-4" />
				</button>
			))}
		</div>
	);
};

GridFormViewSelector.displayName = 'GridFormViewSelector';
// #endregion

export default GridFormViewSelector;
