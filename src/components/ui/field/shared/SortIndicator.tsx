import React from 'react';
import { SortDirection } from '../core/types';

interface SortIndicatorProps {
	sortDirection: SortDirection;
}

export const SortIndicator: React.FC<SortIndicatorProps> = ({
	sortDirection,
}) => (
	<span className="ml-2 text-xs text-gray-400">
		{sortDirection === 'asc' ? '오름차순' : '내림차순'}
	</span>
);
