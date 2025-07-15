import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
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
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Construction } from 'lucide-react';
import { BarrierManagementViewProps } from './types';
import { useBarrierOperations } from './hooks/useBarrierOperations';
import { getResponsiveGridClass } from './utils/viewModeConfig';
import VehicleTypeCard from './modes/VehicleTypeCard';
import { OperationMode } from '@/types/parking';
import { ParkingBarrier } from '@/types/parking';

// #region 메인 차단기 관리 뷰 컴포넌트
const BarrierManagementView: React.FC<BarrierManagementViewProps> = ({
  barriers: initialBarriers,
  onBarrierOpen,
  onBarrierClose,
  onOperationModeChange,
  onPolicyUpdate,
}) => {

  // 훅 초기화
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

  // 드래그 앤 드롭 상태
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<ParkingBarrier | null>(null);
  const [barrierOrder, setBarrierOrder] = useState<string[]>(() => 
    barriers.map(barrier => barrier.id)
  );

  // 드래그 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이상 이동해야 드래그 시작
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // barriers 변경 시 barrierOrder 업데이트
  useEffect(() => {
    const newBarrierIds = barriers.map(barrier => barrier.id);
    setBarrierOrder(prev => {
      // 기존 순서를 유지하면서 새로운 차단기 추가
      const existingIds = prev.filter(id => newBarrierIds.includes(id));
      const newIds = newBarrierIds.filter(id => !prev.includes(id));
      return [...existingIds, ...newIds];
    });
  }, [barriers]);

  // 반응형 그리드 클래스
  const gridClass = getResponsiveGridClass();

  // 개별 정책 업데이트 핸들러
  const handleIndividualPolicyUpdate = (barrierId: string, policies: Record<string, boolean>) => {
    console.log('정책 업데이트:', barrierId, policies);
    handlePolicyUpdate(barrierId, policies);
  };

  // 드래그 핸들러
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    const barrier = sortedBarriers.find(b => b.id === id);
    setActiveId(id);
    setActiveItem(barrier || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setBarrierOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
    setActiveItem(null);
  };

  // 정렬된 차단기 목록
  const sortedBarriers = barrierOrder.map(id => barriers.find(b => b.id === id)!).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <section className="flex justify-between items-center p-4 rounded-lg neu-flat">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground font-multilang">
            차단기 관리
          </h2>
          <div className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-muted">
            <span className="font-medium">출입유형 관리</span>
          </div>
        </div>
      </section>

      {/* 차단기 카드 그리드 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={barrierOrder} strategy={verticalListSortingStrategy}>
          <section className={gridClass}>
            {sortedBarriers.map((barrier, index) => {
              const commonProps = {
                barrier,
                orderIndex: index,
                totalCount: sortedBarriers.length,
                onToggle: () => handleBarrierToggle(barrier.id),
                onOperationModeChange: (mode: OperationMode) => handleOperationModeChange(barrier.id, mode),
              };

              return (
                <VehicleTypeCard 
                  key={barrier.id} 
                  {...commonProps} 
                  onPolicyUpdate={(policies: Record<string, boolean>) => 
                    handleIndividualPolicyUpdate(barrier.id, policies)
                  }
                />
              );
            })}
          </section>
        </SortableContext>
        
        <DragOverlay>
          {activeId && activeItem ? (
            <div className="w-80 h-32 bg-primary/80 rounded-lg shadow-lg flex items-center justify-center text-white font-bold">
              {activeItem.name}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* 빈 상태 처리 */}
      {barriers.length === 0 && (
        <div className="flex flex-col justify-center items-center py-12 text-center">
          <div className="mb-4">
            <Construction className="mx-auto w-16 h-16" />
          </div>
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
};

export default BarrierManagementView;
// #endregion 