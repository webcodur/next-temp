import React from 'react';
import {
	ChevronsLeft,
	ChevronLeft,
	ChevronRight,
	ChevronsRight,
} from 'lucide-react';
import { useLocale } from '@/hooks/ui-hooks/useI18n';

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
	colorVariant?: 'primary' | 'secondary';
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
	colorVariant = 'primary',
	className = '',
}) => {
	const { isRTL } = useLocale();

	// 데이터 존재 여부
	const noData = !totalItems || totalItems === 0 || totalPages === 0;

	// 현재 페이지가 속한 그룹의 시작 페이지와 끝 페이지 계산
	const currentGroup = Math.ceil(currentPage / groupSize);
	const startPage = (currentGroup - 1) * groupSize + 1;
	const endPage = Math.min(startPage + groupSize - 1, Math.max(totalPages, 1));

	// 페이지 번호 배열 생성 (데이터가 없으면 기본으로 [1]을 표시)
	const pageNumbers: number[] = [];
	for (let i = startPage; i <= endPage; i++) {
		pageNumbers.push(i);
	}
	if (noData && pageNumbers.length === 0) pageNumbers.push(1);

	// 첫 페이지로 이동
	const goToFirstPage = () => {
		if (noData) return;
		if (currentPage !== 1) onPageChange(1);
	};

	// 이전 그룹으로 이동
	const goToPreviousGroup = () => {
		if (noData) return;
		if (startPage > 1) {
			const previousGroupLastPage = startPage - 1;
			onPageChange(previousGroupLastPage);
		}
	};

	// 다음 그룹으로 이동
	const goToNextGroup = () => {
		if (noData) return;
		if (endPage < totalPages) {
			const nextGroupFirstPage = endPage + 1;
			onPageChange(nextGroupFirstPage);
		}
	};

	// 마지막 페이지로 이동
	const goToLastPage = () => {
		if (noData) return;
		if (currentPage !== totalPages) onPageChange(totalPages);
	};

	// 페이지 크기 변경 핸들러
	const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newSize = Number(e.target.value);
		if (onPageSizeChange) {
			onPageSizeChange(newSize);
		}
	};

	// 페이지 이동 입력 핸들러
	const [pageInput, setPageInput] = React.useState<string>('');
	
	const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 1)) {
			setPageInput(value);
		}
	};

	const handlePageInputSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const page = parseInt(pageInput);
		if (!isNaN(page) && page >= 1 && page <= totalPages && !noData) {
			onPageChange(page);
			setPageInput('');
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

	// 색상 variant에 따른 스타일
	const colorStyles = {
		text: colorVariant === 'primary' ? 'text-primary' : 'text-secondary',
		border: colorVariant === 'primary' ? 'focus:border-primary' : 'focus:border-secondary',
		ring: colorVariant === 'primary' ? 'focus:ring-primary' : 'focus:ring-secondary',
	};

	const currentPageClasses = `
		flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-md
		bg-muted ${colorStyles.text} neu-inset
	`;

	// 데이터가 없더라도 UI skeleton을 유지하기 위해 렌더링은 계속한다.

	return (
		<div className={`flex justify-between items-center ${className}`}>
			{/* 왼쪽: 페이지 이동 입력 */}
			<div className="flex-1 text-start">
				<form onSubmit={handlePageInputSubmit} className="flex gap-2 items-center text-sm text-muted-foreground font-multilang">
					<input
						type="text"
						value={pageInput}
						onChange={handlePageInputChange}
						placeholder="페이지"
						disabled={noData}
						className={`
							w-16 h-8 px-2 text-center text-sm rounded-md border
							border-border bg-background text-foreground
							${colorStyles.border} focus:ring-1 ${colorStyles.ring}
							disabled:opacity-50 disabled:cursor-not-allowed
						`}
					/>
					<span>페이지로 이동</span>
					{!noData && totalPages > 0 && (
						<span className="text-xs">
							(입장가능: 1-{totalPages})
						</span>
					)}
				</form>
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
							disabled={noData}
							onClick={() => !noData && onPageChange(pageNumber)}
							className={
								pageNumber === currentPage && !noData
									? currentPageClasses
									: pageButtonClasses + (noData ? ' opacity-50 cursor-not-allowed' : '')
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
				<div className="flex gap-2 items-center text-sm font-multilang">
					<span>페이지당 항목:</span>
					<select
						value={pageSize}
						disabled={noData || !onPageSizeChange}
						onChange={handlePageSizeChange}
						className={`px-2 py-1 rounded-md border cursor-pointer border-border bg-background text-foreground ${colorStyles.border} focus:ring-1 ${colorStyles.ring} disabled:opacity-50 disabled:cursor-not-allowed`}>
						{pageSizeOptions.map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
};

export default Pagination;
