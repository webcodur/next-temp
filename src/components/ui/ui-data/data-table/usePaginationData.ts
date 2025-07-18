import { useMemo } from 'react';
import {
	calculateTotalPages,
	sliceDataForPage,
} from '../pagination/shared/paginationUtils';

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
	isInitialLoading: boolean;
	isAdditionalLoading: boolean;
	actualData: T[];
}

export const usePaginationData = <T>({
	data,
	currentPage,
	pageSize,
	isFetching = false,
}: UsePaginationDataProps<T>): UsePaginationDataReturn<T> => {
	// 로딩 상태 구분
	const isInitialLoading = data === undefined || data === null;
	const isAdditionalLoading = isFetching && !isInitialLoading;

	// 실제 데이터 (초기 로딩 중이면 빈 배열)
	const actualData = useMemo(
		() => (isInitialLoading ? [] : data),
		[isInitialLoading, data]
	);

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
		isInitialLoading,
		isAdditionalLoading,
		actualData,
	};
};
