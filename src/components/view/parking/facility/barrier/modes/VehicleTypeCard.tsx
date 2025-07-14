/* 
  파일명: /components/view/parking/facility/barrier/modes/VehicleTypeCard.tsx
  기능: 차단기별 출입 유형 차량 설정 카드 컴포넌트
  책임: 드래그 앤 드롭, 이름 편집, 정책 설정을 통합 관리한다.
*/ // ------------------------------

import React, { useState } from 'react';

import { Edit2, Check, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ParkingBarrier, OperationMode } from '@/types/parking';

import BarrierControlPanel from '../shared/BarrierControlPanel';
import VehicleTypeSettings from './VehicleTypeSettings';

// #region 타입 정의
interface VehicleTypeCardProps {
  barrier: ParkingBarrier;
  orderIndex: number;
  totalCount: number;
  onToggle: () => void;
  onOperationModeChange: (mode: OperationMode) => void;
  onPolicyUpdate: (policies: Record<string, boolean>) => void;
}
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
  totalCount,
  onToggle,
  onOperationModeChange,
  onPolicyUpdate,
}) => {
  // #region 상태
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState(barrier.name);
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
  } = useSortable({ id: barrier.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  // #endregion

  // #region 핸들러
  const handleSaveName = () => {
    if (editingName.trim()) {
      console.log('차단기 이름 변경:', barrier.id, editingName);
      setIsEditingName(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingName(barrier.name);
    setIsEditingName(false);
  };

  const handlePolicyUpdate = (newPolicies: Record<string, boolean>) => {
    setPolicies(newPolicies);
    onPolicyUpdate(newPolicies);
  };
  // #endregion

  // #region 렌더링
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-lg neu-flat bg-surface-2 h-[500px] flex flex-col relative ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {/* 넘버링 띠 (absolute) */}
      <div className="absolute top-1 left-1 z-10 flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-primary/90 text-primary-foreground min-w-[30px]">
        <span className="font-semibold">
          {orderIndex + 1}/{totalCount}
        </span>
      </div>

      {/* 카드 헤더 */}
      <div className="flex items-center justify-between mb-3 px-1 py-0.5">
        {/* 왼쪽: 빈 공간 (대칭성 유지) */}
        <div className="min-w-[60px]"></div>

        {/* 중앙: 차단기명 */}
        <div className="flex-1 flex justify-center items-center">
          {isEditingName ? (
            <div className="flex items-center gap-2 justify-center w-full">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="px-3 py-1 text-lg font-semibold rounded border border-border bg-background text-center font-multilang min-w-0 max-w-[180px]"
                autoFocus
              />
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSaveName}
                  className="p-1.5 neu-raised hover:neu-inset rounded text-primary"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1.5 neu-raised hover:neu-inset rounded text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <h3 
              {...attributes}
              {...listeners}
              className="font-semibold text-foreground font-multilang text-lg cursor-grab active:cursor-grabbing hover:bg-muted/20 px-2 py-0.5 rounded transition-colors text-center"
            >
              {barrier.name}
            </h3>
          )}
        </div>

        {/* 오른쪽: 액션 버튼 */}
        <div className="min-w-[60px] flex justify-end">
          {!isEditingName && (
            <button
              onClick={() => setIsEditingName(true)}
              className="p-1 neu-raised hover:neu-inset rounded opacity-60 hover:opacity-100"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 컨트롤 패널 */}
      <div className="mb-3">
        <BarrierControlPanel
          barrier={barrier}
          onToggle={onToggle}
          onOperationModeChange={onOperationModeChange}
          layout="horizontal"
        />
      </div>

      {/* 출입 유형 차량 설정 */}
      <div className="flex-1 overflow-y-auto">
        <VehicleTypeSettings
          policies={policies}
          onPolicyUpdate={handlePolicyUpdate}
        />
      </div>
    </div>
  );
  // #endregion
};

export default VehicleTypeCard;
// #endregion 