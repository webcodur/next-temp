import React, { useState } from 'react';
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
	showFirstLast?: boolean;
	showPageNumbers?: boolean;
	disabled?: boolean;
	className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	showFirstLast = true,
	showPageNumbers = true,
	disabled = false,
	className = '',
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const { isRTL } = useLocale();

	const handlePageChange = async (page: number) => {
		if (page >= 1 && page <= totalPages && !disabled && !isLoading) {
			setIsLoading(true);
			try {
				await onPageChange(page);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === totalPages;

	const buttonClasses = `
		flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-md
		transition-all duration-200 neu-flat hover:neu-raised
		${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
	`;

	const disabledButtonClasses = `
		flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-md
		opacity-50 cursor-not-allowed neu-flat
	`;

	const currentPageClasses = `
		flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-md
		bg-primary text-primary-foreground neu-inset
	`;

	// 페이지 번호 범위 계산
	const getPageNumbers = () => {
		const delta = 2;
		const start = Math.max(1, currentPage - delta);
		const end = Math.min(totalPages, currentPage + delta);
		
		const pages = [];
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className={`flex items-center justify-center space-x-2 ${className}`}>
			{/* 첫 페이지 버튼 */}
			{showFirstLast && (
				<button
					onClick={() => handlePageChange(1)}
					disabled={disabled || isFirstPage || isLoading}
					className={isFirstPage || disabled || isLoading ? disabledButtonClasses : buttonClasses}
					aria-label="첫 번째 페이지로 이동"
				>
					{/* 로딩 중일 때 스피너 표시 */}
					{isLoading && currentPage === 1 ? (
						<div className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 start-1/2 top-1/2">
							<div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
						</div>
					) : (
						isRTL ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />
					)}
				</button>
			)}

			{/* 이전 페이지 버튼 */}
			<button
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={disabled || isFirstPage || isLoading}
				className={isFirstPage || disabled || isLoading ? disabledButtonClasses : buttonClasses}
				aria-label="이전 페이지로 이동"
			>
				{isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
			</button>

			{/* 페이지 번호 버튼들 */}
			{showPageNumbers && (
				<>
					{pageNumbers.map((page) => (
						<button
							key={page}
							onClick={() => handlePageChange(page)}
							disabled={disabled || isLoading}
							className={
								page === currentPage
									? currentPageClasses
									: disabled || isLoading
									? disabledButtonClasses
									: buttonClasses
							}
							aria-current={page === currentPage ? 'page' : undefined}
						>
							{page}
						</button>
					))}
				</>
			)}

			{/* 다음 페이지 버튼 */}
			<button
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={disabled || isLastPage || isLoading}
				className={isLastPage || disabled || isLoading ? disabledButtonClasses : buttonClasses}
				aria-label="다음 페이지로 이동"
			>
				{isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
			</button>

			{/* 마지막 페이지 버튼 */}
			{showFirstLast && (
				<button
					onClick={() => handlePageChange(totalPages)}
					disabled={disabled || isLastPage || isLoading}
					className={isLastPage || disabled || isLoading ? disabledButtonClasses : buttonClasses}
					aria-label="마지막 페이지로 이동"
				>
					{isRTL ? <ChevronsLeft size={14} /> : <ChevronsRight size={14} />}
				</button>
			)}
		</div>
	);
};

export default Pagination;
