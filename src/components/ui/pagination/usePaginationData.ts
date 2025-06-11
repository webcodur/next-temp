import { useMemo } from 'react';
import { calculateTotalPages, sliceDataForPage } from './paginationUtils';

interface UsePaginationDataProps<T> {
	data: T[] | null | undefined;
	currentPage: number;
	pageSize: number;
	isFetching?: boolean;
}

interface UsePaginationDataReturn<T> {
	paginatedData: T[];
	totalItems: number;
	totalPages: number;
	isLoading: boolean;
	actualData: T[];
}

export const usePaginationData = <T>({
	data,
	currentPage,
	pageSize,
	isFetching = false,
}: UsePaginationDataProps<T>): UsePaginationDataReturn<T> => {
	// 로딩 상태 결정
	const isLoading = isFetching || data === undefined || data === null;
	
	// 실제 데이터 (로딩 중이면 빈 배열)
	const actualData = useMemo(() => isLoading ? [] : data, [isLoading, data]);
	
	// 페이지네이션 계산
	const totalItems = actualData.length;
	const totalPages = calculateTotalPages(totalItems, pageSize);

	// 현재 페이지의 데이터 슬라이싱
	const paginatedData = useMemo(() => {
		return sliceDataForPage(actualData, currentPage, pageSize);
	}, [actualData, currentPage, pageSize]);

	return {
		paginatedData,
		totalItems,
		totalPages,
		isLoading,
		actualData,
	};
}; 