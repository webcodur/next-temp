import { useMemo } from 'react';
import { calculatePageRange, generatePageNumbers } from './paginationUtils';
import { PaginationNavigation } from './pagination.types';

interface UsePaginationNavigationProps {
	currentPage: number;
	totalPages: number;
	groupSize: number;
	onPageChange: (page: number) => void;
}

export const usePaginationNavigation = ({
	currentPage,
	totalPages,
	groupSize,
	onPageChange,
}: UsePaginationNavigationProps): PaginationNavigation => {
	// 페이지 그룹 계산
	const { startPage, endPage, currentGroup } = useMemo(
		() => calculatePageRange(currentPage, groupSize, totalPages),
		[currentPage, groupSize, totalPages]
	);

	// 페이지 번호 배열 생성
	const pageNumbers = useMemo(
		() => generatePageNumbers(startPage, endPage),
		[startPage, endPage]
	);

	// 네비게이션 핸들러들
	const goToFirstPage = () => {
		if (currentPage !== 1) {
			onPageChange(1);
		}
	};

	const goToPreviousGroup = () => {
		if (startPage > 1) {
			const previousGroupLastPage = startPage - 1;
			onPageChange(previousGroupLastPage);
		}
	};

	const goToNextGroup = () => {
		if (endPage < totalPages) {
			const nextGroupFirstPage = endPage + 1;
			onPageChange(nextGroupFirstPage);
		}
	};

	const goToLastPage = () => {
		if (currentPage !== totalPages) {
			onPageChange(totalPages);
		}
	};

	return {
		pageNumbers,
		startPage,
		endPage,
		currentGroup,
		goToFirstPage,
		goToPreviousGroup,
		goToNextGroup,
		goToLastPage,
	};
};
