import React from 'react';
import {
	ChevronsLeft,
	ChevronLeft,
	ChevronRight,
	ChevronsRight,
} from 'lucide-react';
import { useLocale } from '@/hooks/ui-hooks/useI18n';

// #region 타입
interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	showFirstLast?: boolean;
	disabled?: boolean;
}
// #endregion

const PaginationControls: React.FC<PaginationControlsProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	showFirstLast = true,
	disabled = false,
}) => {
	// #region 훅
	const { isRTL } = useLocale();
	// #endregion

	// #region 핸들러 및 상수
	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages && !disabled) {
			onPageChange(page);
		}
	};

	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === totalPages;

	const buttonClasses = `
		flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md
		transition-all duration-200 neu-flat hover:neu-raised
		${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
	`;

	const disabledButtonClasses = `
		flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md
		opacity-50 cursor-not-allowed neu-flat
	`;
	// #endregion

	// #region 렌더링
	return (
		<div className="flex items-center space-x-2">
			{/* 첫 페이지 버튼 */}
			{showFirstLast && (
				<button
					onClick={() => handlePageChange(1)}
					disabled={disabled || isFirstPage}
					className={isFirstPage || disabled ? disabledButtonClasses : buttonClasses}
					aria-label="첫 번째 페이지로 이동"
				>
					{isRTL ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
				</button>
			)}

			{/* 이전 페이지 버튼 */}
			<button
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={disabled || isFirstPage}
				className={isFirstPage || disabled ? disabledButtonClasses : buttonClasses}
				aria-label="이전 페이지로 이동"
			>
				{isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
			</button>

			{/* 페이지 정보 */}
			<div className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground">
				<span className="font-multilang">
					{currentPage} / {totalPages}
				</span>
			</div>

			{/* 다음 페이지 버튼 */}
			<button
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={disabled || isLastPage}
				className={isLastPage || disabled ? disabledButtonClasses : buttonClasses}
				aria-label="다음 페이지로 이동"
			>
				{isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
			</button>

			{/* 마지막 페이지 버튼 */}
			{showFirstLast && (
				<button
					onClick={() => handlePageChange(totalPages)}
					disabled={disabled || isLastPage}
					className={isLastPage || disabled ? disabledButtonClasses : buttonClasses}
					aria-label="마지막 페이지로 이동"
				>
					{isRTL ? <ChevronsLeft size={14} /> : <ChevronsRight size={14} />}
				</button>
			)}
		</div>
	);
};

export default PaginationControls;
