/* 
  파일명: /components/ui/ui-layout/selection-dialog/SelectionActionButtons.tsx
  기능: 선택 다이얼로그 액션 버튼 영역
  책임: 확인/이동 버튼과 로딩 상태 관리
*/

'use client';

import { Loader2 } from 'lucide-react';

import type { 
  SelectableItem, 
  SelectionActionButtonsProps 
} from './selection-dialog.types';

export function SelectionActionButtons<T extends SelectableItem>({ 
  selectedItem, 
  isLoading, 
  actionButton,
  onConfirm 
}: SelectionActionButtonsProps<T>) {
  // #region 아이콘 설정
  const ActionIcon = actionButton.icon;
  const LoadingIcon = actionButton.loadingIcon || Loader2;
  // #endregion

  // #region 렌더링
  return (
    <div className="flex gap-3 justify-end">
      {/* 액션 버튼 */}
      <button
        onClick={onConfirm}
        disabled={!selectedItem || isLoading}
        className={`px-8 py-3 rounded-lg font-medium transition-all min-w-32 flex items-center gap-2 ${
          (!selectedItem || isLoading) 
            ? 'neu-flat opacity-50 cursor-not-allowed text-muted-foreground bg-counter-2' 
            : 'neu-raised bg-primary text-primary-foreground hover:scale-[1.02]'
        }`}
      >
        {isLoading ? (
          <>
            <LoadingIcon className="w-4 h-4 animate-spin" />
            <span>{actionButton.loadingLabel}</span>
          </>
        ) : (
          <>
            <ActionIcon size={16} />
            <span>{actionButton.label}</span>
          </>
        )}
      </button>
    </div>
  );
  // #endregion
}
