import { ReactNode } from 'react';

// #region 기본 타입
export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
	key: string;
	direction: SortDirection;
}
// #endregion

// #region 컬럼 및 테이블 구성
export interface BaseTableColumn<T> {
	key?: keyof T | string;
	header: string;
	width?: string;
	align?: 'start' | 'center' | 'end';
	sortable?: boolean;
	render?: (value: T[keyof T], item: T, index: number) => ReactNode;
	cell?: (item: T, index: number) => ReactNode;
	headerClassName?: string;
	cellClassName?: string;
}

export interface BaseTableProps<T> {
	data: T[] | null;
	columns: BaseTableColumn<T>[];
	className?: string;
	headerClassName?: string;
	rowClassName?: string | ((item: T, index: number) => string);
	cellClassName?: string;
	pageSize?: number;
	loadingRows?: number;
	onRowClick?: (item: T, index: number) => void;
}
// #endregion

// #region 하위 컴포넌트 Props
export interface BaseTableHeaderProps<T> {
	columns: BaseTableColumn<T>[];
	sortState: SortState;
	onSort: (columnKey: string, sortable: boolean, actualKey?: string) => void;
	headerClassName?: string;
	isRTL: boolean;
}

export interface BaseTableBodyProps<T> {
	data: T[];
	columns: BaseTableColumn<T>[];
	isInitialLoading: boolean;
	pageSize: number;
	loadingRows: number;
	rowClassName?: string | ((item: T, index: number) => string);
	cellClassName?: string;
	onRowClick?: (item: T, index: number) => void;
	isRTL: boolean;
}
// #endregion 