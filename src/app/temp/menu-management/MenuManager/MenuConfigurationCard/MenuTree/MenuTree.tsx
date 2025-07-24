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
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
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
  onToggleMenu,
  onToggleExpansion,
  onDragEnd,
}: MenuTreeProps) {
  // #region 상태
  const [activeId, setActiveId] = useState<number | null>(null);
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
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over ? Number(event.over.id) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setOverId(null);
    onDragEnd?.(event);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };
  // #endregion

  // #region 유틸리티 함수
  const findMenuItem = (id: number): MenuItem | null => {
    const findInTree = (items: MenuItem[]): MenuItem | null => {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
          const found = findInTree(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findInTree(menuTree);
  };

  const activeItem = activeId ? findMenuItem(activeId) : null;
  // #endregion

  // #region 렌더링
  return (
    <div className="border border-gray-200 max-h-[500px] overflow-y-auto scrollbar-gutter-stable p-2 rounded-xl bg-gray-50">
      {loading ? (
        <div className="py-12 text-center">
          <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="text-blue-600">⚡</div>
          </div>
          <div className="text-lg font-medium text-muted-foreground">메뉴 로딩 중...</div>
        </div>
      ) : menuTree.length > 0 ? (
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
                  onToggleMenu={onToggleMenu}
                  onToggleExpansion={onToggleExpansion}
                  isDragOver={overId === menu.id}
                />
              ))}
            </div>
          </SortableContext>
          
          {/* DragOverlay for better drag preview */}
          <DragOverlay>
            {activeItem && (
              <div className="bg-white border-2 border-blue-500 rounded-lg shadow-lg opacity-90">
                <MenuTreeItem
                  menu={activeItem}
                  level={0}
                  rowIndex={0}
                  expandedMenus={expandedMenus}
                  assignedMenuIds={assignedMenuIds}
                  isReadOnly={true}
                  onToggleMenu={() => {}}
                  onToggleExpansion={() => {}}
                  isDragOver={false}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="py-12 text-center">
          <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="text-2xl text-muted-foreground">📄</div>
          </div>
          <div className="text-lg font-medium text-muted-foreground">주차장을 선택하면 메뉴가 표시됩니다</div>
        </div>
      )}
    </div>
  );
  // #endregion
}