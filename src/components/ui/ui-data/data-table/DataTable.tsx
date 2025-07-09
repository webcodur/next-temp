'use client';

import React from 'react';
import { SmartTable } from '@/components/ui/ui-data/smartTable/SmartTable';
import { DataTableProps } from './data-table.types';
import { usePaginationState } from './usePaginationState';
import { usePaginationData } from './usePaginationData';
import Pagination from '../pagination/unit/Pagination';

const DataTable = <T extends Record<string, unknown>>({
	// 테이블 props
	data,
	columns,
	className,
	rowClassName,
	isFetching = false,

	// 페이지네이션 props
	currentPage: externalCurrentPage,
	pageSize: externalPageSize,
	onPageChange: externalOnPageChange,
	onPageSizeChange: externalOnPageSizeChange,
	pageSizeOptions = [5, 10, 20, 50],
	groupSize = 5,
	itemName = '항목',
	showPagination = true,
}: DataTableProps<T>) => {
  
	// 커스텀 훅들 사용
	const paginationState = usePaginationState({
		currentPage: externalCurrentPage,
		pageSize: externalPageSize,
		onPageChange: externalOnPageChange,
		onPageSizeChange: externalOnPageSizeChange,
		defaultPageSize: externalPageSize || 10,
	});

	const paginationData = usePaginationData({
		data,
		currentPage: paginationState.currentPage,
		pageSize: paginationState.pageSize,
		isFetching,
	});

	// 페이지네이션 표시 여부 결정
	// showPagination이 false로 명시된 경우를 제외하고 항상 페이지네이션을 표시한다.
	const shouldShowPagination = showPagination;

	return (
		<div>
			{/* 테이블 렌더링 */}
			<SmartTable
				data={paginationData.isLoading ? null : paginationData.paginatedData}
				columns={columns}
				className={className}
				rowClassName={rowClassName}
				pageSize={paginationState.pageSize}
			/>

			{/* 페이지네이션 UI */}
			{shouldShowPagination && (
				<div className="mt-6">
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
				</div>
			)}
		</div>
	);
};

export default DataTable;
