/* 
  파일명: /app/temp/menu-management/MenuManager/MenuConfigurationCard/MenuConfigurationCard.tsx
  기능: 메뉴 설정 카드 컴포넌트
  책임: 메뉴 설정 UI, 통계 표시, 액션 버튼, 메뉴 트리 포함
*/ // ------------------------------

import { Save, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';

import { MenuTree } from './MenuTree/MenuTree';

import type { MenuItem } from '../useMenuOperations';

// #region 타입 정의
interface MenuConfigurationCardProps {
  selectedParkingLotName: string;
  allMenus: MenuItem[];
  menuTree: MenuItem[];
  assignedMenuIds: Set<number>;
  expandedMenus: Set<number>;
  loading: boolean;
  saving: boolean;
  onToggleMenu: (menuId: number) => void;
  onToggleAllMenus: () => void;
  onToggleExpansion: (menuId: number) => void;
  onSaveChanges: () => void;
}
// #endregion

export function MenuConfigurationCard({
  selectedParkingLotName,
  allMenus,
  menuTree,
  assignedMenuIds,
  expandedMenus,
  loading,
  saving,
  onToggleMenu,
  onToggleAllMenus,
  onToggleExpansion,
  onSaveChanges,
}: MenuConfigurationCardProps) {
  // #region 렌더링
  return (
    <div className="overflow-hidden rounded-xl border shadow-sm bg-card border-border">
      <div className="p-6 border-b border-border/50">
        <h2 className="flex gap-2 items-center mb-1 text-lg font-semibold text-card-foreground">
          <span className="flex justify-center items-center w-6 h-6 text-sm font-bold rounded-full bg-primary/10 text-primary">2</span>
          {selectedParkingLotName} 메뉴 설정
        </h2>
        <p className="text-sm text-muted-foreground">이 주차장에서 사용할 메뉴를 선택하세요</p>
        
        {/* 통계 및 액션 버튼 */}
        <div className="flex gap-3 justify-between items-center p-4 mt-4 rounded-lg bg-muted/30">
          <div className="flex gap-3 items-center">
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-sm font-medium text-card-foreground">
                {assignedMenuIds.size}/{allMenus.length}개 선택됨
              </span>
            </div>
            
            <Button 
              variant="outline" 
              onClick={onToggleAllMenus}
              size="sm"
              className="border-border text-muted-foreground hover:bg-muted"
            >
              {assignedMenuIds.size === allMenus.length ? (
                <>
                  <EyeOff className="mr-1.5 w-3.5 h-3.5" />
                  전체 해제
                </>
              ) : (
                <>
                  <Eye className="mr-1.5 w-3.5 h-3.5" />
                  전체 선택
                </>
              )}
            </Button>
          </div>
          
          <Button 
            onClick={onSaveChanges} 
            disabled={saving}
            className="flex gap-2 items-center bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Save className="w-4 h-4" />
            {saving ? '저장 중...' : '변경사항 저장'}
          </Button>
        </div>
      </div>

      {/* 메뉴 목록 (트리 구조) */}
      <MenuTree
        menuTree={menuTree}
        loading={loading}
        expandedMenus={expandedMenus}
        assignedMenuIds={assignedMenuIds}
        onToggleMenu={onToggleMenu}
        onToggleExpansion={onToggleExpansion}
      />
    </div>
  );
  // #endregion
}