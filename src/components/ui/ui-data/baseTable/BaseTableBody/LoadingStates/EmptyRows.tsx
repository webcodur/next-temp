import React from 'react';
import { BaseTableColumn } from '../../types';

interface EmptyRowsProps<T = unknown> {
	columns: BaseTableColumn<T>[];
	cellClassName?: string;
}

export const EmptyRows = ({
	columns,
	cellClassName = '',
}: EmptyRowsProps) => {
	return (
		<tr>
			<td
				colSpan={columns.length}
				className={`px-6 py-12 text-center text-muted-foreground ${cellClassName}`}
			>
				표시할 데이터가 없습니다.
			</td>
		</tr>
	);
}; 