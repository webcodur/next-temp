import { BaseTableProps, BaseTableColumn } from '../baseTable/types';

// #region 무한스크롤 관련 타입
export interface InfiniteScrollOptions {
	loadMore: () => void;
	hasMore: boolean;
	isLoadingMore?: boolean;
	threshold?: number;
}

export interface InfiniteTableProps<T> extends BaseTableProps<T> {
	loadMore: () => void;
	hasMore: boolean;
	isLoadingMore?: boolean;
	threshold?: number;
}
// #endregion

// BaseTable 타입들 재export
export type { BaseTableColumn }; 