/*
  파일명: sortableTable/SortableTable.tsx
  기능: 드래그 앤 드롭 가능한 테이블 컴포넌트
  책임: BaseTable 로직 + @dnd-kit DND 기능 조합
*/

'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { SortableTableRow } from './SortableTableRow';
import { SortableTableProps } from './types';

const SortableTable = <T extends { id?: string | number }>({
  data,
  columns,
  className = '',
  headerClassName = '',
  getRowClassName = '',
  cellClassName = '',
  dragHandleColumn,
  onOrderChange,
  loadingRows = 5,
  onRowClick,
  minWidth,
  itemName = '항목',
}: SortableTableProps<T>) => {
  // #region 훅 및 상태
  const [activeId, setActiveId] = useState<string | null>(null);

  // DND 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동 후 드래그 시작
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 계산된 값
  const isLoading = !data || data.length === 0;
  const displayData = data ?? [];
  const items = displayData.map((item, index) => String(item.id || index));
  // #endregion

  // #region DND 핸들러
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id && over) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(displayData, oldIndex, newIndex);
        onOrderChange(newOrder);
      }
    }
    
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };
  // #endregion

  // #region 헤더 렌더링
  const renderHeader = () => (
    <thead className={cn('border-b bg-serial-4 border-primary-4/30', headerClassName)}>
      <tr>
        {columns.map((column, colIndex) => {
          const columnKey = column.key ? String(column.key) : `col-${colIndex}`;

          return (
            <th
              key={columnKey}
              className={cn(
                'relative px-6 py-3 text-xs font-medium text-primary-8 uppercase tracking-wider text-center',
                colIndex < columns.length - 1 ? 'border-r border-primary-4/30' : '',
                column.headerClassName || '',
                colIndex === 0 ? 'rounded-tl-lg' : '',
                colIndex === columns.length - 1 ? 'rounded-tr-lg' : ''
              )}
              style={{ width: column.width }}
            >
              <span className="block text-base truncate font-multilang">
                {column.header}
              </span>
            </th>
          );
        })}
      </tr>
    </thead>
  );
  // #endregion

  // #region 바디 렌더링
  const renderBody = () => (
    <tbody className="divide-y bg-background divide-border">
      {isLoading ? (
        // 로딩 상태
        Array.from({ length: Math.min(loadingRows, 10) }, (_, index) => (
          <tr key={`loading-${index}`} className="animate-pulse">
            {columns.map((column, colIndex) => (
              <td
                key={`loading-${index}-${String(column.key)}`}
                className={cn(
                  'px-6 py-4',
                  colIndex < columns.length - 1 ? 'border-r border-primary-4/30' : '',
                  cellClassName
                )}
              >
                <div className="h-5 rounded bg-muted neu-flat"></div>
              </td>
            ))}
          </tr>
        ))
      ) : displayData.length === 0 ? (
        // 빈 데이터 상태
        <tr>
          <td
            colSpan={columns.length}
            className={cn('px-6 py-12 text-center text-muted-foreground', cellClassName)}
          >
            표시할 {itemName}이(가) 없습니다.
          </td>
        </tr>
      ) : (
        // DND 가능한 데이터 렌더링 - SortableContext를 tbody 밖으로 이동
        displayData.map((item, index) => (
          <SortableTableRow
            key={String(item.id || index)}
            item={item}
            index={index}
            columns={columns}
            dragHandleColumn={dragHandleColumn}
            getRowClassName={getRowClassName}
            cellClassName={cellClassName}
            onRowClick={onRowClick}
          />
        ))
      )}
    </tbody>
  );
  // #endregion

  // #region 드래그 오버레이
  const renderDragOverlay = () => {
    const activeItem = activeId ? displayData.find((item, index) => 
      String(item.id || index) === activeId) : null;
    const activeIndex = activeItem ? displayData.indexOf(activeItem) : -1;

    if (!activeItem || activeIndex === -1) return null;

    // 드래그 오버레이에서는 행만 표시 (테이블 헤더 제외)
    return (
      <div className="rounded-lg border shadow-lg opacity-90 bg-background border-primary-4/30">
        <table className="w-full">
          <tbody>
            <SortableTableRow
              item={activeItem}
              index={activeIndex}
              columns={columns}
              dragHandleColumn={dragHandleColumn}
              getRowClassName={getRowClassName}
              cellClassName={cellClassName}
              onRowClick={() => {}} // 드래그 오버레이에서는 클릭 비활성화
            />
          </tbody>
        </table>
      </div>
    );
  };
  // #endregion

  // #region 렌더링
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        className={cn(
          'overflow-auto rounded-lg neu-flat-primary scrollbar-gutter-stable',
          className
        )}
      >
        <table
          className="w-full rounded-lg bg-background"
          style={{ 
            tableLayout: 'fixed', 
            borderSpacing: 0, 
            borderCollapse: 'separate',
            minWidth: minWidth 
          }}
        >
          {renderHeader()}
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {renderBody()}
          </SortableContext>
        </table>
      </div>
      
      {/* 드래그 오버레이 */}
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
      >
        {renderDragOverlay()}
      </DragOverlay>
    </DndContext>
  );
  // #endregion
};

export { SortableTable };
export type { SortableTableProps, SortableTableColumn } from './types';
