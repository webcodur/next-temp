'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

// 스마트 테이블 헤더 아이템 타입
export type SmartTableColumn<T> = {
	id: string; // 컬럼 고유 아이디
	header: string; // 컬럼 헤더 텍스트
	accessorKey?: keyof T; // 데이터 접근 키
	cell?: (item: T) => ReactNode; // 커스텀 셀 렌더링 함수
	sortable?: boolean; // 정렬 가능 여부
	className?: string; // 추가 스타일 클래스
	align?: 'left' | 'center' | 'right'; // 컬럼 정렬 방향
	width?: string; // 컬럼 고정 너비 (예: '100px', '20%')
};

// 테이블 정렬 타입
type SortDirection = 'asc' | 'desc' | null;

// 테이블 프롭스 타입
type TableProps<T> = {
	data: T[] | null | undefined; // 테이블 데이터 배열 (로딩 상태를 위해 null/undefined 허용)
	columns: SmartTableColumn<T>[]; // 컬럼 정의 배열
	className?: string; // 테이블 컨테이너 클래스
	rowClassName?: string | ((item: T, index: number) => string); // 로우 클래스 (버튼 제어용)
	pageSize?: number; // 페이지당 표시할 행 수 (기본 10)
	isFetching?: boolean; // 명시적 로딩 상태 제어
	onRowClick?: (item: T, index: number) => void; // 행 클릭 핸들러 (상세 페이지 이동용)
	clickableRows?: boolean; // 행 클릭 활성화 여부 (기본 false)
};

