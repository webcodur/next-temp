/* 
  파일명: /app/temp/menu-management/MenuManager/MenuManager.tsx
  기능: 메뉴 관리 메인 컴포넌트
  책임: 메뉴 데이터 관리, 주차장별 메뉴 설정 조율
*/ // ------------------------------

import { useEffect, useState } from 'react';
import { FolderOpen, Folder, Filter, RotateCcw, Search, X } from 'lucide-react';
import { MenuTree } from './MenuConfigurationCard/MenuTree/MenuTree';
import { useMenuOperations } from './useMenuOperations';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';

// #region 타입 정의
interface ParkingLot {
  id: number;
  name: string;
  code: string;
}

interface MenuManagerProps {
  parkingLots: ParkingLot[];
  selectedParkingLot: number | null;
  onParkingLotSelect: (parkingLotId: number | null) => void;
  showSaveButton?: boolean;
}

interface SaveButtonProps {
  selectedParkingLot: number | null;
}
// #endregion

// #region SaveButton 컴포넌트
export function SaveButton({ selectedParkingLot }: SaveButtonProps) {
  const { saving, saveChanges } = useMenuOperations();

  const handleSaveChanges = () => {
    if (selectedParkingLot) {
      saveChanges(selectedParkingLot);
    }
  };

  return (
    <button
      onClick={handleSaveChanges}
      disabled={saving || !selectedParkingLot}
      className={`group relative overflow-hidden px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
        saving || !selectedParkingLot
          ? // 비활성 상태: 회색조 + 투명도
            'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60 neu-flat'
          : // 활성 상태: 강화된 프라이머리 뉴모피즘 - 핵심 액션
            'bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] neu-raised-brand'
      } ${
        saving ? 'animate-pulse' : ''
      }`}
    >
      {/* 글로우 효과 */}
      {!saving && selectedParkingLot && (
        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
      )}
      
      {/* 버튼 텍스트 */}
      <span className="relative z-10 flex items-center gap-2">
        {saving && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        )}
        {saving ? '저장 중...' : '변경사항 저장'}
      </span>
      
      {/* 하이라이트 효과 */}
      {!saving && selectedParkingLot && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
      )}
    </button>
  );
}
// #endregion

