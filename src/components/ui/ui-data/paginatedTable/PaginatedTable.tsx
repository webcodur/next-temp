/* 
  파일명: /components/ui/ui-data/paginatedTable/PaginatedTable.tsx
  기능: 페이지네이션 테이블 컴포넌트 (A+y)
  책임: BaseTable + 페이지네이션 기능 조합
*/ // ------------------------------

'use client';

import React from 'react';
import { BaseTable } from '../baseTable/BaseTable';
import { usePaginationState } from '../shared/usePaginationState';
import { usePaginationData } from '../shared/usePaginationData';
import Pagination from '../pagination/unit/Pagination';
import { PaginatedTableProps } from './types';

const PaginatedTable = <T extends Record<string, unknown>>({
	// 페이지네이션 props
	currentPage: externalCurrentPage,
	pageSize: externalPageSize,
	onPageChange: externalOnPageChange,
	onPageSizeChange: externalOnPageSizeChange,
	pageSizeOptions = [5, 10, 20, 50],
	groupSize = 5,
	itemName = '항목',
	showPagination = true,
	showRowNumber = true,
	isFetching = false,

	// BaseTable props
	data,
	columns,
	className = '',
	headerClassName = '',
	getRowClassName = '',
	cellClassName = '',
	pageSize: basePageSize = 10,
	loadingRows = 5,
	onRowClick,
	minWidth,
}: PaginatedTableProps<T>) => {
	// #region 페이지네이션 상태 관리
	const paginationState = usePaginationState({
		currentPage: externalCurrentPage,
		pageSize: externalPageSize || basePageSize,
		onPageChange: externalOnPageChange,
		onPageSizeChange: externalOnPageSizeChange,
		defaultPageSize: externalPageSize || basePageSize,
	});

	const paginationData = usePaginationData({
		data,
		currentPage: paginationState.currentPage,
		pageSize: paginationState.pageSize,
		isFetching,
	});
	// #endregion

	// #region 순번 컬럼 생성
	const columnsWithRowNumber = showRowNumber ? [
		{
			header: '순번',
			width: '70px',
			align: 'center' as const,
			type: 'text' as const,
			headerClassName: 'w-[70px] min-w-[70px] max-w-[70px]',
			cellClassName: 'px-2 w-[70px] min-w-[70px] max-w-[70px]',
			cell: (_: T, index: number) => {
				const rowNumber = (paginationState.currentPage - 1) * paginationState.pageSize + index + 1;
				return (
					<span className="text-sm font-medium whitespace-nowrap text-muted-foreground">
						{rowNumber}
					</span>
				);
			},
		},
		...columns,
	] : columns;
	// #endregion

	// #region 렌더링
	return (
		<div className="p-4 space-y-6 rounded-lg border bg-card">
			{/* BaseTable 렌더링 */}
			<BaseTable
				data={paginationData.isInitialLoading ? null : paginationData.paginatedData}
				columns={columnsWithRowNumber}
				className={className}
				headerClassName={headerClassName}
				getRowClassName={getRowClassName}
				cellClassName={cellClassName}
				pageSize={paginationState.pageSize}
				loadingRows={loadingRows}
				onRowClick={onRowClick}
				minWidth={minWidth}
			/>

			{/* 추가 로딩 인디케이터 */}
			{paginationData.isAdditionalLoading && (
				<div className="flex justify-center py-3 border-t border-border">
					<div className="flex gap-2 items-center text-muted-foreground">
						<div className="w-4 h-4 rounded-full border-2 animate-spin border-border border-t-primary"></div>
						<span className="text-sm font-multilang">데이터 로딩 중...</span>
					</div>
				</div>
			)}

			{/* 페이지네이션 UI */}
			{showPagination && (
				<Pagination
					currentPage={paginationState.currentPage}
					totalPages={paginationData.totalPages}
					onPageChange={paginationState.onPageChange}
					pageSize={paginationState.pageSize}
					onPageSizeChange={externalOnPageSizeChange ? paginationState.onPageSizeChange : undefined}
					pageSizeOptions={pageSizeOptions}
					groupSize={groupSize}
					totalItems={paginationData.totalItems}
					itemName={itemName}
				/>
			)}
		</div>
	);
	// #endregion
};

export { PaginatedTable };
export type { PaginatedTableProps, BaseTableColumn } from './types'; 