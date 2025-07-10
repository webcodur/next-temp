/* 
  파일명: /components/ui/ui-data/smartTable/SmartTable.tsx
  기능: 제네릭 데이터 테이블 컴포넌트
  책임: 정렬, 로딩 상태, RTL 지원이 포함된 데이터 테이블을 제공한다.
*/ // ------------------------------

'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useState, useMemo } from 'react';

import { ChevronUp, ChevronDown } from 'lucide-react';

import { useLocale } from '@/hooks/useI18n';
import Modal from '@/components/ui/ui-layout/modal/Modal';

// #region 타입 및 인터페이스
type SortDirection = 'asc' | 'desc' | null;

interface SortState {
	key: string;
	direction: SortDirection;
}

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
	pageSize?: number;
	loadingRows?: number;
	/** 행 클릭 시 호출되는 콜백 */
	onRowClick?: (item: T, index: number) => void;
}
// #endregion

const SmartTable = <T extends Record<string, any>>({
	data,
	columns,
	className = '',
	headerClassName = '',
	rowClassName = '',
	cellClassName = '',
	pageSize = 10,
	loadingRows = 5,
	onRowClick,
}: SmartTableProps<T>) => {
	// #region 상태
	const { isRTL } = useLocale();
	const [sortState, setSortState] = useState<SortState>({ key: '', direction: null });
	const [modalContent, setModalContent] = useState<string | null>(null);
	// #endregion

	// #region 유틸리티 함수
	// 정렬된 데이터
	const sortedData = useMemo(() => {
		const rawData = data ?? [];
		
		if (!rawData.length || !sortState.direction || !sortState.key) {
			return rawData;
		}

		// 정렬 키가 실제 데이터에 존재하는지 확인
		const hasKey = rawData.some(item => sortState.key in item);
		if (!hasKey) {
			console.warn(`정렬 키 '${sortState.key}'가 데이터에 존재하지 않습니다.`);
			return rawData;
		}

		return [...rawData].sort((a, b) => {
			const aValue = a[sortState.key];
			const bValue = b[sortState.key];

			if (aValue === bValue) return 0;
			
			// null, undefined 처리
			if (aValue == null) return 1;
			if (bValue == null) return -1;

			// 숫자 비교
			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue;
			}

			// 문자열 비교
			const aStr = String(aValue).toLowerCase();
			const bStr = String(bValue).toLowerCase();
			
			if (sortState.direction === 'asc') {
				return aStr.localeCompare(bStr);
			} else {
				return bStr.localeCompare(aStr);
			}
		});
	}, [data, sortState]);

	// 빈 로딩 행 생성
	const createLoadingRows = () => {
		return Array.from({ length: Math.min(loadingRows, pageSize) }, (_, index) => (
			<tr key={`loading-${index}`} className="animate-pulse">
				{columns.map((column, colIndex) => (
					<td
						key={`loading-${index}-${String(column.key)}`}
						className={`
							px-6 py-4 
							${colIndex < columns.length - 1 ? 'border-r border-primary-4/30' : ''}
							${cellClassName}
						`}
					>
						<div className="h-5 rounded bg-muted neu-flat"></div>
					</td>
				))}
			</tr>
		));
	};

	// 빈 행 생성
	const createEmptyRows = () => {
		return Array.from({ length: pageSize }, (_, index) => (
			<tr
				key={`empty-${index}`}
				className={`${index % 2 === 0 ? 'bg-surface-1' : 'bg-surface-2'}`}
			>
				{columns.map((column, colIndex) => (
					<td
						key={`empty-${index}-${String(column.key ?? colIndex)}`}
						className={`
							px-6 py-4 
							${colIndex < columns.length - 1 ? 'border-r border-primary-4/30' : ''}
							${cellClassName}
						`}
					>
						<div className="h-5" />
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
	// #endregion

	// #region 핸들러
	// 정렬 클릭 핸들러
	const handleSort = (columnKey: string, sortable: boolean = true, actualKey?: string) => {
		if (!sortable || !actualKey) return;
		
		setSortState(prev => {
			if (prev.key !== actualKey) {
				return { key: actualKey, direction: 'asc' };
			}
			
			const newDirection: SortDirection = 
				prev.direction === 'asc' ? 'desc' : 
				prev.direction === 'desc' ? null : 'asc';
				
			return { key: actualKey, direction: newDirection };
		});
	};
	// #endregion

	// #region 상수
	// 로딩 상태 처리
	const isInitialLoading = data === null;
	const actualData = sortedData;
	// #endregion

	// #region 렌더링
	return (
		<>
			<div className={`overflow-x-auto rounded-lg neu-flat-primary ${className}`}>
				<table
					className="w-full overflow-hidden rounded-lg bg-background"
					style={{ tableLayout: 'fixed' }}
				>
					{/* 테이블 헤더 */}
					<thead className={`border-b bg-primary-1/20 border-primary-4/30 ${headerClassName}`}>
						<tr>
							{columns.map((column, colIndex) => {
								const columnKey = column.key ? String(column.key) : `col-${colIndex}`;
								const actualKey = column.key ? String(column.key) : undefined;
								const canSort = column.sortable !== false && !!actualKey;
								const isSorted = sortState.key === actualKey;
								const sortDirection = isSorted ? sortState.direction : null;
								
								return (
									<th
										key={columnKey}
										className={`
											relative px-2 py-3 text-xs font-medium text-primary-8 uppercase tracking-wider
											text-center
											${colIndex < columns.length - 1 ? 'border-r border-primary-4/30' : ''}
											${canSort ? 'cursor-pointer hover:bg-primary-2/30 select-none' : ''}
											${column.headerClassName || ''}
										`}
										style={{ width: column.width }}
										onClick={() => handleSort(columnKey, canSort, actualKey)}
									>
										<div className="inline-block relative">
											{/* 헤더 타이틀 */}
											<span className="block text-base truncate font-multilang">
												{column.header}
											</span>

											{/* 정렬 아이콘 */}
											{canSort && (
												<div
													className={`absolute top-1/2 -translate-y-1/2 flex flex-col ${
														isRTL ? 'right-full mr-1' : 'left-full ml-1'
													}`}
												>
													<ChevronUp
														size={12}
														className={
															`transition-colors ${sortDirection === 'asc' ? 'text-primary-8' : 'text-primary-4'}`
														}
													/>
													<ChevronDown
														size={12}
														className={
															`transition-colors -mt-1 ${sortDirection === 'desc' ? 'text-primary-8' : 'text-primary-4'}`
														}
													/>
												</div>
											)}
										</div>
									</th>
								);
							})}
						</tr>
					</thead>

					{/* 테이블 바디 */}
					<tbody className="divide-y bg-background divide-border">
						{isInitialLoading ? (
							createLoadingRows()
						) : actualData.length === 0 ? (
							createEmptyRows()
						) : (
							actualData.map((item, index) => (
								<tr
									key={index}
									onClick={() => onRowClick?.(item, index)}
									className={`
										${index % 2 === 0 ? 'bg-surface-1' : 'bg-surface-2'}
										hover:bg-primary-2/[0.6]
										${onRowClick ? 'cursor-pointer' : ''}
										${getRowClassName(item, index)}
									`}
								>
									{columns.map((column, colIndex) => (
										<td
											key={`${index}-${column.key ? String(column.key) : colIndex}`}
											className={`
												px-6 py-4 text-sm text-foreground
												${getAlignmentClass(column.align)}
												${colIndex < columns.length - 1 ? 'border-r border-primary-4/30' : ''}
												${column.cellClassName || cellClassName}
											`}
										>
											{(() => {
												const rawValue =
													column.key && item[column.key as keyof T]
														? String(item[column.key as keyof T])
														: null;

												const content = (() => {
													if (column.cell) return column.cell(item, index);
													if (column.render && column.key && column.key in item)
														return column.render(item[column.key as keyof T], item, index);
													if (rawValue !== null) return rawValue;
													return '';
												})();

												return (
													<div
														className="truncate"
														title={rawValue ?? ''}
														onClick={(e) => {
															if (
																rawValue &&
																e.currentTarget.scrollWidth > e.currentTarget.clientWidth
															) {
																setModalContent(rawValue);
															}
														}}
													>
														{content}
													</div>
												);
											})()}
										</td>
									))}
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<Modal
				isOpen={modalContent !== null}
				onClose={() => setModalContent(null)}
				title="전체 내용"
				size="md"
			>
				<p className="font-multilang whitespace-pre-wrap break-words">{modalContent}</p>
			</Modal>
		</>
	);
	// #endregion
};

export { SmartTable };
