/* 
  파일명: /components/view/parking/facility/barrier/modes/VehicleTypeCard.tsx
  기능: 차단기별 출입 유형 차량 설정 카드 컴포넌트
  책임: 드래그 앤 드롭, 이름 편집, 정책 설정, 차단기 제어를 통합 관리한다.
*/ // ------------------------------

import React, { useState } from 'react';

import { Edit2, Check, X, ArrowUpDown, Settings, CheckCircle, Zap, RotateCcw, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ParkingBarrier, OperationMode } from '@/types/parking';

import VehicleTypeSettings from './VehicleTypeSettings';

// #region 타입 정의
interface VehicleTypeCardProps {
  barrier: ParkingBarrier;
  orderIndex: number;
  totalCount?: number;
  onToggle: () => void;
  onOperationModeChange: (mode: OperationMode) => void;
  onPolicyUpdate: (policies: Record<string, boolean>) => void;
  isDragOverlay?: boolean;
}
// #endregion

// #region 운영 모드 옵션
const operationModeOptions = [
  { value: 'always-open', label: '항시 열림' },
  { value: 'bypass', label: '바이패스' },
  { value: 'auto-operation', label: '자동 운행' },
] as const;

// 운영 모드별 아이콘
const getOperationModeIcon = (mode: OperationMode) => {
  switch (mode) {
    case 'always-open':
      return <CheckCircle className="w-3 h-3" />;
    case 'bypass':
      return <Zap className="w-3 h-3" />;
    case 'auto-operation':
      return <RotateCcw className="w-3 h-3" />;
    default:
      return <CheckCircle className="w-3 h-3" />;
  }
};
// #endregion

// #region 상수 정의
const defaultPolicies: Record<string, boolean> = {
  '입주': true,
  '방문': true,
  '업무': true,
  '정기': true,
  '임대': false,
  '상가': false,
  '미등록': false,
  '택시(택배 포함)': true,
};
// #endregion

// #region 메인 컴포넌트
const VehicleTypeCard: React.FC<VehicleTypeCardProps> = ({
  barrier,
  orderIndex,
  onToggle,
  onOperationModeChange,
  onPolicyUpdate,
  isDragOverlay = false,
}) => {
  // #region 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingName, setEditingName] = useState(barrier.name);
  const [editingOperationMode, setEditingOperationMode] = useState(barrier.operationMode);
  const [policies, setPolicies] = useState<Record<string, boolean>>(defaultPolicies);
  // #endregion

  // #region 훅
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: barrier.id,
    disabled: isDragOverlay
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  // #endregion

  // #region 핸들러
  const handleSaveEdit = () => {
    if (isDragOverlay) return;
    if (editingName.trim()) {
      console.log('차단기 정보 변경:', {
        id: barrier.id,
        name: editingName,
        operationMode: editingOperationMode
      });
      onOperationModeChange(editingOperationMode);
      setIsEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    if (isDragOverlay) return;
    setEditingName(barrier.name);
    setEditingOperationMode(barrier.operationMode);
    setIsEditMode(false);
  };

  const handlePolicyUpdate = (newPolicies: Record<string, boolean>) => {
    if (isDragOverlay) return;
    setPolicies(newPolicies);
    onPolicyUpdate(newPolicies);
  };
  // #endregion

  // #region 렌더링
  return (
    <div 
      ref={isDragOverlay ? undefined : setNodeRef}
      style={isDragOverlay ? {} : style}
      className={`rounded-lg neu-flat bg-surface-2 flex flex-col relative overflow-hidden ${
        isDragging && !isDragOverlay ? 'opacity-50' : ''
      }`}
    >
      {/* 카드 헤더 - 윈도우 앱 스타일 */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/80 to-primary/60 text-primary-foreground">
        {/* DND 손잡이 */}
        <div 
          {...(isDragOverlay ? {} : { ...attributes, ...listeners })}
          className={`flex items-center justify-center p-1 rounded transition-colors ${
            isDragOverlay ? '' : 'cursor-grab active:cursor-grabbing hover:bg-white/20'
          }`}
        >
          <GripVertical className="w-5 h-5 text-white/80" />
        </div>

        {/* 차단기명 */}
        <div className="flex-1 flex items-center justify-center">
          {isEditMode && !isDragOverlay ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              className="w-full max-w-xs px-3 py-1 text-lg font-semibold text-center rounded border border-white/30 bg-white/90 text-foreground font-multilang"
              autoFocus
              spellCheck={false}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className="font-bold text-white font-multilang text-lg px-2 py-1 rounded transition-colors cursor-not-allowed">
              {barrier.name}
            </h3>
          )}
        </div>

        {/* 순서 넘버링 */}
        <div className="flex items-center justify-center w-8 h-8 rounded bg-white/20 backdrop-blur-sm text-sm font-bold">
          {orderIndex + 1}
        </div>
      </div>

      {/* 카드 본문 */}
      <div className="flex flex-col p-4">
        {/* 출입 유형 차량 설정 */}
        <div className="mb-4">
          <VehicleTypeSettings
            policies={policies}
            onPolicyUpdate={handlePolicyUpdate}
            isEditMode={isEditMode && !isDragOverlay}
            isReadOnly={isDragOverlay}
          />
        </div>

                {/* 운영모드 + 액션 버튼 영역 */}
        <div className="border-t border-border/50 pt-3 mb-3">
          <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-muted/30">
            {/* 왼쪽: 운영모드 */}
            <div className="flex items-center gap-2 flex-1">
              {isEditMode && !isDragOverlay ? (
                <>
                  <Settings className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  {getOperationModeIcon(editingOperationMode)}
                  <select
                    value={editingOperationMode}
                    onChange={(e) => setEditingOperationMode(e.target.value as OperationMode)}
                    className="px-2 py-1 text-sm rounded border border-border bg-background"
                  >
                    {operationModeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  {getOperationModeIcon(barrier.operationMode)}
                  <span className="text-sm text-muted-foreground">
                    {operationModeOptions.find(opt => opt.value === barrier.operationMode)?.label}
                  </span>
                </>
              )}
            </div>

            {/* 오른쪽: 액션 버튼 */}
            {!isDragOverlay && (
              <div className="flex gap-2">
                {!isEditMode ? (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="p-2 neu-raised hover:neu-inset rounded-full opacity-70 hover:opacity-100 transition-opacity"
                    title="수정 모드"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 neu-raised hover:neu-inset rounded-full opacity-70 hover:opacity-100 transition-opacity"
                      title="취소"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 neu-inset text-primary rounded-full"
                      title="저장"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer: 차단기 상태 및 여닫기 버튼 */}
      {!isDragOverlay && (
        <div className="bg-muted/50 border-t border-border/50 p-3 flex items-center justify-between">
          {/* 차단기 상태 */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              barrier.isOpen ? 'bg-success' : 'bg-destructive'
            }`} />
            <span className="text-sm font-medium text-muted-foreground">
              {barrier.isOpen ? '열림' : '닫힘'}
            </span>
          </div>

          {/* 여닫기 버튼 */}
          <button
            onClick={() => onToggle()}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md neu-raised hover:neu-inset transition-all ${
              barrier.isOpen ? 'text-destructive' : 'text-success'
            }`}
            title={barrier.isOpen ? '차단기 닫기' : '차단기 열기'}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>{barrier.isOpen ? '닫기' : '열기'}</span>
          </button>
        </div>
      )}
    </div>
  );
  // #endregion
};

export default VehicleTypeCard;
// #endregion 