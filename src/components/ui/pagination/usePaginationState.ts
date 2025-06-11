import { useState } from 'react';
import { ExternalPaginationProps, PaginationHandlers } from './pagination.types';

interface UsePaginationStateProps extends ExternalPaginationProps {
	defaultPageSize?: number;
}

interface UsePaginationStateReturn extends PaginationHandlers {
	currentPage: number;
	pageSize: number;
}

export const usePaginationState = ({
	currentPage: externalCurrentPage,
	pageSize: externalPageSize,
	onPageChange: externalOnPageChange,
	onPageSizeChange: externalOnPageSizeChange,
	defaultPageSize = 10,
}: UsePaginationStateProps = {}): UsePaginationStateReturn => {
	// 내부 상태 관리
	const [internalCurrentPage, setInternalCurrentPage] = useState(1);
	const [internalPageSize, setInternalPageSize] = useState(externalPageSize ?? defaultPageSize);

	// 실제 사용할 값들 (외부 제어 우선)
	const currentPage = externalCurrentPage ?? internalCurrentPage;
	const pageSize = externalPageSize ?? internalPageSize;

	// 핸들러 (외부 제어 우선)
	const onPageChange = externalOnPageChange ?? setInternalCurrentPage;
	const onPageSizeChange = externalOnPageSizeChange ?? setInternalPageSize;

	return {
		currentPage,
		pageSize,
		onPageChange,
		onPageSizeChange,
	};
}; 