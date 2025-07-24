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
	colorVariant?: 'primary' | 'secondary';
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
	colorVariant = 'primary',
	isRTL,
}: TableRowProps<T>) => {
	// 행 클래스 이름 계산
	const getRowClassName = () => {
		if (typeof rowClassName === 'function') {
			return rowClassName(item, index);
		}
		return rowClassName;
	};

	// 색상 variant에 따른 hover 스타일
	const hoverClass = colorVariant === 'primary' 
		? 'hover:bg-primary-2/[0.6]' 
		: 'hover:bg-secondary-2/[0.6]';

	return (
		<tr
			onClick={() => onRowClick?.(item, index)}
			className={`
				${index % 2 === 0 ? 'bg-surface-1' : 'bg-surface-2'}
				${hoverClass}
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