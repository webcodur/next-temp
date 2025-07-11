/* 
  파일명: /view/parking/facility/barrier/BarrierPolicyPage.tsx
  기능: 차단기별 차량 카테고리 정책 관리 페이지
  책임: 차단기 순서 변경, 정책 설정, 시점 변경 기능을 제공한다.
*/

import React, { useState } from 'react';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import { usePageDescription } from '@/hooks/usePageDescription';
import GateCard from '@/unit/barrier/GateCard';

// #region 타입
type ViewType = 'diagonal' | 'driver' | 'security';
// #endregion

// #region 상수
const defaultCategories = [
  '입주',
  '방문',
  '업무',
  '정기',
  '임대',
  '상가',
  '미등록',
  '택시(택배 포함)',
];

const initialGateOrder = ['정문입차', '정문출차'];

const initialGatePolicy = {
  정문입차: {
    categories: {
      입주: true,
      방문: true,
      업무: true,
      정기: true,
      임대: true,
      상가: true,
      미등록: true,
      '택시(택배 포함)': true,
    },
  },
  정문출차: {
    categories: {
      입주: true,
      방문: false,
      업무: false,
      정기: true,
      임대: false,
      상가: false,
      미등록: false,
      '택시(택배 포함)': false,
    },
  },
};

const initialGateView: Record<string, ViewType> = {
  정문입차: 'diagonal',
  정문출차: 'diagonal',
};
// #endregion

export default function BarrierPolicyPage() {
  usePageDescription('차단기 출입유형 및 메인화면 노출 순서를 설정합니다.');

  // #region 상태
  const [gateOrder, setGateOrder] = useState<string[]>(initialGateOrder);
  const [gatePolicies, setGatePolicies] = useState(initialGatePolicy);
  const [gateViews, setGateViews] = useState<Record<string, ViewType>>(initialGateView);
  const [editGate, setEditGate] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [gateDisplayNames, setGateDisplayNames] = useState<Record<string, string>>({
    정문입차: '정문입차',
    정문출차: '정문출차',
  });
  // #endregion

  // #region 훅
  // PointerSensor 에 최소 이동 거리 제약을 주어 의도치 않은 드래그 시작을 방지하고
  // 드래그 종료 후 자연스러운 안착 애니메이션을 위해 transition easing 을 수정한다.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // 5px 이상 이동해야 드래그가 시작되도록 설정 → 튕기는 느낌 감소
      activationConstraint: {
        distance: 5,
      },
    }),
  );
  // #endregion

  // #region 통계 계산
  const totalGates = gateOrder.length;
  const totalCategories = defaultCategories.length;
  const enabledPolicies = gateOrder.reduce((acc, gate) => {
    const policies = (gatePolicies as Record<string, { categories: Record<string, boolean> }>)[gate]?.categories || {};
    return acc + Object.values(policies).filter(Boolean).length;
  }, 0);
  const totalPolicies = totalGates * totalCategories;
  const coveragePercentage = totalPolicies > 0 ? Math.round((enabledPolicies / totalPolicies) * 100) : 0;
  // #endregion

  // #region 핸들러
  const toggleCategory = (gate: string, cat: string) => {
    setGatePolicies((prev) => ({
      ...prev,
      [gate]: {
        categories: {
          ...((prev as Record<string, { categories: Record<string, boolean> }>)[gate]
            ?.categories || {}),
          [cat]: !(
            (prev as Record<string, { categories: Record<string, boolean> }>)[gate]
              ?.categories?.[cat]
          ),
        },
      },
    }));
  };

  const saveGateName = (gate: string) => {
    if (!editingName.trim()) return;
    setGateDisplayNames((prev) => ({ ...prev, [gate]: editingName.trim() }));
    setEditGate(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setGateOrder((prev) => {
      const oldIndex = prev.findIndex((g) => g === active.id);
      const newIndex = prev.findIndex((g) => g === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const setGateView = (gate: string, view: ViewType) =>
    setGateViews((prev) => ({ ...prev, [gate]: view }));
  // #endregion

  // #region 렌더링
  return (
    <div className="space-y-6">
      {/* 통계 섹션 */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="p-4 text-center rounded-lg neu-flat">
          <div className="text-2xl font-bold text-primary font-multilang">{totalGates}</div>
          <div className="text-sm text-muted-foreground font-multilang">총 차단기</div>
        </div>
        <div className="p-4 text-center rounded-lg neu-flat">
          <div className="text-2xl font-bold text-primary font-multilang">{totalCategories}</div>
          <div className="text-sm text-muted-foreground font-multilang">출입 유형</div>
        </div>
        <div className="p-4 text-center rounded-lg neu-flat">
          <div className="text-2xl font-bold text-primary font-multilang">{enabledPolicies}</div>
          <div className="text-sm text-muted-foreground font-multilang">활성 정책</div>
        </div>
        <div className="p-4 text-center rounded-lg neu-flat">
          <div className="text-2xl font-bold text-primary font-multilang">{coveragePercentage}%</div>
          <div className="text-sm text-muted-foreground font-multilang">정책 적용률</div>
        </div>
      </section>

      {/* 차단기 카드 섹션 */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={gateOrder} strategy={rectSortingStrategy}>
          <section className="grid gap-6 md:grid-cols-2">
            {gateOrder.map((gate, idx) => {
              const isEditing = editGate === gate;
              return (
                <GateCard
                  key={gate}
                  id={gate}
                  orderLabel={`${idx + 1}/${gateOrder.length}`}
                  isEditing={isEditing}
                  gateDisplayName={gateDisplayNames[gate] || gate}
                  selectedView={gateViews[gate]}
                  setView={(v) => setGateView(gate, v)}
                  toggleCategory={toggleCategory}
                  categories={(
                    gatePolicies as Record<string, { categories: Record<string, boolean> }>
                  )[gate]?.categories || {}}
                  onEditStart={() => {
                    setEditGate(gate);
                    setEditingName(gateDisplayNames[gate]);
                  }}
                  onEditCancel={() => setEditGate(null)}
                  onEditSave={() => saveGateName(gate)}
                  editingName={editingName}
                  setEditingName={setEditingName}
                />
              );
            })}
          </section>
        </SortableContext>
      </DndContext>
    </div>
  );
  // #endregion
} 