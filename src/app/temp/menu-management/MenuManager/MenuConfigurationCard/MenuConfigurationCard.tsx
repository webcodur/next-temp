/* 
  파일명: /app/temp/menu-management/MenuManager/MenuConfigurationCard/MenuConfigurationCard.tsx
  기능: 메뉴 설정 카드 컴포넌트
  책임: 메뉴 설정 UI, 통계 표시, 액션 버튼, 메뉴 트리 포함
*/ // ------------------------------

import { Eye, EyeOff, FolderOpen, Folder, Filter, RotateCcw, Search, X } from 'lucide-react';
import type { DragEndEvent } from '@dnd-kit/core';

import { MenuTree } from './MenuTree/MenuTree';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';

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
  
  // 유틸리티 상태
  searchTerm?: string;
  showSelectedOnly?: boolean;
  sortOrder?: 'name' | 'level' | 'original';
  
  // 기본 함수들
  onToggleMenu: (menuId: number) => void;
  onToggleAllMenus: () => void;
  onToggleExpansion: (menuId: number) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  
  // 유틸리티 함수들
  onToggleAllMenuExpansion?: () => void;
  onToggleSelectedOnlyView?: () => void;
  onSearchChange?: (term: string) => void;
  onSortChange?: (order: 'name' | 'level' | 'original') => void;
  onResetAllFilters?: () => void;
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
  searchTerm = '',
  showSelectedOnly = false,
  sortOrder = 'original',
  onToggleMenu,
  onToggleAllMenus,
  onToggleExpansion,
  onDragEnd,
  onToggleAllMenuExpansion,
  onToggleSelectedOnlyView,
  onSearchChange,
  onSortChange,
  onResetAllFilters,
}: MenuConfigurationCardProps) {
  // #region 렌더링
  return (
    <div className="overflow-hidden rounded-2xl neu-elevated">
      <div className="p-6">
        
        {/* 통계 및 액션 버튼 */}
        <div className="mb-4">
          <div className="flex gap-4 items-center">
            {/* 통계 박스 */}
            <div className="neu-inset flex items-center justify-center gap-3 px-4 py-2 rounded-lg bg-muted/30 min-w-[160px]">
              <div className={`${isReadOnly ? 'neu-icon-inactive' : 'neu-icon-active'} w-3 h-3 rounded-full`}></div>
              <span className="text-base font-semibold whitespace-nowrap text-foreground">
                {assignedMenuIds.size}/{allMenus.length}개 선택됨
              </span>
            </div>
            
            {!isReadOnly && (
              <button
                onClick={onToggleAllMenus}
                className="neu-raised px-4 py-2 text-sm font-medium rounded-lg text-foreground bg-muted/5 border border-muted/20 hover:bg-muted/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                {assignedMenuIds.size === allMenus.length ? (
                  <div className='flex gap-2 items-center'>
                    <EyeOff className="w-4 h-4" />
                    <span>전체 해제</span>
                  </div>  
                ) : (
                  <div className='flex gap-2 items-center'>
                    <Eye className="w-4 h-4" />
                    <span>전체 선택</span>
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 메뉴 목록 (트리 구조) */}
      <div className='px-6 pb-6'>
        {!isReadOnly && (
          /* 유틸리티 버튼 영역 */
          <div className="p-3 mb-4 rounded-lg neu-flat">
            <div className="flex flex-wrap gap-2 justify-between items-center">
              {/* 좌측 유틸리티 버튼들 */}
              <div className="flex flex-wrap gap-2">
                {/* 전체 확장/축소 */}
                {onToggleAllMenuExpansion && (
                  <button
                    onClick={onToggleAllMenuExpansion}
                    className="neu-raised px-3 py-1.5 text-xs font-medium rounded-md text-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    title={expandedMenus.size === allMenus.length ? "전체 접기" : "전체 펼치기"}
                  >
                    <div className="flex gap-2 items-center">
                      {expandedMenus.size === allMenus.length ? (
                        <Folder className="w-4 h-4" />
                      ) : (
                        <FolderOpen className="w-4 h-4" />
                      )}
                      <span>{expandedMenus.size === allMenus.length ? "전체 접기" : "전체 펼치기"}</span>
                    </div>
                  </button>
                )}

                {/* 선택된 항목만 보기 */}
                {onToggleSelectedOnlyView && (
                  <button
                    onClick={onToggleSelectedOnlyView}
                    className={`neu-raised px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                      showSelectedOnly 
                        ? 'text-foreground bg-accent/10 border border-accent/30' 
                        : 'text-foreground'
                    }`}
                    title="선택된 항목만 보기"
                  >
                    <div className="flex gap-2 items-center">
                      <Filter className="w-4 h-4" />
                      <span>{showSelectedOnly ? "선택된 것만" : "전체 보기"}</span>
                    </div>
                  </button>
                )}

                {/* 필터 리셋 */}
                {onResetAllFilters && (
                  <button
                    onClick={onResetAllFilters}
                    className="neu-raised px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    title="모든 필터 초기화"
                  >
                    <div className="flex gap-2 items-center">
                      <RotateCcw className="w-4 h-4" />
                      <span>초기화</span>
                    </div>
                  </button>
                )}
              </div>

              {/* 우측 검색 및 정렬 */}
              <div className="flex gap-2 items-center">
                {/* 검색 */}
                {onSearchChange && (
                  <div className="relative">
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                      <Search className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="메뉴 검색..."
                      className="neu-inset pl-7 pr-8 py-1.5 text-xs w-32 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => onSearchChange('')}
                        className="flex absolute right-2 top-1/2 justify-center items-center w-3 h-3 transition-colors transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* 정렬 */}
                {onSortChange && (
                  <div className="w-24">
                    <SimpleDropdown
                      value={sortOrder}
                      onChange={(value) => onSortChange(value as 'name' | 'level' | 'original')}
                      options={[
                        { value: 'original', label: '기본 순서' },
                        { value: 'name', label: '이름순' },
                        { value: 'level', label: '레벨순' }
                      ]}
                      placeholder="정렬"
                      className="text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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