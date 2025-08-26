/*
  파일명: sortableTable/SortableTableRow.tsx
  기능: 드래그 가능한 테이블 행 컴포넌트
  책임: useSortable 훅을 사용하여 개별 행에 DND 기능 제공
*/

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useLocale } from '@/hooks/ui-hooks/useI18n';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/ui-effects/tooltip/Tooltip';
import { SortableRowProps } from './types';

const SortableTableRow = <T extends { id?: string | number }>({
  item,
  index,
  columns,
  dragHandleColumn,
  getRowClassName,
  cellClassName,
  onRowClick,
}: SortableRowProps<T>) => {
  // #region 훅 및 상태
  const { isRTL } = useLocale();
  const itemId = String(item.id || index);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  // #endregion

  // #region 셀 컴포넌트
  const TableCell = ({ 
    column, 
    colIndex 
  }: {
    column: typeof columns[0];
    colIndex: number;
  }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    // 원시 값 계산
    const rawValue =
      column.key && item[column.key as keyof T]
        ? String(item[column.key as keyof T])
        : null;

    // 오버플로우 검사
    useEffect(() => {
      if (contentRef.current && rawValue) {
        const element = contentRef.current;
        setIsOverflowing(element.scrollWidth > element.clientWidth);
      }
    }, [rawValue]);

    // RTL 지원을 위한 정렬 클래스
    const getAlignmentClass = (align?: 'start' | 'center' | 'end') => {
      if (!align || align === 'start') {
        return isRTL ? 'text-end' : 'text-start';
      }
      if (align === 'end') {
        return isRTL ? 'text-start' : 'text-end';
      }
      return 'text-center';
    };

    // 드래그 핸들 렌더링
    const renderDragHandle = () => {
      if (column.key !== dragHandleColumn) return null;
      
      return (
        <div className="flex justify-center items-center">
          <div
            {...attributes}
            {...listeners}
            className="p-2 rounded transition-colors hover:bg-primary/10 cursor-grab active:cursor-grabbing"
            title="드래그하여 순서 변경"
          >
            <GripVertical size={18} className="text-muted-foreground hover:text-primary" />
          </div>
        </div>
      );
    };

    // 셀 내용 렌더링
    const renderCellContent = () => {
      // 드래그 핸들 컬럼인 경우
      if (column.key === dragHandleColumn) {
        return renderDragHandle();
      }

      const content = (() => {
        if (column.cell) return column.cell(item, index);
        if (column.render && column.key && column.key in item)
          return column.render(item[column.key as keyof T], item, index);
        if (rawValue !== null) return rawValue;
        return '';
      })();

      // 텍스트가 있고 오버플로우가 발생한 경우 tooltip으로 감싸기
      if (rawValue && isOverflowing) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                ref={contentRef}
                className="truncate cursor-help"
              >
                {content}
              </div>
            </TooltipTrigger>
            <TooltipContent variant="default" className="max-w-md">
              <div className="whitespace-pre-wrap break-words">
                {rawValue}
              </div>
            </TooltipContent>
          </Tooltip>
        );
      }

      return (
        <div 
          ref={contentRef}
          className="truncate"
        >
          {content}
        </div>
      );
    };

    return (
      <td
        className={cn(
          'px-6 py-4 text-sm text-foreground',
          getAlignmentClass(column.align),
          colIndex < columns.length - 1 ? 'border-r border-primary-4/30' : '',
          column.cellClassName || cellClassName
        )}
        style={{ minWidth: column.minWidth }}
      >
        {renderCellContent()}
      </td>
    );
  };
  // #endregion

  // #region 행 클래스 이름 계산
  const computeRowClassName = () => {
    if (typeof getRowClassName === 'function') {
      return (getRowClassName as (item: T, index: number) => string)(item, index);
    }
    return getRowClassName || '';
  };

  const hoverClass = onRowClick ? 'hover:bg-primary-2/[0.6] cursor-pointer' : '';
  const dragClass = isDragging ? 'opacity-50 shadow-lg z-10' : '';
  // #endregion

  // #region 렌더링
  return (
    <TooltipProvider>
      <tr
        ref={setNodeRef}
        style={style}
        onClick={() => onRowClick?.(item, index)}
        className={cn(
          index % 2 === 0 ? 'bg-serial-0' : 'bg-serial-1',
          hoverClass,
          dragClass,
          computeRowClassName()
        )}
      >
        {columns.map((column, colIndex) => (
          <TableCell
            key={`${itemId}-${column.key ? String(column.key) : colIndex}`}
            column={column}
            colIndex={colIndex}
          />
        ))}
      </tr>
    </TooltipProvider>
  );
  // #endregion
};

export { SortableTableRow };
