import React from 'react';
import { BaseTableColumn } from '../../types';

interface LoadingRowsProps<T = unknown> {
	loadingRows: number;
	pageSize: number;
	columns: BaseTableColumn<T>[];
	cellClassName?: string;
}

export const LoadingRows = ({
	loadingRows,
	pageSize,
	columns,
	cellClassName = '',
}: LoadingRowsProps) => {
	const rowCount = Math.min(loadingRows, pageSize);
	
	return (
		<>
			{Array.from({ length: rowCount }, (_, index) => (
				<tr key={`loading-${index}`} className="animate-pulse">
					{columns.map((column, colIndex) => (
						<td
							key={`loading-${index}-${String(column.key)}`}
							className={`
								px-6 py-4 
								${colIndex < columns.length - 1 ? 'border-r border-primary-4/30' : ''}
								${cellClassName}
							`}
						>
							<div className="h-5 rounded bg-muted neu-flat"></div>
						</td>
					))}
				</tr>
			))}
		</>
	);
}; 