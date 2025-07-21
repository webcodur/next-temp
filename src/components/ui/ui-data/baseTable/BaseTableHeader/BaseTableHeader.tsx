import React from 'react';
import { BaseTableHeaderProps } from '../types';
import { SortableColumn } from './SortableColumn/SortableColumn';

export const BaseTableHeader = <T extends Record<string, unknown>>({
	columns,
	sortState,
	onSort,
	headerClassName = '',
	isRTL,
}: BaseTableHeaderProps<T>) => {
	return (
		<div className="scrollbar-gutter-stable">
			<table
				className="overflow-hidden w-full rounded-t-lg bg-background"
				style={{ tableLayout: 'fixed' }}
			>
				<thead
					className={`border-b bg-surface-2 border-primary-4/30 ${headerClassName}`}
				>
					<tr>
						{columns.map((column, colIndex) => (
							<SortableColumn
								key={column.key ? String(column.key) : `col-${colIndex}`}
								column={column}
								colIndex={colIndex}
								totalColumns={columns.length}
								sortState={sortState}
								onSort={onSort}
								isRTL={isRTL}
							/>
						))}
					</tr>
				</thead>
			</table>
		</div>
	);
}; 