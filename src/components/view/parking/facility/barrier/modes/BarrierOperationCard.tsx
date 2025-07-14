import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ParkingBarrier, OperationMode } from '@/types/parking';
import BarrierControlPanel from '../shared/BarrierControlPanel';
import Barrier3D from '@/components/ui/ui-3d/barrier/Barrier3d';

interface BarrierOperationCardProps {
  barrier: ParkingBarrier;
  orderIndex: number;
  totalCount: number;
  onToggle: () => void;
  onOperationModeChange: (mode: OperationMode) => void;
}

// #region 차단기 운영 카드 컴포넌트
const BarrierOperationCard: React.FC<BarrierOperationCardProps> = ({
  barrier,
  orderIndex,
  totalCount,
  onToggle,
  onOperationModeChange,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState(barrier.name);

  // 드래그 앤 드롭 설정
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

  // 이름 편집 핸들러
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

      {/* 차단기 시각화 */}
      <div className="flex-1 flex justify-center items-center">
        <Barrier3D
          width={260}
          height={180}
          isOpen={barrier.isOpen}
          onToggle={onToggle}
          operationMode={barrier.operationMode}
          onOperationModeChange={onOperationModeChange}
          viewAngle="diagonal"
          showControls={false} // 내장 컨트롤 비활성화
        />
      </div>
    </div>
  );
};

export default BarrierOperationCard;
// #endregion 