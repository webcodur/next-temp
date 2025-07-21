import React from 'react';
import { BaseTableColumn } from '../../types';
import { TableCell } from './TableCell/TableCell';

interface TableRowProps<T> {
	item: T;
	index: number;
	columns: BaseTableColumn<T>[];
	totalLength: number;
	rowClassName?: string | ((item: T, index: number) => string);
	cellClassName?: string;
	onRowClick?: (item: T, index: number) => void;
	isRTL: boolean;
}

export const TableRow = <T extends Record<string, unknown>>({
	item,
	index,
	columns,
	totalLength,
	rowClassName = '',
	cellClassName = '',
	onRowClick,
	isRTL,
}: TableRowProps<T>) => {
	// 행 클래스 이름 계산
	const getRowClassName = () => {
		if (typeof rowClassName === 'function') {
			return rowClassName(item, index);
		}
		return rowClassName;
	};

	return (
		<tr
			onClick={() => onRowClick?.(item, index)}
			className={`
				${index % 2 === 0 ? 'bg-surface-1' : 'bg-surface-2'}
				hover:bg-primary-2/[0.6]
				${onRowClick ? 'cursor-pointer' : ''}
				${getRowClassName()}
			`}
		>
			{columns.map((column, colIndex) => (
				<TableCell
					key={`${index}-${column.key ? String(column.key) : colIndex}`}
					item={item}
					column={column}
					index={index}
					colIndex={colIndex}
					totalColumns={columns.length}
					totalRows={totalLength}
					cellClassName={cellClassName}
					isRTL={isRTL}
				/>
			))}
		</tr>
	);
}; 