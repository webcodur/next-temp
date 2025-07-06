// 페이지네이션 설정 타입
export interface PaginationConfig {
	pageSize?: number;
	pageSizeOptions?: number[];
	groupSize?: number;
	itemName?: string;
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
