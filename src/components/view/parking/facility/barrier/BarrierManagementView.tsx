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
import { BarrierManagementViewProps } from './types';
import { useFunctionMode } from './hooks/useBarrierViewMode';
import { useBarrierOperations } from './hooks/useBarrierOperations';
import { getResponsiveGridClass } from './utils/viewModeConfig';
import FunctionModeToggle from './shared/ViewModeToggle';
import VehicleTypeCard from './modes/VehicleTypeCard';
import BarrierOperationCard from './modes/BarrierOperationCard';
import { OperationMode } from '@/types/parking';

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
    functionModeState,
    setGlobalFunctionMode,
  } = useFunctionMode();

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
  const [barrierOrder, setBarrierOrder] = useState<string[]>(() => 
    barriers.map(barrier => barrier.id)
  );

  // 드래그 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
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
    setActiveId(event.active.id as string);
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
  };

  // 정렬된 차단기 목록
  const sortedBarriers = barrierOrder.map(id => barriers.find(b => b.id === id)!).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* 기능 모드 토글 */}
      <FunctionModeToggle
        currentMode={functionModeState.globalMode}
        onModeChange={setGlobalFunctionMode}
      />

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

              return functionModeState.globalMode === 'vehicle-type' ? (
                <VehicleTypeCard 
                  key={barrier.id} 
                  {...commonProps} 
                  onPolicyUpdate={(policies: Record<string, boolean>) => 
                    handleIndividualPolicyUpdate(barrier.id, policies)
                  }
                />
              ) : (
                <BarrierOperationCard key={barrier.id} {...commonProps} />
              );
            })}
          </section>
        </SortableContext>
        
        <DragOverlay>
          {activeId ? (
            <div className="p-4 rounded-lg neu-flat bg-surface-2 h-[400px] flex flex-col opacity-80">
              <div className="flex justify-between items-center p-2 mb-4 rounded-lg bg-muted/50 cursor-grabbing">
                {/* 왼쪽: 드래그 상태 표시 */}
                <div className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-muted min-w-[60px]">
                  <span className="font-medium">드래그 중</span>
                </div>

                {/* 중앙: 차단기명 */}
                <div className="flex flex-1 justify-center items-center">
                  <h3 className="font-semibold text-center text-foreground font-multilang">
                    {sortedBarriers.find(b => b.id === activeId)?.name || '차단기'}
                  </h3>
                </div>

                {/* 오른쪽: 빈 공간 (대칭성 유지) */}
                <div className="min-w-[60px]"></div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* 빈 상태 처리 */}
      {barriers.length === 0 && (
        <div className="flex flex-col justify-center items-center py-12 text-center">
          <div className="mb-4 text-4xl">🚧</div>
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