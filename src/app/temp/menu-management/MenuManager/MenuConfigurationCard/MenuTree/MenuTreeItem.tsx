/* 
  파일명: /app/temp/menu-management/MenuManager/MenuConfigurationCard/MenuTree/MenuTreeItem.tsx
  기능: 메뉴 트리의 개별 아이템을 렌더링하는 컴포넌트
  책임: 메뉴 계층 구조 표시, 확장/축소, 체크박스 처리
*/ // ------------------------------

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronRight, ChevronDown } from 'lucide-react';

import { SimpleCheckbox } from '@/components/ui/ui-input/simple-input/SimpleCheckbox';

import type { MenuItem } from '../../useMenuOperations';

// #region 타입 정의
interface MenuTreeItemProps {
  menu: MenuItem;
  level: number;
  rowIndex: number;
  expandedMenus: Set<number>;
  assignedMenuIds: Set<number>;
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
  onToggleMenu,
  onToggleExpansion,
}: MenuTreeItemProps) {
  // #region 계산된 값
  const hasChildren = menu.children && menu.children.length > 0;
  const isExpanded = expandedMenus.has(menu.id);
  const isAssigned = assignedMenuIds.has(menu.id);
  const isEven = rowIndex % 2 === 0;
  
  let nextRowIndex = rowIndex + 1;
  // #endregion

  // #region 렌더링
  return (
    <div className="w-full">
      <div 
        className={`group cursor-pointer transition-all duration-200 ${
          isEven ? 'bg-muted/30' : 'bg-background'
        } ${
          isAssigned 
            ? 'border-l-2 border-primary/30 hover:bg-primary/5' 
            : 'border-l-2 border-transparent hover:bg-muted/50 hover:border-border'
        }`}
      >
        <div 
          className="flex items-center gap-3 py-3 px-4 min-h-[44px]"
          style={{ marginLeft: `${level * 16}px` }}
        >
          {/* 확장/축소 버튼 영역 */}
          <div className="flex flex-shrink-0 justify-center items-center w-5 h-5">
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpansion(menu.id);
                }}
                className="flex justify-center items-center w-5 h-5 rounded-full transition-all duration-200 hover:bg-muted group-hover:scale-110"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
            )}
          </div>
          
          {/* 메뉴명 */}
          <span 
            className={`flex-1 cursor-pointer select-none flex items-center transition-all duration-200 ${
              isAssigned 
                ? (menu.level === 1 ? 'font-semibold text-primary text-base' : 
                   menu.level === 2 ? 'font-medium text-primary/80 text-sm' : 
                   'font-normal text-primary/70 text-sm')
                : (menu.level === 1 ? 'font-semibold text-foreground text-base group-hover:text-foreground' : 
                   menu.level === 2 ? 'font-medium text-muted-foreground text-sm group-hover:text-foreground' : 
                   'font-normal text-muted-foreground text-sm group-hover:text-foreground')
            }`}
            onClick={() => onToggleMenu(menu.id)}
          >
            {menu.name}
          </span>

          {/* 체크박스 - 우측 정렬 */}
          <div className="flex flex-shrink-0 justify-center items-center ml-3">
            <SimpleCheckbox
              checked={isAssigned}
              onChange={() => onToggleMenu(menu.id)}
            />
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