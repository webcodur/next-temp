/* 
  파일명: /app/temp/menu-management/MenuManager/MenuConfigurationCard/MenuTree/MenuTree.tsx
  기능: 메뉴 트리 전체를 렌더링하는 컴포넌트
  책임: 메뉴 목록 표시, 로딩 상태 처리, 빈 상태 처리
*/ // ------------------------------

import { MenuTreeItem } from './MenuTreeItem';

import type { MenuItem } from '../../useMenuOperations';

// #region 타입 정의
interface MenuTreeProps {
  menuTree: MenuItem[];
  loading: boolean;
  expandedMenus: Set<number>;
  assignedMenuIds: Set<number>;
  onToggleMenu: (menuId: number) => void;
  onToggleExpansion: (menuId: number) => void;
}
// #endregion

export function MenuTree({
  menuTree,
  loading,
  expandedMenus,
  assignedMenuIds,
  onToggleMenu,
  onToggleExpansion,
}: MenuTreeProps) {
  // #region 렌더링
  return (
    <div className="max-h-[500px] overflow-y-auto scrollbar-gutter-stable">
      {loading ? (
        <div className="py-8 text-center text-muted-foreground">
          <div className="animate-pulse">메뉴 로딩 중...</div>
        </div>
      ) : menuTree.length > 0 ? (
        <div>
          {menuTree.map((menu, index) => (
            <MenuTreeItem
              key={menu.id}
              menu={menu}
              level={0}
              rowIndex={index}
              expandedMenus={expandedMenus}
              assignedMenuIds={assignedMenuIds}
              onToggleMenu={onToggleMenu}
              onToggleExpansion={onToggleExpansion}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          메뉴 데이터가 없습니다.
        </div>
      )}
    </div>
  );
  // #endregion
}