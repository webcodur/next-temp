import React, { useState, useMemo } from 'react';
import {
	SmartTable,
	SmartTableColumn,
} from '@/components/ui/ui-data/smartTable/SmartTable';
import {
	ChevronsLeft,
	ChevronLeft,
	ChevronRight,
	ChevronsRight,
} from 'lucide-react';

interface PaginationProps<T = Record<string, unknown>> {
	// 테이블 관련 props
	data: T[] | null | undefined;
	columns: SmartTableColumn<T>[];
	className?: string;
	rowClassName?: string | ((item: T, index: number) => string);
	isFetching?: boolean;

	// 페이지네이션 관련 props
	currentPage?: number;
	pageSize?: number;
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (size: number) => void;
	pageSizeOptions?: number[];
	groupSize?: number;
	itemName?: string;
	disabled?: boolean;
	disablePageSizeChange?: boolean;
	showPagination?: boolean;
}

const Pagination = <T extends Record<string, unknown>>({
	// 테이블 props
	data,
	columns,
	className,
	rowClassName,
	isFetching = false,

	// 페이지네이션 props
	currentPage: externalCurrentPage,
	pageSize: externalPageSize = 10,
	onPageChange: externalOnPageChange,
	onPageSizeChange: externalOnPageSizeChange,
	pageSizeOptions = [5, 10, 20, 50],
	groupSize = 5,
	itemName = '항목',
	disabled = false,
	disablePageSizeChange = false,
	showPagination = true,
}: PaginationProps<T>) => {
	// 내부 상태 관리 (외부에서 제어하지 않는 경우)
	const [internalCurrentPage, setInternalCurrentPage] = useState(1);
	const [internalPageSize, setInternalPageSize] = useState(externalPageSize);

	// 실제 사용할 값들 (외부 제어 우선)
	const currentPage = externalCurrentPage ?? internalCurrentPage;
	const pageSize = externalPageSize ?? internalPageSize;
	const onPageChange = externalOnPageChange ?? setInternalCurrentPage;
	const onPageSizeChange = externalOnPageSizeChange ?? setInternalPageSize;

	// 로딩 상태 및 실제 데이터
	const isLoading = isFetching || data === undefined || data === null;
	const actualData = useMemo(() => (isLoading ? [] : data), [isLoading, data]);

	// 페이지네이션 계산
	const totalItems = actualData.length;
	const totalPages = Math.ceil(totalItems / pageSize);

	// 현재 페이지의 데이터 슬라이싱
	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		return actualData.slice(startIndex, endIndex);
	}, [actualData, currentPage, pageSize]);

	// #region 페이지 계산 로직
	const currentGroup = Math.ceil(currentPage / groupSize);
	const startPage = (currentGroup - 1) * groupSize + 1;
	const endPage = Math.min(startPage + groupSize - 1, totalPages);

	const pageNumbers: number[] = [];
	for (let i = startPage; i <= endPage; i++) {
		pageNumbers.push(i);
	}
	// #endregion

	// #region 이벤트 핸들러
	const goToFirstPage = () => {
		if (currentPage !== 1 && !disabled) onPageChange(1);
	};

	const goToPreviousGroup = () => {
		if (startPage > 1 && !disabled) {
			const previousGroupLastPage = startPage - 1;
			onPageChange(previousGroupLastPage);
		}
	};

	const goToNextGroup = () => {
		if (endPage < totalPages && !disabled) {
			const nextGroupFirstPage = endPage + 1;
			onPageChange(nextGroupFirstPage);
		}
	};

	const goToLastPage = () => {
		if (currentPage !== totalPages && !disabled) onPageChange(totalPages);
	};

	const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newSize = Number(e.target.value);
		if (!disabled && !disablePageSizeChange) {
			onPageSizeChange(newSize);
			// 페이지 크기 변경 시 첫 페이지로 이동
			onPageChange(1);
		}
	};
	// #endregion

	// 페이지네이션 표시 여부 결정
	const shouldShowPagination =
		showPagination && (totalPages > 1 || externalOnPageSizeChange);

	return (
		<div>
			{/* 테이블 렌더링 */}
			<SmartTable
				data={isLoading ? null : paginatedData}
				columns={columns}
				className={className}
				rowClassName={rowClassName}
				pageSize={pageSize}
				isFetching={isFetching}
			/>

			{/* 페이지네이션 UI */}
			{shouldShowPagination && (
				<div className="mt-6 text-foreground">
					{/* 좌우 정보 영역을 위한 기본 레이아웃 - 높이만 차지 */}
					<div className="flex items-center justify-between min-h-[36px] relative">
						{/* 왼쪽 정보 표시 */}
						<div className="shrink-0">
							{totalItems > 0 && (
								<div className="text-muted-foreground text-sm">
									총 {totalItems}개의 {itemName} 중{' '}
									{(currentPage - 1) * pageSize + 1}-
									{Math.min(currentPage * pageSize, totalItems)}개 표시
								</div>
							)}
						</div>

						{/* 오른쪽 페이지 크기 선택 */}
						<div className="shrink-0">
							{(externalOnPageSizeChange || !externalCurrentPage) && (
								<div className="flex items-center text-sm">
									<span className="me-2">페이지당 항목:</span>
									<select
										value={pageSize}
										onChange={handlePageSizeChange}
										disabled={disabled || disablePageSizeChange}
										className={`bg-background cursor-pointer border border-border text-foreground rounded-md py-1 focus:border-brand focus:ring-1 focus:ring-brand m-0 p-0 ${
											disabled || disablePageSizeChange
												? 'opacity-50 cursor-not-allowed'
												: ''
										}`}>
										{pageSizeOptions.map((size) => (
											<option
												key={size}
												value={size}
												className="cursor-pointer">
												{size}
											</option>
										))}
									</select>
								</div>
							)}
						</div>

						{/* 중앙 페이지네이션 버튼들 - 완전히 독립적인 절대 중앙 고정 */}
						<div className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
							<nav className="flex items-center gap-1">
								{/* 첫 페이지 버튼 */}
								<button
									onClick={goToFirstPage}
									disabled={currentPage === 1 || disabled}
									className={`p-2 rounded-md cursor-pointer ${
										currentPage === 1 || disabled
											? 'text-muted-foreground/50 cursor-not-allowed'
											: 'text-foreground neu-raised'
									}`}
									aria-label="첫 페이지로 이동">
									<ChevronsLeft size={14} />
								</button>

								{/* 이전 그룹 버튼 */}
								<button
									onClick={goToPreviousGroup}
									disabled={startPage === 1 || disabled}
									className={`p-2 rounded-md cursor-pointer ${
										startPage === 1 || disabled
											? 'text-muted-foreground/50 cursor-not-allowed'
											: 'text-foreground neu-raised'
									}`}
									aria-label="이전 그룹으로 이동">
									<ChevronLeft size={14} />
								</button>

								{/* 페이지 번호 버튼 그룹 */}
								<div className="flex items-center gap-1 mx-1">
									{pageNumbers.map((pageNumber) => (
										<button
											key={pageNumber}
											onClick={() => !disabled && onPageChange(pageNumber)}
											disabled={disabled}
											className={`min-w-[36px] h-9 px-3 rounded-md cursor-pointer ${
												pageNumber === currentPage
													? 'bg-brand text-brand-foreground'
													: disabled
														? 'text-muted-foreground/50 cursor-not-allowed'
														: 'text-foreground neu-raised'
											}`}
											aria-current={
												pageNumber === currentPage ? 'page' : undefined
											}>
											{pageNumber}
										</button>
									))}
								</div>

								{/* 다음 그룹 버튼 */}
								<button
									onClick={goToNextGroup}
									disabled={endPage === totalPages || disabled}
									className={`p-2 rounded-md cursor-pointer ${
										endPage === totalPages || disabled
											? 'text-muted-foreground/50 cursor-not-allowed'
											: 'text-foreground neu-raised'
									}`}
									aria-label="다음 그룹으로 이동">
									<ChevronRight size={14} />
								</button>

								{/* 마지막 페이지 버튼 */}
								<button
									onClick={goToLastPage}
									disabled={currentPage === totalPages || disabled}
									className={`p-2 rounded-md cursor-pointer ${
										currentPage === totalPages || disabled
											? 'text-muted-foreground/50 cursor-not-allowed'
											: 'text-foreground neu-raised'
									}`}
									aria-label="마지막 페이지로 이동">
									<ChevronsRight size={14} />
								</button>
							</nav>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Pagination;