// 스마트 테이블 컴포넌트
export function SmartTable<T extends Record<string, any>>({
	data,
	columns,
	className,
	rowClassName,
	pageSize = 10, // 기본 10행
	isFetching = false,
	onRowClick,
	clickableRows = false,
}: TableProps<T>) {
	// 로딩 상태 결정 (isFetching 우선, 그 다음 data 상태)
	const isLoading = isFetching || data === undefined || data === null;

	// 실제 데이터 (로딩 중이면 빈 배열)
	const actualData = useMemo(() => (isLoading ? [] : data), [isLoading, data]);

	// 빈 메시지 자동 생성
	const emptyMessage =
		actualData.length === 0 && !isLoading ? '데이터가 없습니다.' : '';

	// 정렬 상태 관리
	const [sortConfig, setSortConfig] = useState<{
		key: string;
		direction: SortDirection;
	}>({
		key: '',
		direction: null,
	});

	// 정렬 함수
	const handleSort = (columnId: string) => {
		const column = columns.find((col) => col.id === columnId);

		if (!column?.sortable) return;

		setSortConfig((prev) => {
			if (prev.key === columnId) {
				// 같은 컬럼 클릭 시 정렬 방향 순환 (asc -> desc -> null)
				const nextDirection =
					prev.direction === 'asc'
						? 'desc'
						: prev.direction === 'desc'
							? null
							: 'asc';

				return {
					key: nextDirection ? columnId : '',
					direction: nextDirection,
				};
			}

			// 다른 컬럼 클릭 시 오름차순 정렬 시작
			return {
				key: columnId,
				direction: 'asc',
			};
		});
	};

	// 정렬된 데이터
	const sortedData = useMemo(() => {
		// 정렬 설정이 없으면 원본 데이터 반환
		if (!sortConfig.direction) {
			return [...actualData];
		}

		const column = columns.find((col) => col.id === sortConfig.key);
		if (!column?.accessorKey) return [...actualData];

		return [...actualData].sort((a, b) => {
			const aValue = a[column.accessorKey as keyof T];
			const bValue = b[column.accessorKey as keyof T];

			// null, undefined 처리
			if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
			if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

			// 문자열 정렬
			if (typeof aValue === 'string' && typeof bValue === 'string') {
				return sortConfig.direction === 'asc'
					? aValue.localeCompare(bValue)
					: bValue.localeCompare(aValue);
			}

			// 숫자 정렬
			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return sortConfig.direction === 'asc'
					? aValue - bValue
					: bValue - aValue;
			}

			// 날짜 정렬
			const isDate = (val: any): val is Date =>
				val && typeof val.getTime === 'function';

			if (isDate(aValue) && isDate(bValue)) {
				return sortConfig.direction === 'asc'
					? aValue.getTime() - bValue.getTime()
					: bValue.getTime() - aValue.getTime();
			}

			// 기본 정렬 (문자열 변환)
			return sortConfig.direction === 'asc'
				? String(aValue).localeCompare(String(bValue))
				: String(bValue).localeCompare(String(aValue));
		});
	}, [actualData, columns, sortConfig]);

	// 페이지네이션된 데이터 (첫 번째 페이지만 표시)
	const paginatedData = useMemo(() => {
		return sortedData.slice(0, pageSize);
	}, [sortedData, pageSize]);

	// 빈 행 생성 (pageSize에 맞춰 고정된 높이 유지)
	const emptyRows = useMemo(() => {
		const currentRows =
			isLoading || sortedData.length === 0 ? 0 : paginatedData.length;
		if (currentRows >= pageSize) return [];
		return Array(pageSize - currentRows).fill(null);
	}, [isLoading, sortedData.length, paginatedData.length, pageSize]);

	// 테이블 스타일 설정 (컴팩트 모드 고정)
	const tableClasses = cn(
		'w-full',
		'border-collapse',
		'table-fixed' // 고정 레이아웃으로 컬럼 너비 안정화
	);

	// 헤더 스타일 설정
	const headerClasses = cn(
		'bg-muted',
		'border-b border-border',
		'neu-flat'
	);

	// 바디 스타일 설정
	const bodyClasses = cn('bg-background');

	// 테이블 로우 스타일 설정 (높이 고정, 전역 얼룩무늬 스타일 사용)
	const getRowClasses = (item: T | null, index: number) => {
		const isEven = index % 2 === 0;
		const baseClasses = cn(
			'border-b border-border',
			isEven ? 'list-item-even' : 'list-item-odd',
			'h-10', // 컴팩트 모드 고정
			// 좌측 accent 바 hover 효과 (즉시 적용)
			'border-l-4 border-l-transparent hover:border-l-primary hover:bg-primary/5'
		);

		if (item === null) {
			return cn(baseClasses, 'opacity-0');
		}

		// 클릭 가능한 행인 경우 hover 효과 추가 (ListHighlightMarker 스타일 활용)
		if (clickableRows && onRowClick) {
			const interactionClasses = cn(
				baseClasses,
				'cursor-pointer',
				'list-item-hover hover:list-item-active'
			);

			if (typeof rowClassName === 'function') {
				return cn(interactionClasses, rowClassName(item as T, index));
			}
			return cn(interactionClasses, rowClassName);
		}

		if (typeof rowClassName === 'function' && item !== null) {
			return cn(baseClasses, rowClassName(item as T, index));
		}

		return cn(baseClasses, rowClassName);
	};

	// 셀 스타일 설정 (세로선 항상 표시, 컴팩트 모드 고정)
	const getCellClasses = (column: SmartTableColumn<T>) => {
		const alignClasses = {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
		};

		return cn(
			'px-4 py-2', // 컴팩트 모드 고정
			'border-r border-gray-200 last:border-r-0', // 세로선 항상 표시
			alignClasses[column.align || 'left']
		);
	};

	// 헤더 셀 스타일 설정 (무조건 가운데 정렬, 컴팩트 모드 고정)
	const getHeaderCellClasses = () => {
		return cn(
			'font-medium text-sm text-gray-700',
			'px-4 py-2 text-center', // 컴팩트 모드 고정
			'border-r border-gray-200 last:border-r-0' // 세로선 항상 표시
		);
	};

	// 컨테이너 스타일 설정
	const containerClasses = cn(
		'overflow-x-auto',
		'neu-flat',
		'rounded-lg', // rounded 항상 적용
		'border border-gray-200',
		'bg-white',
		className
	);

	// 셀 내용 렌더링 함수
	const renderCellContent = (
		item: T,
		column: SmartTableColumn<T>
	): ReactNode => {
		if (column.cell) {
			return column.cell(item);
		}

		if (column.accessorKey) {
			const value = item[column.accessorKey as keyof T];
			return value !== undefined && value !== null ? String(value) : '';
		}

		return null;
	};

	// 컬럼 너비 스타일 생성
	const getColumnStyle = (column: SmartTableColumn<T>) => {
		if (column.width) {
			return { width: column.width };
		}
		return {};
	};

	// 로딩/빈 상태 메시지의 높이 계산 (pageSize에 맞춰)
	const messageRowHeight = pageSize * 40; // 각 행이 h-10 (40px)이므로

	// 행 클릭 핸들러
	const handleRowClick = (item: T, index: number) => {
		if (clickableRows && onRowClick) {
			onRowClick(item, index);
		}
	};

	return (
		<div className={containerClasses}>
			<table className={tableClasses}>
				<colgroup>
					{columns.map((column) => (
						<col key={column.id} style={getColumnStyle(column)} />
					))}
				</colgroup>
				<thead className={headerClasses}>
					<tr>
						{columns.map((column) => (
							<th
								key={column.id}
								className={cn(
									getHeaderCellClasses(),
									column.className,
									column.sortable && 'cursor-pointer select-none'
								)}
								onClick={() => column.sortable && handleSort(column.id)}>
								<div className="flex justify-center items-center">
									<span>{column.header}</span>
									{column.sortable && (
										<span className="flex flex-col ml-1">
											<ChevronUp
												size={12}
												className={cn(
													'transition-opacity',
													sortConfig.key === column.id &&
														sortConfig.direction === 'asc'
														? 'text-primary opacity-100'
														: 'opacity-30'
												)}
											/>
											<ChevronDown
												size={12}
												className={cn(
													'transition-opacity',
													sortConfig.key === column.id &&
														sortConfig.direction === 'desc'
														? 'text-primary opacity-100'
														: 'opacity-30'
												)}
											/>
										</span>
									)}
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody className={bodyClasses}>
					{isLoading ? (
						<tr>
							<td
								colSpan={columns.length}
								className="text-center text-gray-500 align-middle"
								style={{ height: `${messageRowHeight}px` }}>
								<div className="flex justify-center items-center h-full">
									로딩 중...
								</div>
							</td>
						</tr>
					) : sortedData.length === 0 ? (
						<tr>
							<td
								colSpan={columns.length}
								className="text-center text-gray-500 align-middle"
								style={{ height: `${messageRowHeight}px` }}>
								<div className="flex justify-center items-center h-full">
									{emptyMessage}
								</div>
							</td>
						</tr>
					) : (
						<>
							{paginatedData.map((item, rowIndex) => (
								<tr
									key={rowIndex}
									className={getRowClasses(item, rowIndex)}
									onClick={() => handleRowClick(item, rowIndex)}>
									{columns.map((column) => (
										<td
											key={`${rowIndex}-${column.id}`}
											className={cn(getCellClasses(column), column.className)}>
											{renderCellContent(item, column)}
										</td>
									))}
								</tr>
							))}
							{emptyRows.map((_, index) => (
								<tr
									key={`empty-${index}`}
									className={getRowClasses(null, paginatedData.length + index)}>
									{columns.map((column) => (
										<td
											key={`empty-${index}-${column.id}`}
											className={getCellClasses(column)}>
											&nbsp;
										</td>
									))}
								</tr>
							))}
						</>
					)}
				</tbody>
			</table>
		</div>
	);
}
