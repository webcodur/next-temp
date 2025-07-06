'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from 'react';
import { useLocale } from '@/hooks/useI18n';

export interface SmartTableColumn<T> {
	key?: keyof T | string;
	header: string;
	width?: string;
	align?: 'start' | 'center' | 'end'; // left/right를 start/end로 변경
	sortable?: boolean;
	render?: (value: T[keyof T], item: T, index: number) => ReactNode;
	cell?: (item: T, index: number) => ReactNode;
	headerClassName?: string;
	cellClassName?: string;
}

interface SmartTableProps<T> {
	data: T[] | null;
	columns: SmartTableColumn<T>[];
	className?: string;
	headerClassName?: string;
	rowClassName?: string | ((item: T, index: number) => string);
	cellClassName?: string;
	isFetching?: boolean;
	pageSize?: number;
	emptyMessage?: string;
	loadingRows?: number;
}

const SmartTable = <T extends Record<string, any>>({
	data,
	columns,
	className = '',
	headerClassName = '',
	rowClassName = '',
	cellClassName = '',
	isFetching = false,
	pageSize = 10,
	emptyMessage = '데이터가 없습니다.',
	loadingRows = 5,
}: SmartTableProps<T>) => {
	const { isRTL } = useLocale();

	// 로딩 상태 처리
	const isLoading = isFetching || data === null;
	const actualData = isLoading ? [] : data;

	// 빈 로딩 행 생성
	const createLoadingRows = () => {
		return Array.from({ length: Math.min(loadingRows, pageSize) }, (_, index) => (
			<tr key={`loading-${index}`} className="animate-pulse">
				{columns.map((column) => (
					<td
						key={`loading-${index}-${String(column.key)}`}
						className={`px-6 py-4 ${cellClassName}`}
					>
						<div className="h-4 bg-muted rounded neu-flat"></div>
					</td>
				))}
			</tr>
		));
	};

	// 정렬 방향에 따른 클래스 반환 (RTL 고려)
	const getAlignmentClass = (align?: 'start' | 'center' | 'end') => {
		if (!align || align === 'start') {
			return isRTL ? 'text-end' : 'text-start';
		}
		if (align === 'end') {
			return isRTL ? 'text-start' : 'text-end';
		}
		return 'text-center';
	};

	// 행 클래스 이름 계산
	const getRowClassName = (item: T, index: number) => {
		if (typeof rowClassName === 'function') {
			return rowClassName(item, index);
		}
		return rowClassName;
	};

	return (
		<div className={`overflow-hidden neu-flat rounded-lg ${className}`}>
			<div className="overflow-x-auto">
				<table className="w-full bg-background">
					{/* 테이블 헤더 */}
					<thead className={`bg-muted/50 ${headerClassName}`}>
						<tr>
							{							columns.map((column, colIndex) => (
								<th
									key={column.key ? String(column.key) : `col-${colIndex}`}
									className={`
										px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider
										${getAlignmentClass(column.align)}
										${column.headerClassName || ''}
									`}
									style={{ width: column.width }}
								>
									{column.header}
								</th>
							))}
						</tr>
					</thead>

					{/* 테이블 바디 */}
					<tbody className="bg-background divide-y divide-border">
						{isLoading ? (
							createLoadingRows()
						) : actualData.length === 0 ? (
							<tr>
								<td
									colSpan={columns.length}
									className="px-6 py-12 text-center text-muted-foreground font-multilang"
								>
									{emptyMessage}
								</td>
							</tr>
						) : (
							actualData.map((item, index) => (
								<tr
									key={index}
									className={`
										hover:bg-muted/30 transition-colors
										${getRowClassName(item, index)}
									`}
								>
									{columns.map((column, colIndex) => (
										<td
											key={`${index}-${column.key ? String(column.key) : colIndex}`}
											className={`
												px-6 py-4 whitespace-nowrap text-sm text-foreground
												${getAlignmentClass(column.align)}
												${column.cellClassName || cellClassName}
											`}
										>
											{column.cell
												? column.cell(item, index)
												: column.render && column.key && column.key in item
													? column.render(item[column.key as keyof T], item, index)
													: column.key && column.key in item
														? String(item[column.key as keyof T] || '')
														: ''
											}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export { SmartTable };
