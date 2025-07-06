import React from 'react';
import { calculateDisplayRange } from '../shared/paginationUtils';

interface PaginationInfoProps {
	totalItems: number;
	currentPage: number;
	pageSize: number;
	itemName: string;
}

export const PaginationInfo: React.FC<PaginationInfoProps> = ({
	totalItems,
	currentPage,
	pageSize,
	itemName,
}) => {
	if (totalItems === 0) {
		return null;
	}

	const { start, end } = calculateDisplayRange(
		currentPage,
		pageSize,
		totalItems
	);

	return (
		<div className="text-muted-foreground text-sm">
			총 {totalItems}개의 {itemName} 중 {start}-{end}개 표시
		</div>
	);
};
