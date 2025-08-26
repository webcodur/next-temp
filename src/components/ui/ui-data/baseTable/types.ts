import { ReactNode } from 'react';

// #region 컬럼 및 테이블 구성
export interface BaseTableColumn<T> {
	key?: keyof T | string;
	header: string;
	minWidth: string;
	align?: 'start' | 'center' | 'end';
	type?: 'text' | 'date' | 'datetime' | 'id';
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
	getRowClassName?: string | ((item: T, index: number) => string);
	cellClassName?: string;
	pageSize?: number;
	loadingRows?: number;
	onRowClick?: (item: T, index: number) => void;
}
// #endregion 