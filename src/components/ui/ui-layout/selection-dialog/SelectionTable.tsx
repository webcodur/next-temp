/* 
  파일명: /components/ui/ui-layout/selection-dialog/SelectionTable.tsx
  기능: 선택 가능한 아이템 목록 테이블
  책임: 아이템 목록을 테이블 형태로 표시하고 선택 기능 제공
*/

'use client';

import { useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { BaseTable } from '@/components/ui/ui-data/baseTable/BaseTable';

import type { 
  SelectableItem, 
  SelectionTableProps 
} from './selection-dialog.types';

export function SelectionTable<T extends SelectableItem>({ 
  items, 
  selectedItem, 
  columns,
  isLoading = false,
  emptyState,
  loadingState,
  getRowClassName,
  onItemSelect 
}: SelectionTableProps<T>) {
  // #region 테이블 설정
  // 행 클래스명 메모이제이션
  const defaultGetRowClassName = useCallback((item: T) => {
    return `cursor-pointer transition-all ${
      selectedItem?.id === item.id
        ? 'bg-primary-0 border-l-4 border-l-primary'
        : 'hover:bg-counter-1'
    }`;
  }, [selectedItem]);

  const finalGetRowClassName = getRowClassName || defaultGetRowClassName;
  // #endregion

  // #region 렌더링
  if (isLoading) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <div className="inline-flex gap-2 items-center text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingState?.message || '로딩 중...'}</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    const EmptyIcon = emptyState.icon;
    
    return (
      <div className="flex flex-col flex-1 justify-center items-center p-8 text-center bg-counter-0">
        <div className="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-counter-2">
          <EmptyIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {emptyState.title}
        </h3>
        <p className="mb-4 text-muted-foreground">
          {emptyState.description}
        </p>
        {emptyState.tips && emptyState.tips.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {emptyState.tips.map((tip, index) => (
              <div key={index}>• {tip}</div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1">
      <BaseTable
        data={items}
        columns={columns}
        onRowClick={(item) => onItemSelect(item)}
        getRowClassName={finalGetRowClassName}
      />
    </div>
  );
  // #endregion
}