export function MenuManager({ parkingLots, selectedParkingLot, onParkingLotSelect, showSaveButton = true }: MenuManagerProps) {
  // #region 내부 상태
  const [tempSelectedParkingLot, setTempSelectedParkingLot] = useState<number | null>(selectedParkingLot);
  // #endregion

  // #region 훅
  const {
    allMenus,
    menuTree,
    assignedMenuIds,
    loading,
    saving,
    expandedMenus,
    searchTerm,
    showSelectedOnly,
    sortOrder,
    loadAllMenus,
    loadParkingLotMenus,
    toggleMenu,
    toggleMenuExpansion,
    saveChanges,
    clearAssignedMenus,
    handleDragEnd,
    toggleAllMenus,
    toggleSelectedOnlyView,
    handleSearchChange,
    handleSortChange,
    resetAllFilters,
  } = useMenuOperations();
  // #endregion

  // #region 생명주기
  useEffect(() => {
    loadAllMenus();
  }, [loadAllMenus]);

  useEffect(() => {
    setTempSelectedParkingLot(selectedParkingLot);
  }, [selectedParkingLot]);

  useEffect(() => {
    const loadMenusAsync = async () => {
      if (tempSelectedParkingLot) {
        await loadParkingLotMenus(tempSelectedParkingLot);
        // API 로딩 완료 후에만 실제 상태 업데이트
        onParkingLotSelect(tempSelectedParkingLot);
      } else {
        clearAssignedMenus();
        onParkingLotSelect(null);
      }
    };

    // tempSelectedParkingLot이 selectedParkingLot과 다를 때만 API 호출
    if (tempSelectedParkingLot !== selectedParkingLot) {
      loadMenusAsync();
    }
  }, [tempSelectedParkingLot, selectedParkingLot, loadParkingLotMenus, clearAssignedMenus, onParkingLotSelect]);
  // #endregion

  // #region 이벤트 핸들러
  const handleSaveChanges = () => {
    if (selectedParkingLot) {
      saveChanges(selectedParkingLot);
    }
  };

  const handleParkingLotChange = (value: string) => {
    if (value === '' || value === undefined || value === null) {
      setTempSelectedParkingLot(null);
    } else {
      const parsedValue = parseInt(value);
      if (!isNaN(parsedValue)) {
        setTempSelectedParkingLot(parsedValue);
      }
    }
  };

  // UI에 표시할 실제 값 (로딩 중에는 이전 상태 유지)
  const displayedParkingLot = loading ? selectedParkingLot : tempSelectedParkingLot;
  // #endregion

  // #region 렌더링
  return (
    <div className="neu-elevated overflow-hidden rounded-2xl">

      {/* 메뉴 목록 선택 영역 - 좌측 통계, 중앙 드롭다운, 우측 저장 버튼 */}
      <div className="px-6 pt-6 pb-4">
        <div className="neu-flat flex justify-between items-center px-4 py-3 rounded-lg">
          {/* 좌측 통계 박스 */}
          <div className="neu-inset flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-muted/30 min-w-[140px]">
            <div className="neu-icon-active w-3 h-3 rounded-full"></div>
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
              {assignedMenuIds.size}/{allMenus.length}개 선택됨
            </span>
          </div>
          
          {/* 중앙 드롭다운 */}
          <div className="flex-1 mx-4 max-w-xs">
            <SimpleDropdown
              value={displayedParkingLot?.toString() || ''}
              onChange={handleParkingLotChange}
              options={[
                { value: '', label: '전체 메뉴 목록' },
                ...parkingLots.map(lot => ({
                  value: lot.id.toString(),
                  label: `${lot.name} (${lot.code})`
                }))
              ]}
              placeholder="주차장 선택"
            />
          </div>
          
          {/* 우측 저장 버튼 */}
          {showSaveButton && (
            <button
              onClick={handleSaveChanges}
              disabled={saving || !selectedParkingLot}
              className={`group relative overflow-hidden px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
                saving || !selectedParkingLot
                  ? // 비활성 상태: 회색조 + 투명도
                    'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60 neu-flat'
                  : // 활성 상태: 강화된 프라이머리 뉴모피즘 - 핵심 액션
                    'bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] neu-raised-brand'
              } ${
                saving ? 'animate-pulse' : ''
              }`}
            >
              {/* 글로우 효과 */}
              {!saving && selectedParkingLot && (
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              )}
              
              {/* 버튼 텍스트 */}
              <span className="relative z-10 flex items-center gap-2">
                {saving && (
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                )}
                {saving ? '저장 중...' : '변경사항 저장'}
              </span>
              
              {/* 하이라이트 효과 */}
              {!saving && selectedParkingLot && (
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className='px-6 pb-6'>
        {/* 유틸리티 버튼 영역 */}
        <div className="neu-flat mb-4 p-3 rounded-lg">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            {/* 좌측 유틸리티 버튼들 */}
            <div className="flex flex-wrap gap-2">
              {/* 전체 확장/축소 */}
              <button
                onClick={toggleAllMenus}
                className="neu-raised px-3 py-1.5 text-xs font-medium rounded-md text-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                title={expandedMenus.size === allMenus.length ? "전체 접기" : "전체 펼치기"}
              >
                <div className="flex items-center gap-2">
                  {expandedMenus.size === allMenus.length ? (
                    <Folder className="w-4 h-4" />
                  ) : (
                    <FolderOpen className="w-4 h-4" />
                  )}
                  <span>{expandedMenus.size === allMenus.length ? "전체 접기" : "전체 펼치기"}</span>
                </div>
              </button>

              {/* 선택된 항목만 보기 */}
              <button
                onClick={toggleSelectedOnlyView}
                className={`neu-raised px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  showSelectedOnly 
                    ? 'text-foreground bg-accent/10 border border-accent/30' 
                    : 'text-foreground'
                }`}
                title="선택된 항목만 보기"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>{showSelectedOnly ? "선택된 것만" : "전체 보기"}</span>
                </div>
              </button>

              {/* 필터 리셋 */}
              <button
                onClick={resetAllFilters}
                className="neu-raised px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                title="모든 필터 초기화"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>초기화</span>
                </div>
              </button>
            </div>

            {/* 우측 검색 및 정렬 */}
            <div className="flex items-center gap-2">
              {/* 검색 */}
              <div className="relative">
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                  <Search className="w-3 h-3 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="메뉴 검색..."
                  className="neu-inset pl-7 pr-8 py-1.5 text-xs w-32 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* 정렬 */}
              <div className="w-24">
                <SimpleDropdown
                  value={sortOrder}
                  onChange={(value) => handleSortChange(value as 'name' | 'level' | 'original')}
                  options={[
                    { value: 'original', label: '기본 순서' },
                    { value: 'name', label: '이름순' },
                    { value: 'level', label: '레벨순' }
                  ]}
                  placeholder="정렬"
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <MenuTree
          menuTree={menuTree}
          loading={loading}
          expandedMenus={expandedMenus}
          assignedMenuIds={assignedMenuIds}
          isReadOnly={false}
          selectedParkingLot={displayedParkingLot}
          onToggleMenu={toggleMenu}
          onToggleExpansion={toggleMenuExpansion}
          onDragEnd={handleDragEnd}
        />
      </div>
    </div>
  );
  // #endregion
}

// SaveButton을 MenuManager의 정적 속성으로 추가
MenuManager.SaveButton = SaveButton;