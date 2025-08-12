/* 
  파일명: /components/ui/ui-layout/selection-dialog/SelectedItemCard.tsx
  기능: 선택된 아이템 표시 카드
  책임: 현재 선택된 아이템 정보를 시각적으로 표시
*/

'use client';

import { Check } from 'lucide-react';

import type { 
  SelectableItem, 
  SelectedItemCardProps 
} from './selection-dialog.types';

export function SelectedItemCard<T extends SelectableItem>({ 
  selectedItem, 
  emptyState,
  renderSelectedItem,
  renderEmptyState
}: SelectedItemCardProps<T>) {
  // #region 기본 렌더링 함수
  const defaultRenderSelectedItem = (item: T) => (
    <div className="space-y-2">
      {/* 선택된 아이템명 */}
      <div className="flex gap-2 items-center">
        <h3 className="text-lg font-semibold text-foreground">
          {item.name || `아이템 ${item.id}`}
        </h3>
      </div>
      
      {/* 아이템 ID */}
      <div className="text-xs text-muted-foreground">
        ID: {item.id}
      </div>
    </div>
  );

  const defaultRenderEmptyState = () => (
    <div className="flex gap-2 items-center">
      <emptyState.icon className="w-5 h-5 text-muted-foreground" />
      <div>
        <span className="text-lg font-semibold text-foreground">{emptyState.title}</span>
        <p className="mt-1 text-sm text-muted-foreground">
          {emptyState.description}
        </p>
      </div>
    </div>
  );
  // #endregion

  // #region 렌더링
  return (
    <div className="mb-6">
      <div className={`p-5 border rounded-lg transition-all ${
        selectedItem 
          ? 'border-primary bg-primary-0' 
          : 'border-border bg-counter-2'
      }`}>
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            {selectedItem ? (
              renderSelectedItem ? renderSelectedItem(selectedItem) : defaultRenderSelectedItem(selectedItem)
            ) : (
              renderEmptyState ? renderEmptyState() : defaultRenderEmptyState()
            )}
          </div>
          
          {/* 상태 아이콘 */}
          <div className="relative">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
              selectedItem 
                ? 'bg-primary-1 text-primary' 
                : 'bg-counter-3 text-muted-foreground'
            }`}>
              {selectedItem ? (
                <Check className="w-6 h-6" />
              ) : (
                <emptyState.icon className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // #endregion
}
