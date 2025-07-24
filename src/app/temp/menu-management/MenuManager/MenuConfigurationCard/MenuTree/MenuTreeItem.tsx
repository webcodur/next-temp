/* 
  파일명: /app/temp/menu-management/MenuManager/MenuConfigurationCard/MenuTree/MenuTreeItem.tsx
  기능: 메뉴 트리의 개별 아이템을 렌더링하는 컴포넌트
  책임: 메뉴 계층 구조 표시, 확장/축소, 체크박스 처리
*/ // ------------------------------

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronRight, ChevronDown, GripVertical } from 'lucide-react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { SimpleCheckbox } from '@/components/ui/ui-input/simple-input/SimpleCheckbox';

import type { MenuItem } from '../../useMenuOperations';

// #region 타입 정의
interface MenuTreeItemProps {
  menu: MenuItem;
  level: number;
  rowIndex: number;
  expandedMenus: Set<number>;
  assignedMenuIds: Set<number>;
  isReadOnly?: boolean;
  isDragOver?: boolean;
  selectedParkingLot?: number | null;
  onToggleMenu: (menuId: number) => void;
  onToggleExpansion: (menuId: number) => void;
}
// #endregion

export function MenuTreeItem({
  menu,
  level = 0,
  rowIndex,
  expandedMenus,
  assignedMenuIds,
  isReadOnly = false,
  isDragOver = false,
  selectedParkingLot,
  onToggleMenu,
  onToggleExpansion,
}: MenuTreeItemProps) {
  // #region 계산된 값
  const hasChildren = menu.children && menu.children.length > 0;
  const isExpanded = expandedMenus.has(menu.id);
  const isAssigned = assignedMenuIds.has(menu.id);
  
  // mid(level 2)와 bot(level 3) 메뉴에만 드래그 핸들 표시
  const shouldShowDragHandle = !isReadOnly && (menu.level === 2 || menu.level === 3);
  
  // 실제 드래그 활성화는 주차장이 선택된 경우에만
  const isDragEnabled = !isReadOnly && selectedParkingLot && (menu.level === 2 || menu.level === 3);
  
  let nextRowIndex = rowIndex + 1;
  // #endregion

  // #region DND 설정
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useSortable({
    id: menu.id,
    disabled: !isDragEnabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };
  // #endregion

  // #region 렌더링
  return (
    <div className="w-full">
      <div 
        ref={setNodeRef}
        style={style}
        onClick={() => !isReadOnly && onToggleMenu(menu.id)}
        className={`group ${
          !isReadOnly ? 'cursor-pointer' : 'cursor-default'
        } ${
          isDragOver 
            ? 'bg-primary/10' 
            : isAssigned 
              ? 'bg-primary/5' 
              : isReadOnly 
                ? 'hover:bg-accent active:scale-[0.998]' 
                : 'hover:bg-accent active:scale-[0.998]'
        } ${isDragging ? 'z-50' : ''} transition-all duration-150`}
      >
        <div
          className="flex items-center gap-1 py-2 px-4 min-h-[44px]"
          style={{ marginLeft: `${level * 50}px` }}
        >
          {/* 드래그 핸들 (mid/bot 메뉴에만 표시) */}
          {shouldShowDragHandle && (
            <div
              {...(isDragEnabled ? attributes : {})}
              {...(isDragEnabled ? listeners : {})}
              onClick={(e) => e.stopPropagation()}
              className={`flex flex-shrink-0 justify-center items-center w-6 h-6 ${
                isDragEnabled 
                  ? 'cursor-grab active:cursor-grabbing' 
                  : 'cursor-not-allowed'
              }`}
            >
              <GripVertical className={`w-4 h-4 transition-colors duration-150 ${
                isDragEnabled 
                  ? 'text-muted-foreground hover:text-foreground' 
                  : 'text-muted-foreground/50'
              }`} />
            </div>
          )}

          {/* 확장/축소 버튼 영역 */}
          <div className="flex flex-shrink-0 justify-center items-center w-6 h-6">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpansion(menu.id);
                }}
                className="neu-flat flex justify-center items-center w-5 h-5 rounded-full cursor-pointer hover:bg-accent active:scale-95 transition-all duration-150"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                )}
              </button>
            ) : (
              <div className="flex justify-center items-center w-5 h-5 rounded-full">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
              </div>
            )}
          </div>
          
          {/* 메뉴명 */}
          <span 
            className={`flex-1 select-none flex items-center ${
              !isReadOnly ? 'cursor-pointer' : 'cursor-default'
            } ${
              isAssigned 
                ? (menu.level === 1 ? 'font-bold text-primary text-lg' : 
                   menu.level === 2 ? 'font-semibold text-primary/90 text-base' : 
                   'font-medium text-primary/80 text-sm')
                : (menu.level === 1 ? 'font-bold text-foreground text-lg group-hover:text-primary' : 
                   menu.level === 2 ? 'font-semibold text-muted-foreground text-base group-hover:text-foreground' : 
                   'font-medium text-muted-foreground text-sm group-hover:text-foreground')
            } transition-colors duration-150`}

          >
            {menu.name}
          </span>

          {/* 체크박스 */}
          <div 
            className="flex flex-shrink-0 justify-center items-center ml-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="neu-flat p-1 rounded-lg hover:bg-accent active:scale-95 transition-all duration-150">
              <SimpleCheckbox
                checked={isAssigned}
                onChange={() => !isReadOnly && onToggleMenu(menu.id)}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 하위 메뉴들 */}
      {hasChildren && (
        <Collapsible.Root open={isExpanded}>
          <Collapsible.Content>
            {menu.children?.map((childMenu) => {
              const result = (
                <MenuTreeItem
                  key={childMenu.id}
                  menu={childMenu}
                  level={level + 1}
                  rowIndex={nextRowIndex}
                  expandedMenus={expandedMenus}
                  assignedMenuIds={assignedMenuIds}
                  isReadOnly={isReadOnly}
                  selectedParkingLot={selectedParkingLot}
                  onToggleMenu={onToggleMenu}
                  onToggleExpansion={onToggleExpansion}
                />
              );
              nextRowIndex++;
              return result;
            })}
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </div>
  );
  // #endregion
}