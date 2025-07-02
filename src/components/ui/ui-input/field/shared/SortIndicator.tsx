import React from 'react';
import { SortDirection } from '../core/types';

interface SortIndicatorProps {
	sortDirection: SortDirection;
}

export const SortIndicator: React.FC<SortIndicatorProps> = ({
	sortDirection,
}) => (
	<span className="font-multilang ml-2 text-xs text-muted-foreground">
		{sortDirection === 'asc' ? '오름차순' : '내림차순'}
	</span>
);
