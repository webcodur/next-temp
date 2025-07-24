/* 
  파일명: /app/temp/menu-management/MenuManager/MenuManager.tsx
  기능: 메뉴 관리 메인 컴포넌트
  책임: 메뉴 데이터 관리, 주차장별 메뉴 설정 조율
*/ // ------------------------------

import { useEffect, useState } from 'react';
import { MenuTree } from './MenuConfigurationCard/MenuTree/MenuTree';
import { useMenuOperations } from './useMenuOperations';

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
      className="neu-raised-primary px-6 py-3 text-sm font-semibold text-primary-foreground rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
    >
      {saving ? '저장 중...' : '변경사항 저장'}
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
    loadAllMenus,
    loadParkingLotMenus,
    toggleMenu,
    toggleMenuExpansion,
    saveChanges,
    clearAssignedMenus,
    handleDragEnd,
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
    <div className="neu-elevated overflow-hidden bg-card rounded-2xl">

      {/* 메뉴 목록 선택 영역 - 좌측 통계, 중앙 드롭다운, 우측 저장 버튼 */}
      <div className="px-6 pt-6 pb-4">
        <div className="neu-flat flex justify-between items-center px-4 py-3 bg-muted rounded-lg">
          {/* 좌측 통계 */}
          <div className="flex gap-2 items-center">
            <div className="neu-icon-active w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm font-semibold text-foreground">
              {assignedMenuIds.size}/{allMenus.length}개 선택됨
            </span>
          </div>
          
          {/* 중앙 드롭다운 */}
          <div className="flex-1 mx-4 max-w-xs">
            <div className="relative">
              <select
                value={displayedParkingLot?.toString() || ''}
                onChange={(e) => handleParkingLotChange(e.target.value)}
                className="neu-inset px-3 py-2 w-full text-sm font-medium text-foreground bg-input rounded-lg appearance-none cursor-pointer hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background active:scale-[0.998] transition-all duration-200"
              >
                <option value="" className="text-muted-foreground font-semibold">
                  전체 메뉴 목록
                </option>
                {parkingLots.map(lot => (
                  <option 
                    key={lot.id} 
                    value={lot.id.toString()}
                    className="text-foreground"
                  >
                    {lot.name} ({lot.code})
                  </option>
                ))}
              </select>
              <div className="flex absolute inset-y-0 right-0 items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* 우측 저장 버튼 */}
          {showSaveButton && (
            <button
              onClick={handleSaveChanges}
              disabled={saving || !selectedParkingLot}
              className="neu-raised-primary px-4 py-2 text-sm font-semibold text-primary-foreground rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
            >
              {saving ? '저장 중...' : '변경사항 저장'}
            </button>
          )}
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className='p-6'>
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