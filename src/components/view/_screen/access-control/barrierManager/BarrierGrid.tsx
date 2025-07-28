/* 
  파일명: BarrierGrid.tsx
  기능: 차단기 그리드 관리 컴포넌트
  책임: 드래그앤드롭 기능이 있는 차단기 카드 그리드를 표시한다.
*/

import React from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { 
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { Construction } from 'lucide-react';
import { ParkingBarrier, OperationMode } from '@/types/parking';
import BarrierCard from './barrierCard/BarrierCard';

// #region 타입 정의
interface BarrierPolicy {
  workHour: boolean;
  blacklist: boolean;
}

interface BarrierGridProps {
  barriers: ParkingBarrier[];
  barrierPolicies: Record<string, BarrierPolicy>;
  barrierOrder: string[];
  returnHourEnabled: boolean;
  isLocked?: boolean;
  onBarrierToggle: (barrierId: string) => void;
  onOperationModeChange: (barrierId: string, mode: OperationMode) => void;
  onPolicyUpdate: (barrierId: string, policy: BarrierPolicy) => void;
  onBarrierOrderChange: (newOrder: string[]) => void;
}
// #endregion

// #region 반응형 그리드 클래스
const getResponsiveGridClass = () => {
  return 'grid gap-4 grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3';
};
// #endregion

// #region 메인 컴포넌트
const BarrierGrid: React.FC<BarrierGridProps> = ({
  barriers,
  barrierPolicies,
  barrierOrder,
  returnHourEnabled,
  isLocked,
  onBarrierToggle,
  onOperationModeChange,
  onPolicyUpdate,
  onBarrierOrderChange,
}) => {
  // #region 상태
  const [activeId, setActiveId] = React.useState<string | null>(null);
  // #endregion

  // #region 훅
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // #endregion

  // #region 핸들러
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id && over) {
      const oldIndex = barrierOrder.indexOf(active.id as string);
      const newIndex = barrierOrder.indexOf(over.id as string);
      const newOrder = arrayMove(barrierOrder, oldIndex, newIndex);
      onBarrierOrderChange(newOrder);
    }
    
    setActiveId(null);
  };
  // #endregion

  // #region 계산된 값
  const gridClass = getResponsiveGridClass();
  const sortedBarriers = barrierOrder
    .map(id => barriers.find(b => b.id === id))
    .filter(Boolean) as ParkingBarrier[];
  const activeBarrier = activeId ? sortedBarriers.find(b => b.id === activeId) : null;
  // #endregion

  // #region 렌더링
  return (
    <div className="p-6 space-y-6">
      {/* 차단기가 있을 때 그리드 표시 */}
      {barriers.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={barrierOrder} strategy={rectSortingStrategy}>
            <div className={gridClass}>
              {sortedBarriers.map((barrier) => (
                <BarrierCard 
                  key={barrier.id}
                  barrier={barrier}
                  policy={barrierPolicies[barrier.id] || { workHour: false, blacklist: false }}
                  onToggle={() => onBarrierToggle(barrier.id)}
                  onOperationModeChange={(mode: OperationMode) => 
                    onOperationModeChange(barrier.id, mode)
                  }
                  onPolicyUpdate={onPolicyUpdate}
                  globalReturnHourEnabled={returnHourEnabled}
                  isLocked={isLocked}
                />
              ))}
            </div>
          </SortableContext>
          
          <DragOverlay dropAnimation={{
            duration: 200,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}>
            {activeBarrier ? (
              <div style={{ cursor: 'grabbing' }}>
                <BarrierCard
                  barrier={activeBarrier}
                  policy={barrierPolicies[activeBarrier.id] || { workHour: false, blacklist: false }}
                  onToggle={() => {}}
                  onOperationModeChange={() => {}}
                  onPolicyUpdate={() => {}}
                  globalReturnHourEnabled={returnHourEnabled}
                  isLocked={true}
                  isDragOverlay={true}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* 차단기가 없을 때 메시지 */}
      {barriers.length === 0 && (
        <div className="flex flex-col justify-center items-center py-12 text-center">
          <Construction className="mx-auto mb-4 w-16 h-16" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            등록된 차단기가 없습니다
          </h3>
          <p className="text-muted-foreground">
            차단기를 등록하여 관리를 시작하세요.
          </p>
        </div>
      )}
    </div>
  );
  // #endregion
};

export default BarrierGrid;
// #endregion 