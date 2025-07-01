import React from 'react';
import {
	ChevronsLeft,
	ChevronLeft,
	ChevronRight,
	ChevronsRight,
} from 'lucide-react';
import { PaginationNavigation } from './pagination.types';

interface PaginationControlsProps extends PaginationNavigation {
	currentPage: number;
	totalPages: number;
	disabled: boolean;
	onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
	pageNumbers,
	startPage,
	endPage,
	currentPage,
	totalPages,
	disabled,
	onPageChange,
	goToFirstPage,
	goToPreviousGroup,
	goToNextGroup,
	goToLastPage,
}) => {
	return (
		<nav className="flex items-center gap-1">
			{/* 첫 페이지 버튼 */}
			<button
				onClick={goToFirstPage}
				disabled={currentPage === 1 || disabled}
				className={`p-2 rounded-md cursor-pointer ${
					currentPage === 1 || disabled
						? 'text-muted-foreground cursor-not-allowed'
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
						? 'text-muted-foreground cursor-not-allowed'
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
								? 'bg-primary text-primary-foreground'
								: disabled
									? 'text-muted-foreground cursor-not-allowed'
									: 'text-foreground neu-raised'
						}`}
						aria-current={pageNumber === currentPage ? 'page' : undefined}>
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
						? 'text-muted-foreground cursor-not-allowed'
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
						? 'text-muted-foreground cursor-not-allowed'
						: 'text-foreground neu-raised'
				}`}
				aria-label="마지막 페이지로 이동">
				<ChevronsRight size={14} />
			</button>
		</nav>
	);
};
