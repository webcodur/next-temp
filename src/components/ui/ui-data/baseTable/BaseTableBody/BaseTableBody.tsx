import React from 'react';
import { BaseTableBodyProps, BaseTableColumn } from '../types';
import { TableRow } from './TableRow/TableRow';
import { LoadingRows } from './LoadingStates/LoadingRows';
import { EmptyRows } from './LoadingStates/EmptyRows';

export const BaseTableBody = <T extends Record<string, unknown>>({
	data,
	columns,
	isInitialLoading,
	pageSize,
	loadingRows,
	rowClassName = '',
	cellClassName = '',
	onRowClick,
	isRTL,
}: BaseTableBodyProps<T>) => {
	// 투명한 헤더로 컬럼 너비 유지
	const renderInvisibleHeader = () => (
		<thead className="opacity-0 pointer-events-none" style={{ height: 0, overflow: 'hidden' }}>
			<tr style={{ height: 0 }}>
				{columns.map((column, colIndex) => (
					<th
						key={`invisible-${colIndex}`}
						className="relative px-2 py-0"
						style={{ 
							width: column.width,
							height: 0,
							overflow: 'hidden'
						}}
					>
						<span className="block text-base font-multilang" style={{ position: 'absolute', top: '-9999px' }}>
							{column.header}
						</span>
					</th>
				))}
			</tr>
		</thead>
	);

	return (
		<div className="overflow-auto scrollbar-gutter-stable">
			<table
				className="overflow-hidden w-full rounded-b-lg bg-background"
				style={{ tableLayout: 'fixed', borderSpacing: 0, borderCollapse: 'separate' }}
			>
				{renderInvisibleHeader()}

				<tbody className="divide-y bg-background divide-border">
					{isInitialLoading ? (
						<LoadingRows
							loadingRows={loadingRows}
							pageSize={pageSize}
							columns={columns as BaseTableColumn<unknown>[]}
							cellClassName={cellClassName}
						/>
					) : data.length === 0 ? (
						<EmptyRows
							columns={columns as BaseTableColumn<unknown>[]}
							cellClassName={cellClassName}
						/>
					) : (
						data.map((item, index) => (
							<TableRow
								key={index}
								item={item}
								index={index}
								columns={columns}
								totalLength={data.length}
								rowClassName={rowClassName}
								cellClassName={cellClassName}
								onRowClick={onRowClick}
								isRTL={isRTL}
							/>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}; 