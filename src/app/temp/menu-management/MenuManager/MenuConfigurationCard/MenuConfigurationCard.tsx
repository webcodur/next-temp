/* 
  파일명: /app/temp/menu-management/MenuManager/MenuConfigurationCard/MenuConfigurationCard.tsx
  기능: 메뉴 설정 카드 컴포넌트
  책임: 메뉴 설정 UI, 통계 표시, 액션 버튼, 메뉴 트리 포함
*/ // ------------------------------

import { Eye, EyeOff } from 'lucide-react';
import type { DragEndEvent } from '@dnd-kit/core';

import { MenuTree } from './MenuTree/MenuTree';

import type { MenuItem } from '../useMenuOperations';

// #region 타입 정의
interface MenuConfigurationCardProps {
  title?: string;
  stepNumber?: string;
  selectedParkingLot?: number | null;
  allMenus: MenuItem[];
  menuTree: MenuItem[];
  assignedMenuIds: Set<number>;
  expandedMenus: Set<number>;
  loading: boolean;
  isReadOnly?: boolean;
  onToggleMenu: (menuId: number) => void;
  onToggleAllMenus: () => void;
  onToggleExpansion: (menuId: number) => void;
  onDragEnd?: (event: DragEndEvent) => void;
}
// #endregion

export function MenuConfigurationCard({
  allMenus,
  menuTree,
  assignedMenuIds,
  expandedMenus,
  loading,
  isReadOnly = false,
  selectedParkingLot,
  onToggleMenu,
  onToggleAllMenus,
  onToggleExpansion,
  onDragEnd,
}: MenuConfigurationCardProps) {
  // #region 렌더링
  return (
    <div className="overflow-hidden rounded-2xl neu-elevated">
      <div className="p-6">
        
        {/* 통계 및 액션 버튼 */}
        <div className="mb-4">
          <div className="flex gap-4 items-center">
            <div className="flex gap-3 items-center">
              <div className={`neu-icon-${isReadOnly ? 'inactive' : 'active'} w-3 h-3 rounded-full ${isReadOnly ? 'bg-muted-foreground' : 'bg-primary'}`}></div>
              <span className="text-base font-semibold text-foreground w-[150]">
                {assignedMenuIds.size}/{allMenus.length}개 선택됨
              </span>
            </div>
            
            {!isReadOnly && (
              <button
                onClick={onToggleAllMenus}
                className="neu-raised px-4 py-2 text-sm font-medium rounded-lg text-foreground hover:scale-[1.02] active:scale-[0.98]"
              >
                {assignedMenuIds.size === allMenus.length ? (
                  <div className='flex items-center'>
                    <EyeOff className="mr-2 w-4 h-4" />
                    전체 해제
                  </div>  
                ) : (
                  <div className='flex items-center'>
                    <Eye className="mr-2 w-4 h-4" />
                    전체 선택
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 메뉴 목록 (트리 구조) */}
      <div className=''>
        <MenuTree
          menuTree={menuTree}
          loading={loading}
          expandedMenus={expandedMenus}
          assignedMenuIds={assignedMenuIds}
          isReadOnly={isReadOnly}
          selectedParkingLot={selectedParkingLot}
          onToggleMenu={onToggleMenu}
          onToggleExpansion={onToggleExpansion}
          onDragEnd={onDragEnd}
        />
      </div>
    </div>
  );
  // #endregion
}