import { SmartTableColumn } from '@/components/ui/ui-data/smartTable/SmartTable';

// 데이터 테이블 메인 컴포넌트 props 타입
export interface DataTableProps<T = Record<string, unknown>> {
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
	showPagination?: boolean;
}
