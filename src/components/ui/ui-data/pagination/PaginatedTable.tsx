import React from 'react';
import { SmartTable } from '@/components/ui/ui-data/smartTable/SmartTable';
import { PaginatedTableProps } from './pagination.types';
import { usePaginationState } from './usePaginationState';
import { usePaginationData } from './usePaginationData';
import { usePaginationNavigation } from './usePaginationNavigation';
import { PaginationInfo } from './PaginationInfo';
import PaginationControls from './PaginationControls';
import { PageSizeSelector } from './PageSizeSelector';

const PaginatedTable = <T extends Record<string, unknown>>({
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
	disabled = false,
	showPagination = true,
}: PaginatedTableProps<T>) => {
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

	const navigation = usePaginationNavigation({
		currentPage: paginationState.currentPage,
		totalPages: paginationData.totalPages,
		groupSize,
		disabled,
		onPageChange: paginationState.onPageChange,
	});

	// 페이지네이션 표시 여부 결정
	const shouldShowPagination =
		showPagination &&
		(paginationData.totalPages > 1 || externalOnPageSizeChange);

	// 페이지 크기 선택기 표시 여부
	const showPageSizeSelector = !!(
		externalOnPageSizeChange || !externalCurrentPage
	);

	return (
		<div>
			{/* 테이블 렌더링 */}
			<SmartTable
				data={paginationData.isLoading ? null : paginationData.paginatedData}
				columns={columns}
				className={className}
				rowClassName={rowClassName}
				pageSize={paginationState.pageSize}
				isFetching={isFetching}
			/>

			{/* 페이지네이션 UI */}
			{shouldShowPagination && (
				<div className="mt-6 text-foreground">
					<div className="flex items-center justify-between">
						<PaginationInfo
							totalItems={paginationData.totalItems}
							currentPage={paginationState.currentPage}
							pageSize={paginationState.pageSize}
							itemName={itemName}
						/>

						<PaginationControls
							{...navigation}
							currentPage={paginationState.currentPage}
							totalPages={paginationData.totalPages}
							disabled={disabled}
							onPageChange={paginationState.onPageChange}
						/>

						<PageSizeSelector
							pageSize={paginationState.pageSize}
							pageSizeOptions={pageSizeOptions}
							onPageSizeChange={paginationState.onPageSizeChange}
							onPageChange={paginationState.onPageChange}
							disabled={disabled}
							showSelector={showPageSizeSelector}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default PaginatedTable;
