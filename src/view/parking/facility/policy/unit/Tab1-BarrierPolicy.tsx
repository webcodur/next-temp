'use client';

// Tab1-BarrierPolicy.tsx : 차단기 정책 탭 (게이트별 출입차량 + 순서 설정)

import React, { useState } from 'react';
import { Pencil, Check, X, GripVertical } from 'lucide-react';
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
  useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/ui-input/button/Button';
import { Chip } from '@/components/ui/ui-effects/chip/Chip';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import BarrierDiagonalView from '@/unit/barrier/BarrierDiagonalView';
import BarrierDriverView from '@/unit/barrier/BarrierDriverView';
import BarrierSecurityView from '@/unit/barrier/BarrierSecurityView';

// 상수·초기값 --------------------------------------------------
const TITLE_STYLE =
  'text-lg font-bold text-center font-multilang h-8 flex items-center justify-center';
const ACTION_ICON_CONTAINER_STYLE =
  'flex absolute top-2 right-2 gap-1 w-20 justify-end';

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

// 뷰 타입 --------------------------------------------------
type ViewType = 'diagonal' | 'driver' | 'security';

// 초기값 업데이트
const initialGateView: Record<string, ViewType> = {
  정문입차: 'diagonal',
  정문출차: 'diagonal',
};

// 컴포넌트 ----------------------------------------------------
export default function Tab1BarrierPolicy() {
  // 상태 -----------------------------------
  const [gateOrder, setGateOrder] = useState<string[]>(initialGateOrder);
  const [gatePolicies, setGatePolicies] = useState(initialGatePolicy);
  const [gateViews, setGateViews] = useState<Record<string, ViewType>>(initialGateView);
  const [editGate, setEditGate] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [gateDisplayNames, setGateDisplayNames] = useState<Record<string, string>>({
    정문입차: '정문입차',
    정문출차: '정문출차',
  });

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

  // 핸들러 ---------------------------------
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

  // 렌더링 ---------------------------------
  return (
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
  );
}

// ----------------------------------------------------------------------
// Sortable Gate Card
interface GateCardProps {
  id: string;
  orderLabel: string;
  isEditing: boolean;
  gateDisplayName: string;
  categories: Record<string, boolean>;
  selectedView: ViewType;
  setView: (v: ViewType) => void;
  toggleCategory: (gate: string, cat: string) => void;
  onEditStart: () => void;
  onEditCancel: () => void;
  onEditSave: () => void;
  editingName: string;
  setEditingName: React.Dispatch<React.SetStateAction<string>>;
}

function GateCard({
  id,
  orderLabel,
  isEditing,
  gateDisplayName,
  categories,
  selectedView,
  setView,
  toggleCategory,
  onEditStart,
  onEditCancel,
  onEditSave,
  editingName,
  setEditingName,
}: GateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
  };

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectView = (view: ViewType) => {
    setView(view);
    setIsModalOpen(false);
  };

  const VIEW_LABEL: Record<ViewType, string> = {
    diagonal: '대각선',
    driver: '운전자',
    security: '보안카메라',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex relative flex-col gap-4 p-6 rounded-xl border-gray-400 shadow-xl border-1">
      {/* 드래그 핸들 */}
      <button
        className="absolute top-2 left-2 p-1 text-muted-foreground cursor-grab"
        {...attributes}
        {...listeners}
        aria-label="reorder-gate">
        <GripVertical size={20} />
      </button>

      {/* 게이트 제목 + 순서 */}
      {isEditing ? (
        <input
          className={`px-2 mx-auto w-40 rounded-md outline-none ${TITLE_STYLE} neu-flat focus:neu-inset bg-background`}
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <h2 className={TITLE_STYLE}>
          {gateDisplayName}
          <span className="ml-2 text-sm font-normal text-muted-foreground">{orderLabel}</span>
        </h2>
      )}

      {/* 액션 아이콘 */}
      <div className={ACTION_ICON_CONTAINER_STYLE}>
        {isEditing ? (
          <>
            <Button variant="ghost" size="icon" onClick={onEditSave}>
              <Check size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onEditCancel}>
              <X size={16} />
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="icon" onClick={onEditStart}>
            <Pencil size={16} />
          </Button>
        )}
      </div>

      {/* 카테고리 버튼들 */}
      <div className="grid grid-cols-2 gap-2">
        {defaultCategories.map((cat) => {
          const active = categories?.[cat] || false;
          return (
            <Chip
              key={cat}
              label={cat}
              active={active}
              disabled={!isEditing}
              onToggle={() => toggleCategory(id, cat)}
            />
          );
        })}
      </div>

      {/* 뷰 설정 */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="text-sm font-multilang">시점:</span>
        <span className="text-sm font-semibold text-primary">{VIEW_LABEL[selectedView]}</span>
        <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(true)}>
          변경
        </Button>
      </div>

      {/* 뷰 선택 모달 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="시점 선택" size="lg">
        <div className="grid gap-4 md:grid-cols-3">
          <div
            className="cursor-pointer flex flex-col items-center gap-2"
            onClick={() => handleSelectView('diagonal')}>
            <BarrierDiagonalView width={200} height={240} showTitle={false} showControls={false} />
            <span className="text-sm font-multilang">대각선</span>
          </div>
          <div
            className="cursor-pointer flex flex-col items-center gap-2"
            onClick={() => handleSelectView('driver')}>
            <BarrierDriverView width={200} height={240} showTitle={false} showControls={false} />
            <span className="text-sm font-multilang">운전자</span>
          </div>
          <div
            className="cursor-pointer flex flex-col items-center gap-2"
            onClick={() => handleSelectView('security')}>
            <BarrierSecurityView width={200} height={240} showTitle={false} showControls={false} />
            <span className="text-sm font-multilang">보안카메라</span>
          </div>
        </div>
      </Modal>
    </div>
  );
} 