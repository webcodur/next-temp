import { SmartTableColumn } from '@/components/ui/smartTable/SmartTable';

// 페이지네이션 설정 타입
export interface PaginationConfig {
	pageSize?: number;
	pageSizeOptions?: number[];
	groupSize?: number;
	itemName?: string;
	disabled?: boolean;
	showPagination?: boolean;
}

// 페이지네이션 상태 타입
export interface PaginationState {
	currentPage: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}

// 페이지네이션 핸들러 타입
export interface PaginationHandlers {
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

// 외부 제어 props 타입
export interface ExternalPaginationProps {
	currentPage?: number;
	pageSize?: number;
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (size: number) => void;
}

// 네비게이션 관련 타입
export interface PaginationNavigation {
	pageNumbers: number[];
	startPage: number;
	endPage: number;
	currentGroup: number;
	goToFirstPage: () => void;
	goToPreviousGroup: () => void;
	goToNextGroup: () => void;
	goToLastPage: () => void;
}

// 메인 컴포넌트 props 타입
export interface PaginatedTableProps<T = Record<string, unknown>> {
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
	showPagination?: boolean;
}
