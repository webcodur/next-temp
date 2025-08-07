/* 
  파일명: PolicyPanel.tsx
  기능: 전역 정책 설정과 차단기 카드 그리드 관리
  책임: 전역 출입 정책 설정과 개별 차단기 카드들을 통합 관리한다.
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
} from '@dnd-kit/core';
import { 
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { Construction } from 'lucide-react';

import { ParkingBarrier, OperationMode } from '@/types/parking';
import { SimpleRadioGroup } from '@/components/ui/ui-input/simple-input/SimpleRadioGroup';
import { SimpleToggleSwitch } from '@/components/ui/ui-input/simple-input/SimpleToggleSwitch';

import BarrierCard from '../barrierManager/barrierCard/BarrierCard';

// #region 타입 정의
export type EntryPolicyType = 'all' | 'office';

interface BarrierPolicy {
  workHour: boolean;
  blacklist: boolean;
}

interface PolicyPanelProps {
  barriers: ParkingBarrier[];
  barrierPolicies: Record<string, BarrierPolicy>;
  barrierOrder: string[];
  entryPolicy: EntryPolicyType;
  returnHourEnabled: boolean;
  warningCount: number;
  onBarrierToggle: (barrierId: string) => void;
  onOperationModeChange: (barrierId: string, mode: OperationMode) => void;
  onPolicyUpdate: (barrierId: string, policy: BarrierPolicy) => void;
  onBarrierOrderChange: (newOrder: string[]) => void;
  onEntryPolicyChange: (policy: EntryPolicyType) => void;
  onReturnHourEnabledChange: (enabled: boolean) => void;
  onWarningCountChange: (count: number) => void;
}
// #endregion

// #region 반응형 그리드 클래스
const getResponsiveGridClass = () => {
  return 'grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
};
// #endregion

// #region 메인 컴포넌트
const PolicyPanel: React.FC<PolicyPanelProps> = ({
  barriers,
  barrierPolicies,
  barrierOrder,
  entryPolicy,
  returnHourEnabled,
  warningCount,
  onBarrierToggle,
  onOperationModeChange,
  onPolicyUpdate,
  onBarrierOrderChange,
  onEntryPolicyChange,
  onReturnHourEnabledChange,
  onWarningCountChange,
}) => {
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
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id && over) {
      const oldIndex = barrierOrder.indexOf(active.id as string);
      const newIndex = barrierOrder.indexOf(over.id as string);
      const newOrder = arrayMove(barrierOrder, oldIndex, newIndex);
      onBarrierOrderChange(newOrder);
    }
  };

  const handleEntryPolicyChange = (value: string) => {
    onEntryPolicyChange(value as EntryPolicyType);
  };
  // #endregion

  // #region 계산된 값
  const gridClass = getResponsiveGridClass();
  const sortedBarriers = barrierOrder
    .map(id => barriers.find(b => b.id === id))
    .filter(Boolean) as ParkingBarrier[];
  // #endregion

  // #region 렌더링
  return (
    <div className="flex flex-col gap-10">
      {/* 전역 정책 설정 */}
      <div className="flex flex-col gap-6 max-w-5xl">
        {/* 출입 허용 정책 */}
        <SimpleRadioGroup
          label="출입 허용"
          value={entryPolicy}
          onChange={handleEntryPolicyChange}
          layout="horizontal"
          options={[
            { label: '전체', value: 'all' },
            { label: '관리사무소 등록차량', value: 'office' },
          ]}
        />

        {/* 회차시간 사용 여부 */}
        <SimpleToggleSwitch
          label="회차시간 사용"
          checked={returnHourEnabled}
          onChange={onReturnHourEnabledChange}
          size="md"
        />

        {/* 블랙리스트 등록 기준 */}
        <div className="flex gap-3 items-center">
          <span className="text-sm font-medium font-multilang shrink-0">블랙리스트 등록 기준</span>
          <input
            type="number"
            min={1}
            className="px-3 py-1.5 w-16 text-center rounded-md outline-none neu-flat bg-background focus:neu-inset"
            value={warningCount}
            onChange={(e) => onWarningCountChange(Number(e.target.value))}
          />
          <span className="text-sm font-multilang shrink-0">회 이상 경고 시</span>
        </div>
      </div>

      {/* 차단기 카드 그리드 */}
      {returnHourEnabled && (
        <div className="space-y-6">
          <div className="flex gap-2 items-center">
            <h3 className="text-lg font-semibold text-foreground">차단기 관리</h3>
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground">
              {barriers.length}개 차단기
            </span>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
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
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

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
      )}

      {/* 회차시간이 비활성화된 경우 안내 */}
      {!returnHourEnabled && (
        <div className="flex flex-col justify-center items-center py-12 text-center">
          <div className="p-4 rounded-lg bg-muted/30">
            <p className="text-muted-foreground">
              회차시간 사용을 활성화하면 차단기별 세부 정책을 설정할 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
  // #endregion
};

export default PolicyPanel;
// #endregion 