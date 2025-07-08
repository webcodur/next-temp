'use client';

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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// 타입
export type GateKey = '정문입차' | '정문출차';

export default function BarrierOrderTab() {
  const [barrierOrder, setBarrierOrder] = useState<GateKey[]>(['정문입차', '정문출차']);
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <section className="flex flex-col gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event: DragEndEvent) => {
          const { active, over } = event;
          if (!over || active.id === over.id) return;
          setBarrierOrder((prev) => {
            const oldIndex = prev.findIndex((g) => g === active.id);
            const newIndex = prev.findIndex((g) => g === over.id);
            return arrayMove(prev, oldIndex, newIndex);
          });
        }}
      >
        <SortableContext items={barrierOrder} strategy={rectSortingStrategy}>
          {barrierOrder.map((gate, idx) => (
            <SortableItem key={gate} id={gate} index={idx} />
          ))}
        </SortableContext>
      </DndContext>
    </section>
  );
}

// ----------------------------------------------------------------------
// Sortable Item
interface SortableItemProps {
  id: GateKey;
  index: number;
}

function SortableItem({ id, index }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center px-4 py-3 rounded-lg neu-flat cursor-grab hover:neu-hover neu-elevated"
      {...attributes}
      {...listeners}
    >
      <span className="text-sm font-multilang md:text-base">
        <span className="mr-2 text-muted-foreground">{index + 1}번 차단기</span>
        {id}
      </span>
      <span className="text-xs select-none text-muted-foreground">☰</span>
    </div>
  );
} 