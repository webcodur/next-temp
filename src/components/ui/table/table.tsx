'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

// 테이블 헤더 아이템 타입
export type TableColumn<T> = {
  id: string; // 컬럼 고유 아이디
  header: string; // 컬럼 헤더 텍스트
  accessorKey?: keyof T; // 데이터 접근 키
  cell?: (item: T) => ReactNode; // 커스텀 셀 렌더링 함수
  sortable?: boolean; // 정렬 가능 여부
  className?: string; // 추가 스타일 클래스
};

// 테이블 정렬 타입
type SortDirection = 'asc' | 'desc' | null;

// 테이블 프롭스 타입
type TableProps<T> = {
  data: T[]; // 테이블 데이터 배열
  columns: TableColumn<T>[]; // 컬럼 정의 배열
  className?: string; // 테이블 컨테이너 클래스
  tableClassName?: string; // 테이블 요소 클래스
  headerClassName?: string; // 헤더 로우 클래스
  bodyClassName?: string; // 바디 클래스
  rowClassName?: string | ((item: T, index: number) => string); // 로우 클래스
  cellClassName?: string; // 셀 클래스
  emptyMessage?: string; // 데이터 없을 때 메시지
  isLoading?: boolean; // 로딩 상태
  compact?: boolean; // 컴팩트 모드 여부
  rounded?: boolean; // 모서리 둥글게 여부
  minRows?: number; // 최소 표시할 행 수
};

// 테이블 컴포넌트
export function Table<T extends Record<string, any>>({
  data,
  columns,
  className,
  tableClassName,
  headerClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
  emptyMessage = '데이터가 없습니다.',
  isLoading = false,
  compact = false,
  rounded = true,
  minRows = 5, // 기본 최소 행 수
}: TableProps<T>) {
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
          prev.direction === 'asc' ? 'desc' : 
          prev.direction === 'desc' ? null : 'asc';
        
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
      return [...data];
    }

    const column = columns.find((col) => col.id === sortConfig.key);
    if (!column?.accessorKey) return [...data];

    return [...data].sort((a, b) => {
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
  }, [data, columns, sortConfig]);

  // 빈 행 생성 (최소 행 수 맞추기 위함)
  const emptyRows = useMemo(() => {
    if (isLoading || sortedData.length >= minRows) return [];
    return Array(minRows - sortedData.length).fill(null);
  }, [isLoading, sortedData.length, minRows]);

  // 테이블 스타일 설정
  const tableClasses = cn(
    'w-full',
    'border-collapse',
    'table-auto',
    {
      'rounded-md overflow-hidden': rounded,
    },
    tableClassName
  );

  // 헤더 스타일 설정
  const headerClasses = cn(
    'bg-gray-50',
    'border-b border-gray-200',
    'neu-flat',
    headerClassName
  );

  // 바디 스타일 설정
  const bodyClasses = cn(
    'bg-white',
    bodyClassName
  );

  // 테이블 로우 스타일 설정
  const getRowClasses = (item: T | null, index: number) => {
    const baseClasses = cn(
      'border-b border-gray-200 transition-colors',
      'hover:bg-gray-50/50',
      'even:bg-gray-100/70', // 얼룩말 효과 더 진하게 조정
      {
        'h-10': compact,
        'h-12': !compact,
      }
    );

    if (item === null) {
      return cn(baseClasses, 'opacity-0');
    }

    if (typeof rowClassName === 'function' && item !== null) {
      return cn(baseClasses, rowClassName(item as T, index));
    }

    return cn(baseClasses, rowClassName);
  };

  // 셀 스타일 설정
  const cellClasses = cn(
    'px-4',
    {
      'py-2': compact,
      'py-3': !compact,
    },
    cellClassName
  );

  // 헤더 셀 스타일 설정
  const headerCellClasses = cn(
    'font-medium text-sm text-gray-700',
    'px-4 text-center', // 가운데 정렬 추가
    {
      'py-2': compact,
      'py-3': !compact,
    }
  );

  // 컨테이너 스타일 설정
  const containerClasses = cn(
    'overflow-x-auto',
    'neu-flat',
    'rounded-lg',
    'border border-gray-200',
    'bg-white',
    className
  );

  // 셀 내용 렌더링 함수
  const renderCellContent = (item: T, column: TableColumn<T>): ReactNode => {
    if (column.cell) {
      return column.cell(item);
    }
    
    if (column.accessorKey) {
      const value = item[column.accessorKey as keyof T];
      return value !== undefined && value !== null ? String(value) : '';
    }
    
    return null;
  };

  return (
    <div className={containerClasses}>
      <table className={tableClasses}>
        <thead className={headerClasses}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className={cn(
                  headerCellClasses,
                  column.className,
                  column.sortable && 'cursor-pointer select-none'
                )}
                onClick={() => column.sortable && handleSort(column.id)}
              >
                <div className="flex items-center justify-center"> {/* 가운데 정렬로 변경 */}
                  <span>{column.header}</span>
                  {column.sortable && (
                    <span className="flex flex-col ml-1">
                      <ChevronUp
                        size={12}
                        className={cn(
                          'transition-opacity',
                          sortConfig.key === column.id && sortConfig.direction === 'asc'
                            ? 'text-primary opacity-100'
                            : 'opacity-30'
                        )}
                      />
                      <ChevronDown
                        size={12}
                        className={cn(
                          'transition-opacity',
                          sortConfig.key === column.id && sortConfig.direction === 'desc'
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
                className="py-20 text-center text-gray-500"
              >
                로딩 중...
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-20 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            <>
              {sortedData.map((item, rowIndex) => (
                <tr key={rowIndex} className={getRowClasses(item, rowIndex)}>
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.id}`}
                      className={cn(cellClasses, column.className)}
                    >
                      {renderCellContent(item, column)}
                    </td>
                  ))}
                </tr>
              ))}
              {emptyRows.map((_, index) => (
                <tr key={`empty-${index}`} className={getRowClasses(null, sortedData.length + index)}>
                  <td colSpan={columns.length} className="opacity-0">&nbsp;</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
} 