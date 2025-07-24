/* 
  파일명: /app/temp/menu-management/MenuManager/MenuConfigurationCard/MenuTree/MenuTree.tsx
  기능: 메뉴 트리 전체를 렌더링하는 컴포넌트
  책임: 메뉴 목록 표시, 로딩 상태 처리, 빈 상태 처리
*/ // ------------------------------

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useState } from 'react';

import { MenuTreeItem } from './MenuTreeItem';

import type { MenuItem } from '../../useMenuOperations';

// #region 타입 정의
interface MenuTreeProps {
  menuTree: MenuItem[];
  loading: boolean;
  expandedMenus: Set<number>;
  assignedMenuIds: Set<number>;
  isReadOnly?: boolean;
  selectedParkingLot?: number | null;
  onToggleMenu: (menuId: number) => void;
  onToggleExpansion: (menuId: number) => void;
  onDragEnd?: (event: DragEndEvent) => void;
}
// #endregion

export function MenuTree({
  menuTree,
  loading,
  expandedMenus,
  assignedMenuIds,
  isReadOnly = false,
  selectedParkingLot,
  onToggleMenu,
  onToggleExpansion,
  onDragEnd,
}: MenuTreeProps) {
  // #region 상태
  const [overId, setOverId] = useState<number | null>(null);
  // #endregion

  // #region DND 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // #endregion

  // #region 드래그 이벤트 핸들러
  const handleDragStart = () => {
    // DragOverlay 제거로 인해 activeId 추적 불필요
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over ? Number(event.over.id) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setOverId(null);
    onDragEnd?.(event);
  };

  const handleDragCancel = () => {
    setOverId(null);
  };
  // #endregion

  // #region 유틸리티 함수
  // DragOverlay 제거로 인해 activeItem 관련 코드 불필요
  // #endregion

  // #region 렌더링
  return (
    <div className="neu-inset border-border max-h-[500px] overflow-y-auto scrollbar-gutter-stable p-2 rounded-xl bg-muted">
      {!loading && menuTree.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={menuTree.map(menu => menu.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-0">
              {menuTree.map((menu, index) => (
                <MenuTreeItem
                  key={menu.id}
                  menu={menu}
                  level={0}
                  rowIndex={index}
                  expandedMenus={expandedMenus}
                  assignedMenuIds={assignedMenuIds}
                  isReadOnly={isReadOnly}
                  selectedParkingLot={selectedParkingLot}
                  onToggleMenu={onToggleMenu}
                  onToggleExpansion={onToggleExpansion}
                  isDragOver={overId === menu.id}
                />
              ))}
            </div>
          </SortableContext>
          
          {/* DragOverlay 제거 - 기본 드래그 동작 사용 (더 안정적) */}
        </DndContext>
      ) : null}
    </div>
  );
  // #endregion
}