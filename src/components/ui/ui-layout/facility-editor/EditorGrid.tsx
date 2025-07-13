import { FacilityLayout, Position, CellType } from '@/types/facility-editor';
import { clsx } from 'clsx';
import { useEffect, useRef } from 'react';

// #region 타입 정의
interface EditorGridProps {
  layout: FacilityLayout;
  selectedCells: Position[];
  selectedTool: CellType;
  isDragging: boolean;
  dragStart: Position | null;
  dragEnd: Position | null;
  onCellClick: (position: Position, ctrlKey?: boolean, shiftKey?: boolean) => void;
  onCellDoubleClick: (position: Position) => void;
  onCellRightClick: (position: Position) => void;
  onDragStart: (position: Position) => void;
  onDragMove: (position: Position) => void;
  onDragEnd: () => void;
}
// #endregion

// #region 유틸리티 함수
const getCellByPosition = (layout: FacilityLayout, position: Position) => {
  return layout.cells.find(cell => cell.x === position.x && cell.y === position.y);
};

const getCellDisplayName = (cell: { type: CellType; name: string }) => {
  if (cell.type === 'empty') return '';
  if (cell.name.trim()) return cell.name;
  
  // 기본 이름 생성
  const defaultNames: Record<CellType, string> = {
    empty: '',
    seat: '좌석',
    object: '사물'
  };
  
  return defaultNames[cell.type];
};

const getCellBackgroundColor = (type: CellType) => {
  const colorMap: Record<CellType, string> = {
    empty: 'bg-surface-1',
    seat: 'bg-green-100 dark:bg-green-900',
    object: 'bg-yellow-100 dark:bg-yellow-900'
  };
  
  return colorMap[type];
};

const getCellBorderColor = (type: CellType) => {
  const colorMap: Record<CellType, string> = {
    empty: 'border-gray-300 dark:border-gray-600',
    seat: 'border-green-300 dark:border-green-700',
    object: 'border-yellow-300 dark:border-yellow-700'
  };
  
  return colorMap[type];
};

const getCellTextColor = (type: CellType) => {
  const colorMap: Record<CellType, string> = {
    empty: 'text-gray-500',
    seat: 'text-green-800 dark:text-green-100',
    object: 'text-yellow-800 dark:text-yellow-100'
  };
  
  return colorMap[type];
};

// 마우스 위치를 그리드 좌표로 변환
const getGridPositionFromMouseEvent = (
  e: MouseEvent,
  containerRect: DOMRect,
  gridSize: { width: number; height: number },
  cellSize: number
): Position | null => {
  const x = Math.floor((e.clientX - containerRect.left) / cellSize);
  const y = Math.floor((e.clientY - containerRect.top) / cellSize);
  
  if (x >= 0 && x < gridSize.width && y >= 0 && y < gridSize.height) {
    return { x, y };
  }
  
  return null;
};
// #endregion

// #region 메인 컴포넌트
export const EditorGrid = ({
  layout,
  selectedCells,
  selectedTool: _selectedTool,
  isDragging,
  dragStart,
  dragEnd,
  onCellClick,
  onCellDoubleClick,
  onCellRightClick,
  onDragStart,
  onDragMove,
  onDragEnd,
}: EditorGridProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = _selectedTool;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const cellSize = layout.cellSize;

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const position = getGridPositionFromMouseEvent(e, rect, layout.gridSize, cellSize);
      
      if (position) {
        onDragMove(position);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        onDragEnd();
      }
    };

    if (isDragging) {
      isDraggingRef.current = true;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, layout.gridSize, cellSize, onDragMove, onDragEnd]);

  return (
    <div className="overflow-auto p-4 rounded-lg neu-inset bg-surface-1">
      <div
        ref={containerRef}
        className="relative"
        style={{
          width: layout.gridSize.width * cellSize,
          height: layout.gridSize.height * cellSize,
        }}
      >
        {/* 격자 배경 */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ccc 1px, transparent 1px),
              linear-gradient(to bottom, #ccc 1px, transparent 1px)
            `,
            backgroundSize: `${cellSize}px ${cellSize}px`,
          }}
        />
        
        {/* 셀 렌더링 */}
        {Array.from({ length: layout.gridSize.height }, (_, y) =>
          Array.from({ length: layout.gridSize.width }, (_, x) => {
            const position: Position = { x, y };
            const cell = getCellByPosition(layout, position) || {
              x,
              y,
              type: 'empty' as CellType,
              name: ''
            };
            
            const displayName = getCellDisplayName(cell);
            
            return (
              <div
                key={`${x}-${y}`}
                className={clsx(
                  'absolute border-2 flex items-center justify-center text-xs font-medium cursor-pointer',
                  'transition-all duration-150 hover:scale-105',
                  getCellBackgroundColor(cell.type),
                  getCellBorderColor(cell.type),
                  getCellTextColor(cell.type),
                  'neu-flat hover:neu-raised'
                )}
                style={{
                  left: x * cellSize,
                  top: y * cellSize,
                  width: cellSize,
                  height: cellSize,
                }}
                onClick={(e) => onCellClick(position, e.ctrlKey, e.shiftKey)}
                onDoubleClick={() => onCellDoubleClick(position)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onCellRightClick(position);
                }}
                onMouseDown={(e) => {
                  if (e.button === 0) { // 좌클릭만
                    e.preventDefault();
                    onDragStart(position);
                  }
                }}
                title={`${x},${y} - ${cell.type} ${displayName ? `(${displayName})` : ''}`}
              >
                {displayName && (
                  <span className="px-1 truncate font-multilang text-center">
                    {displayName}
                  </span>
                )}
              </div>
            );
          })
        )}
        
        {/* 선택된 셀 포커스 링 오버레이 */}
        {selectedCells.map((pos) => (
          <div
            key={`focus-${pos.x}-${pos.y}`}
            className="absolute border-2 border-blue-500 bg-transparent pointer-events-none"
            style={{
              left: pos.x * cellSize,
              top: pos.y * cellSize,
              width: cellSize,
              height: cellSize,
            }}
          />
        ))}
        
        {/* 드래그 하이라이트 오버레이 (테두리만) */}
        {isDragging && dragStart && (
          <div
            className="absolute border-2 border-blue-400 bg-transparent pointer-events-none"
            style={{
              left: dragEnd 
                ? Math.min(dragStart.x, dragEnd.x) * cellSize
                : dragStart.x * cellSize,
              top: dragEnd 
                ? Math.min(dragStart.y, dragEnd.y) * cellSize
                : dragStart.y * cellSize,
              width: dragEnd 
                ? (Math.abs(dragEnd.x - dragStart.x) + 1) * cellSize
                : cellSize,
              height: dragEnd 
                ? (Math.abs(dragEnd.y - dragStart.y) + 1) * cellSize
                : cellSize,
            }}
          />
        )}
      </div>
    </div>
  );
};
// #endregion 