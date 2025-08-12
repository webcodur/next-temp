/* 
  파일명: /components/ui/ui-layout/selection-dialog/SelectionDialog.tsx
  기능: 공통 선택 다이얼로그 컴포넌트 (모달/페이지 모드 지원)
  책임: 선택 로직과 UI를 통합 제공하는 제네릭 컴포넌트
*/

'use client';

import { useCallback } from 'react';
import { useLocale } from '@/hooks/ui-hooks/useI18n';
import { Portal } from '@/components/ui/ui-layout/portal/Portal';
import { X } from 'lucide-react';

import type { 
  SelectableItem, 
  SelectionDialogProps 
} from './selection-dialog.types';

// 하위 컴포넌트들
import { SelectionTable } from './SelectionTable';
import { SelectionActionButtons } from './SelectionActionButtons';

export function SelectionDialog<T extends SelectableItem>({ 
  isModal = false,
  items,
  selectedItem,
  isLoading = false,
  header,
  actionButton,
  emptyState,
  loadingState,
  columns,
  getRowClassName,
  searchControl,
  onItemSelect,
  onConfirm,
  onClose,
  onSelectionComplete 
}: SelectionDialogProps<T>) {
  // #region 훅
  const { isRTL } = useLocale();
  // #endregion

  // #region 핸들러
  const handleClose = useCallback(() => {
    if (isModal) {
      onClose?.();
    }
  }, [isModal, onClose]);

  const handleConfirm = () => {
    onConfirm();
    if (selectedItem) {
      onSelectionComplete?.(selectedItem);
    }
  };
  // #endregion

  // #region 공통 콘텐츠
  const content = (
    <div className="flex flex-col h-full rounded-lg border shadow-lg bg-card border-border">
      {/* 헤더 */}
      <div className="flex-shrink-0 p-4 rounded-t-lg border-b-2 shadow-sm border-border bg-serial-4">
        <div className="flex justify-between items-center">
          {/* 좌측: 타이틀 */}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">
              {header.title}
            </h1>
            {header.description && (
              <p className="text-sm text-muted-foreground">
                {header.description}
              </p>
            )}
          </div>

          {/* 우측: 모달 닫기 버튼 */}
          {isModal && (
            <button
              onClick={handleClose}
              className="p-2 rounded-md cursor-pointer text-muted-foreground hover:text-foreground hover:bg-counter-2"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 검색 영역 */}
      {searchControl && (
        <div className="flex-shrink-0 p-4 border-b shadow-sm border-border bg-serial-3">
          {searchControl}
        </div>
      )}

      {/* 콘텐츠 영역 */}
      <div className="flex overflow-hidden flex-col flex-1 p-2 bg-serial-1">
        {/* 목록 테이블 */}
        <div className="flex flex-col flex-1 p-4 min-h-0">
          <div className="flex flex-col flex-1 min-h-0 rounded-lg border shadow-sm bg-background border-border">
            <SelectionTable
              items={items}
              selectedItem={selectedItem}
              columns={columns}
              isLoading={isLoading}
              emptyState={emptyState}
              loadingState={loadingState}
              getRowClassName={getRowClassName}
              onItemSelect={onItemSelect}
            />
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex-shrink-0 p-3 mt-2 rounded-lg border-t-2 shadow-sm border-border bg-serial-2">
          <SelectionActionButtons
            selectedItem={selectedItem}
            isLoading={isLoading}
            actionButton={actionButton}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
  // #endregion

  // #region 렌더링
  if (isModal) {
    // 모달 모드
    return (
      <div 
        className="flex fixed inset-0 z-50 justify-center items-center font-multilang"
        style={{ 
          backgroundColor: `hsla(var(--modal-overlay))`,
          fontFamily: "'MultiLang', 'Pretendard', 'Inter', 'Cairo', system-ui, sans-serif"
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
        onClick={handleClose}
      >
        <div 
          className="mx-4 w-full max-w-3xl h-[70vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  } else {
    // 페이지 모드
    return (
      <Portal containerId="selection-dialog-portal">
        <div 
          className={`flex fixed inset-0 z-50 justify-center items-center bg-background font-multilang`}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{ 
            fontFamily: "'MultiLang', 'Pretendard', 'Inter', 'Cairo', system-ui, sans-serif"
          }}
        >
          <div className="mx-4 w-full max-w-3xl h-[70vh] flex flex-col">
            {content}
          </div>
        </div>
      </Portal>
    );
  }
  // #endregion
}
