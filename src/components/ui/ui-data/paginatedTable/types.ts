import { BaseTableProps, BaseTableColumn } from '../baseTable/types';

// #region 페이지네이션 관련 타입
export interface PaginationOptions {
	currentPage?: number;
	pageSize?: number;
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (size: number) => void;
	pageSizeOptions?: number[];
	groupSize?: number;
	itemName?: string;
	showPagination?: boolean;
}

export interface PaginatedTableProps<T> extends BaseTableProps<T> {
	// 페이지네이션 관련 props
	currentPage?: number;
	pageSize?: number;
	onPageChange?: (page: number) => void;
	onPageSizeChange?: (size: number) => void;
	pageSizeOptions?: number[];
	groupSize?: number;
	itemName?: string;
	showPagination?: boolean;
	isFetching?: boolean;
}
// #endregion

// BaseTable 타입들 재export
export type { BaseTableColumn }; 