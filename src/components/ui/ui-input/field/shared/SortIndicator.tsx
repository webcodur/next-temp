import React from 'react';
import { ENUM_SortDirection } from '../core/types';

interface SortIndicatorProps {
	sortDirection: ENUM_SortDirection;
}

export const SortIndicator: React.FC<SortIndicatorProps> = ({
	sortDirection,
}) => (
	<span className="font-multilang ms-2 text-xs text-muted-foreground">
		{sortDirection === 'asc' ? '오름차순' : '내림차순'}
	</span>
);
