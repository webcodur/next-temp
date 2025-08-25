/* 
  파일명: /components/view/menu-search/MenuSearchTable/MenuSearchTable.tsx
  기능: 메뉴 검색 결과 테이블
  책임: 검색된 메뉴 목록을 테이블 형태로 표시하고 선택 기능 제공
*/

'use client';

import { useMemo, useCallback } from 'react';
import { ArrowRight, ExternalLink, Search, Check, Loader2 } from 'lucide-react';
import { BaseTable, BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';
import type { MenuSearchTableProps, MenuSearchResult } from './menu-search.type';

export function MenuSearchTable({ 
  results, 
  selectedResult, 
  onResultSelect,
  isLoading = false 
}: MenuSearchTableProps) {
  // #region 테이블 설정
  // 테이블 컬럼 정의
  const columns: BaseTableColumn<MenuSearchResult>[] = useMemo(() => [
    {
      key: 'fullPath',
      header: '메뉴 경로',
      align: 'start',
      cell: (item) => (
        <div className="flex gap-2 items-center">
          {/* 메뉴 경로 */}
          <div className="flex gap-1 items-center text-sm">
            <span className="text-foreground">
              {item.topLabel}
            </span>
            <ArrowRight size={12} className="text-muted-foreground" />
            <span className="text-foreground">
              {item.midLabel}
            </span>
            <ArrowRight size={12} className="text-muted-foreground" />
            <span className="text-foreground">
              {item.botLabel}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'href',
      header: '경로',
      align: 'start',
      width: '200px',
      render: (value) => (
        <div className="flex gap-2 items-center">
          <code className="px-2 py-1 text-xs rounded bg-counter-1 text-muted-foreground">
            {value as string}
          </code>
          <ExternalLink size={12} className="text-muted-foreground" />
        </div>
      )
    },
    {
      header: '선택',
      align: 'center',
      width: '80px',
      cell: (item) => (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto border-2 transition-none ${
          selectedResult?.id === item.id
            ? 'border-primary bg-primary'
            : 'border-border bg-card hover:border-primary hover:border-opacity-60'
        }`}>
          {selectedResult?.id === item.id && (
            <Check className="w-3 h-3 text-primary-foreground" />
          )}
        </div>
      )
    },
  ], [selectedResult]);

  // 행 클래스명 메모이제이션
  const getRowClassName = useCallback((item: MenuSearchResult) => {
    return `cursor-pointer ${
      selectedResult?.id === item.id
        ? 'bg-primary-0 border-l-4 border-l-primary'
        : 'hover:bg-counter-1'
    }`;
  }, [selectedResult]);
  // #endregion

  // #region 렌더링
  if (isLoading) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <div className="inline-flex gap-2 items-center text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>검색 중...</span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center p-8 text-center bg-counter-0">
        <div className="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-counter-2">
          <Search className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          검색 결과가 없습니다
        </h3>
        <p className="mb-4 text-muted-foreground">
          입력하신 키워드와 일치하는 메뉴를 찾을 수 없습니다
        </p>
        <p className="text-sm text-muted-foreground">
          • 다른 키워드로 검색해보세요<br/>
          • 메뉴명의 일부분만 입력해보세요<br/>
          • 띄어쓰기 없이 검색해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1">
      <BaseTable
        data={results as unknown as Record<string, unknown>[]}
        columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
        onRowClick={onResultSelect as unknown as (item: Record<string, unknown>, index: number) => void}
        getRowClassName={getRowClassName as unknown as (item: Record<string, unknown>, index: number) => string}
      />
    </div>
  );
  // #endregion
}
