import React from 'react';
import {
	ChevronsLeft,
	ChevronLeft,
	ChevronRight,
	ChevronsRight,
} from 'lucide-react';
import { useLocale } from '@/hooks/useI18n';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	pageSize: number;
	onPageSizeChange?: (size: number) => void;
	pageSizeOptions?: number[];
	groupSize?: number;
	totalItems?: number;
	itemName?: string;
	className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	pageSize,
	onPageSizeChange,
	pageSizeOptions = [5, 10, 20, 50],
	groupSize = 5,
	totalItems,
	itemName = "항목",
	className = '',
}) => {
	const { isRTL } = useLocale();

	// 현재 페이지가 속한 그룹의 시작 페이지와 끝 페이지 계산
	const currentGroup = Math.ceil(currentPage / groupSize);
	const startPage = (currentGroup - 1) * groupSize + 1;
	const endPage = Math.min(startPage + groupSize - 1, totalPages);

	// 페이지 번호 배열 생성
	const pageNumbers: number[] = [];
	for (let i = startPage; i <= endPage; i++) {
		pageNumbers.push(i);
	}

	// 첫 페이지로 이동
	const goToFirstPage = () => {
		if (currentPage !== 1) onPageChange(1);
	};

	// 이전 그룹으로 이동
	const goToPreviousGroup = () => {
		if (startPage > 1) {
			const previousGroupLastPage = startPage - 1;
			onPageChange(previousGroupLastPage);
		}
	};

	// 다음 그룹으로 이동
	const goToNextGroup = () => {
		if (endPage < totalPages) {
			const nextGroupFirstPage = endPage + 1;
			onPageChange(nextGroupFirstPage);
		}
	};

	// 마지막 페이지로 이동
	const goToLastPage = () => {
		if (currentPage !== totalPages) onPageChange(totalPages);
	};

	// 페이지 크기 변경 핸들러
	const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newSize = Number(e.target.value);
		if (onPageSizeChange) {
			onPageSizeChange(newSize);
		}
	};

	// 꺽쇠 버튼용 - elevated 스타일
	const arrowButtonClasses = `
		flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-md
		neu-elevated cursor-pointer
	`;

	const arrowDisabledButtonClasses = `
		flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-md
		opacity-50 cursor-not-allowed neu-elevated
	`;

	// 페이지 번호 버튼용 - raised 스타일
	const pageButtonClasses = `
		flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-md
		neu-raised cursor-pointer
	`;

	const currentPageClasses = `
		flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-md
		bg-muted text-primary neu-inset
	`;

	if (totalPages <= 1 && !onPageSizeChange) return null;

	return (
		<div className={`flex justify-between items-center ${className}`}>
			{/* 왼쪽: 총 항목 수 표시 */}
			<div className="flex-1">
				{typeof totalItems === 'number' && totalItems > 0 && (
					<div className="text-sm text-muted-foreground font-multilang">
						총 {totalItems}개의 {itemName} 중 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)}개 표시
					</div>
				)}
			</div>

			{/* 가운데: 페이지네이션 컨트롤 */}
			<nav className="flex gap-1 items-center">
				{/* 첫 페이지 버튼 */}
				<button
					onClick={goToFirstPage}
					disabled={currentPage === 1}
					className={currentPage === 1 ? arrowDisabledButtonClasses : arrowButtonClasses}
					aria-label="첫 페이지로 이동">
					{isRTL ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
				</button>

				{/* 이전 그룹 버튼 */}
				<button
					onClick={goToPreviousGroup}
					disabled={startPage === 1}
					className={startPage === 1 ? arrowDisabledButtonClasses : arrowButtonClasses}
					aria-label="이전 그룹으로 이동">
					{isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
				</button>

				{/* 페이지 번호 버튼 그룹 */}
				<div className="flex gap-1 items-center mx-1">
					{pageNumbers.map((pageNumber) => (
						<button
							key={pageNumber}
							onClick={() => onPageChange(pageNumber)}
							className={
								pageNumber === currentPage
									? currentPageClasses
									: pageButtonClasses
							}
							aria-current={pageNumber === currentPage ? 'page' : undefined}>
							{pageNumber}
						</button>
					))}
				</div>

				{/* 다음 그룹 버튼 */}
				<button
					onClick={goToNextGroup}
					disabled={endPage === totalPages}
					className={endPage === totalPages ? arrowDisabledButtonClasses : arrowButtonClasses}
					aria-label="다음 그룹으로 이동">
					{isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
				</button>

				{/* 마지막 페이지 버튼 */}
				<button
					onClick={goToLastPage}
					disabled={currentPage === totalPages}
					className={currentPage === totalPages ? arrowDisabledButtonClasses : arrowButtonClasses}
					aria-label="마지막 페이지로 이동">
					{isRTL ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
				</button>
			</nav>

			{/* 우측: 페이지 크기 선택기 */}
			<div className="flex flex-1 justify-end">
				{onPageSizeChange && (
					<div className="flex gap-2 items-center text-sm font-multilang">
						<span>페이지당 항목:</span>
						<select
							value={pageSize}
							onChange={handlePageSizeChange}
							className="px-2 py-1 rounded-md border cursor-pointer border-border bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary">
							{pageSizeOptions.map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</div>
				)}
			</div>
		</div>
	);
};

export default Pagination;
