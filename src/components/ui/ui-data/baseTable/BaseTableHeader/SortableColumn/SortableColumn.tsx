import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { BaseTableColumn } from '../../types';
import { SortState } from '../../../shared/useSortableData';

interface SortableColumnProps<T = unknown> {
	column: BaseTableColumn<T>;
	colIndex: number;
	totalColumns: number;
	sortState: SortState;
	onSort: (columnKey: string, sortable: boolean, actualKey?: string) => void;
	isRTL: boolean;
}

export const SortableColumn = <T extends Record<string, unknown>>({
	column,
	colIndex,
	totalColumns,
	sortState,
	onSort,
	isRTL,
}: SortableColumnProps<T>) => {
	const columnKey = column.key ? String(column.key) : `col-${colIndex}`;
	const actualKey = column.key ? String(column.key) : undefined;
	const canSort = column.sortable !== false && !!actualKey;
	const isSorted = sortState.key === actualKey;
	const sortDirection = isSorted ? sortState.direction : null;

	return (
		<th
			className={`
				relative px-2 py-3 text-xs font-medium text-primary-8 uppercase tracking-wider
				text-center
				${colIndex < totalColumns - 1 ? 'border-r border-primary-4/30' : ''}
				${canSort ? 'cursor-pointer hover:bg-primary-2/30 select-none' : ''}
				${column.headerClassName || ''}
				${colIndex === 0 ? 'rounded-tl-lg' : ''}
				${colIndex === totalColumns - 1 ? 'rounded-tr-lg' : ''}
			`}
			style={{ width: column.width }}
			onClick={() => onSort(columnKey, canSort, actualKey)}
		>
			<div className="inline-block relative">
				{/* 헤더 타이틀 */}
				<span className="block text-base truncate font-multilang">
					{column.header}
				</span>

				{/* 정렬 아이콘 */}
				{canSort && (
					<div
						className={`absolute top-1/2 -translate-y-1/2 flex flex-col ${
							isRTL ? 'right-full mr-1' : 'left-full ml-1'
						}`}
					>
						<ChevronUp
							size={12}
							className={
								`transition-colors ${sortDirection === 'asc' ? 'text-primary-8' : 'text-primary-4'}`
							}
						/>
						<ChevronDown
							size={12}
							className={
								`transition-colors -mt-1 ${sortDirection === 'desc' ? 'text-primary-8' : 'text-primary-4'}`
							}
						/>
					</div>
				)}
			</div>
		</th>
	);
}; 