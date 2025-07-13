'use client';

import React, { useState, useCallback } from 'react';
import { FacilityLayout, CellType } from '@/types/facility-editor';
import { useFacilityEditor } from '@/hooks/useFacilityEditor';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { EditorGrid } from './EditorGrid';
import { EditorToolbar } from './EditorToolbar';
import { NameEditModal } from './NameEditModal';

// #region 타입 정의
interface FacilityEditorProps {
  initialLayout?: FacilityLayout;
  onLayoutChange?: (layout: FacilityLayout) => void; // 현재 사용하지 않음 (무한 루프 방지)
  onSave?: (layout: FacilityLayout) => void;
}
// #endregion

// #region 메인 컴포넌트
export const FacilityEditor = ({
  initialLayout,
  onLayoutChange: _onLayoutChange, // 사용하지 않음
  onSave,
}: FacilityEditorProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = _onLayoutChange;

  const {
    layout,
    editorState,
    canUndo,
    canRedo,
    actions,
    setSelectedTool,
    handleCellClick,
    handleCellRightClick,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleNavigate,
  } = useFacilityEditor(initialLayout);

  const [modalState, setModalState] = useState({
    isOpen: false,
    position: null as { x: number; y: number } | null,
    cellType: 'seat' as CellType,
    currentName: '',
  });

  // 레이아웃 변경 시 콜백 호출 - 무한 루프 방지를 위해 제거
  // React.useEffect(() => {
  //   if (onLayoutChange) {
  //     onLayoutChange(layout);
  //   }
  // }, [layout, onLayoutChange]);

  // 셀 더블클릭 처리 (이름 편집 모달 열기)
  const handleCellDoubleClick = useCallback(
    (position: { x: number; y: number }) => {
      const cell = layout.cells.find(
        (c) => c.x === position.x && c.y === position.y
      );

      if (cell && cell.type !== 'empty') {
        setModalState({
          isOpen: true,
          position,
          cellType: cell.type,
          currentName: cell.name,
        });
      }
    },
    [layout.cells]
  );

  // 이름 저장 처리
  const handleNameSave = useCallback(
    (name: string) => {
      if (modalState.position) {
        actions.setCellName(modalState.position, name);
      }
      setModalState({
        isOpen: false,
        position: null,
        cellType: 'seat',
        currentName: '',
      });
    },
    [modalState.position, actions]
  );

  // 모달 취소 처리
  const handleModalCancel = useCallback(() => {
    setModalState({
      isOpen: false,
      position: null,
      cellType: 'seat',
      currentName: '',
    });
  }, []);

  // 선택된 셀들 삭제 처리
  const handleDeleteSelected = useCallback(() => {
    if (editorState.selectedCells.length > 0) {
      actions.clearCells(editorState.selectedCells);
    }
  }, [editorState.selectedCells, actions]);

  // 선택된 셀들 타입 변경 처리
  const handleSetSelectedCellsType = useCallback((type: CellType) => {
    if (editorState.selectedCells.length > 0) {
      actions.setCellsType(editorState.selectedCells, type);
    }
  }, [editorState.selectedCells, actions]);

  // 키보드 단축키 핸들러
  const keyboardHandlers = {
    onUndo: actions.undo,
    onRedo: actions.redo,
    onDelete: handleDeleteSelected,
    onSetSelectedCellsType: handleSetSelectedCellsType,
    onNavigate: handleNavigate,
  };

  // 키보드 단축키 훅 사용
  useKeyboardShortcuts({
    isModalOpen: modalState.isOpen,
    selectedCells: editorState.selectedCells,
    handlers: keyboardHandlers,
  });

  // 저장 버튼 처리
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(layout);
    }
  }, [layout, onSave]);

  return (
    <div className="space-y-4">
      {/* 툴바 */}
      <EditorToolbar
        layout={layout}
        selectedTool={editorState.selectedTool}
        selectedCount={editorState.selectedCells.length}
        canUndo={canUndo}
        canRedo={canRedo}
        onToolSelect={setSelectedTool}
        onUndo={actions.undo}
        onRedo={actions.redo}
        onCellSizeChange={actions.setCellSize}
        onGridSizeChange={actions.setGridSize}
      />

      {/* 사용법 안내 */}
      <div className="p-3 rounded-lg neu-flat bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-blue-700 dark:text-blue-300">
          <div>
            <h4 className="font-medium mb-1">선택</h4>
            <ul className="text-xs space-y-1">
              <li>• 클릭: 단일 선택</li>
              <li>• Ctrl+클릭: 다중 선택</li>
              <li>• Shift+클릭: 범위 선택</li>
              <li>• 드래그: 영역 선택</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1">편집</h4>
            <ul className="text-xs space-y-1">
              <li>• 우클릭: 빈 공간 만들기</li>
              <li>• 더블클릭: 이름 편집</li>
              <li>• 1:좌석, 2:사물, 3:빈공간</li>
              <li>• Delete: 선택 삭제</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1">네비게이션</h4>
            <ul className="text-xs space-y-1">
              <li>• 방향키: 이동</li>
              <li>• Shift+방향키: 범위 확장</li>
              <li>• Ctrl+Z: 실행취소</li>
              <li>• Ctrl+Shift+Z: 다시실행</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1">크기 조절</h4>
            <ul className="text-xs space-y-1">
              <li>• 슬라이더: 셀 크기 조절</li>
              <li>• 숫자 입력: 그리드 크기 조절</li>
              <li>• 크기 변경 시 자동 저장</li>
              <li>• 범위 밖 셀은 자동 제거</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 그리드 */}
      <EditorGrid
        layout={layout}
        selectedCells={editorState.selectedCells}
        selectedTool={editorState.selectedTool}
        isDragging={editorState.isDragging}
        dragStart={editorState.dragStart}
        dragEnd={editorState.dragEnd}
        onCellClick={handleCellClick}
        onCellDoubleClick={handleCellDoubleClick}
        onCellRightClick={handleCellRightClick}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      />

      {/* 하단 상태 표시 */}
      <div className="flex items-center justify-between p-3 rounded-lg neu-flat bg-surface-2 text-sm text-foreground">
        <div className="flex items-center gap-4">
          <span>
            총 객체: <strong>{layout.cells.length}개</strong>
          </span>
          <span>
            좌석: <strong>{layout.cells.filter(c => c.type === 'seat').length}개</strong>
          </span>
          <span>
            사물: <strong>{layout.cells.filter(c => c.type === 'object').length}개</strong>
          </span>
          <span>
            선택됨: <strong>{editorState.selectedCells.length}개</strong>
          </span>
        </div>
        
        {onSave && (
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg neu-raised hover:neu-inset bg-primary text-primary-foreground font-medium transition-all duration-150"
          >
            저장
          </button>
        )}
      </div>

      {/* 이름 편집 모달 */}
      <NameEditModal
        isOpen={modalState.isOpen}
        position={modalState.position}
        cellType={modalState.cellType}
        currentName={modalState.currentName}
        onSave={handleNameSave}
        onCancel={handleModalCancel}
      />
    </div>
  );
};
// #endregion 