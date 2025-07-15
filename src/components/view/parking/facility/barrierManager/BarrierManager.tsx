/* 
  파일명: /components/view/parking/facility/barrierManager/BarrierManager.tsx
  기능: 주차장 차단기 관리 인터페이스
  책임: 차단기 목록 표시, 드래그앤드롭 정렬, 상태 관리를 담당한다.
*/ // ------------------------------

import React, { useState, useEffect } from 'react';

import { 
  DndContext, 
  DragEndEvent, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { 
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { Construction } from 'lucide-react';

import { OperationMode } from '@/types/parking';

import { BarrierManagerProps } from './types';
import { useBarrierOperations } from './useBarrierOperations';
import { getResponsiveGridClass } from './viewModeConfig';
import VehicleTypeCard from './VehicleTypeCard/VehicleTypeCard';

const BarrierManager: React.FC<BarrierManagerProps> = ({
  barriers: initialBarriers,
  onBarrierOpen,
  onBarrierClose,
  onOperationModeChange,
  onPolicyUpdate,
}) => {

  // #region 상태
  const [barrierOrder, setBarrierOrder] = useState<string[]>(() => 
    initialBarriers.map(barrier => barrier.id)
  );
  // #endregion

  // #region 훅
  const {
    barriers,
    handleBarrierToggle,
    handleOperationModeChange,
    handlePolicyUpdate,
  } = useBarrierOperations(
    initialBarriers,
    onBarrierOpen,
    onBarrierClose,
    onOperationModeChange,
    onPolicyUpdate
  );

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

  useEffect(() => {
    const newBarrierIds = barriers.map(barrier => barrier.id);
    setBarrierOrder(prev => {
      const existingIds = prev.filter(id => newBarrierIds.includes(id));
      const newIds = newBarrierIds.filter(id => !prev.includes(id));
      return [...existingIds, ...newIds];
    });
  }, [barriers]);
  // #endregion

  // #region 핸들러
  const handleIndividualPolicyUpdate = (barrierId: string, policies: Record<string, boolean>) => {
    handlePolicyUpdate(barrierId, policies);
  };

  const handleDragStart = () => {
    // 필요 시 드래그 시작 로직 추가
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id && over) {
      setBarrierOrder(items => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  // #endregion

  // #region 계산된 값
  const gridClass = getResponsiveGridClass();
  const sortedBarriers = barrierOrder
    .map(id => barriers.find(b => b.id === id))
    .filter(Boolean) as typeof barriers;
  // #endregion

  // #region 렌더링
  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={barrierOrder} strategy={rectSortingStrategy}>
          <section className={gridClass}>
            {sortedBarriers.map((barrier) => (
              <VehicleTypeCard 
                key={barrier.id}
                barrier={barrier}
                onToggle={() => handleBarrierToggle(barrier.id)}
                onOperationModeChange={(mode: OperationMode) => 
                  handleOperationModeChange(barrier.id, mode)
                }
                onPolicyUpdate={(policies: Record<string, boolean>) => 
                  handleIndividualPolicyUpdate(barrier.id, policies)
                }
              />
            ))}
          </section>
        </SortableContext>
      </DndContext>

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

export default BarrierManager; 