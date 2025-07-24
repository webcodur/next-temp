/* 
  파일명: /app/temp/menu-management/MenuManager/MenuManager.tsx
  기능: 메뉴 관리 메인 컴포넌트
  책임: 메뉴 데이터 관리, 주차장별 메뉴 설정 조율
*/ // ------------------------------

import { useEffect } from 'react';

import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
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
  onParkingLotSelect: (parkingLotId: number) => void;
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
      className="px-6 py-3 text-sm font-semibold rounded-xl bg-blue-600 text-white border border-blue-700 shadow-md hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {saving ? '저장 중...' : '변경사항 저장'}
    </button>
  );
}
// #endregion

export function MenuManager({ parkingLots, selectedParkingLot, onParkingLotSelect, showSaveButton = true }: MenuManagerProps) {
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
    toggleAllMenus,
    toggleMenuExpansion,
    saveChanges,
    handleDragEnd,
  } = useMenuOperations();
  // #endregion

  // #region 생명주기
  useEffect(() => {
    loadAllMenus();
  }, [loadAllMenus]);

  useEffect(() => {
    if (selectedParkingLot) {
      loadParkingLotMenus(selectedParkingLot);
    }
  }, [selectedParkingLot, loadParkingLotMenus]);
  // #endregion

  // #region 이벤트 핸들러
  const handleSaveChanges = () => {
    if (selectedParkingLot) {
      saveChanges(selectedParkingLot);
    }
  };
  // #endregion

  // #region 렌더링
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg bg-white">
      <div className="p-6">
        {/* 상단: 주차장 선택 + 저장 버튼 */}
        <div className="mb-6">
          <div className="flex gap-8 items-center justify-between">
            {/* 왼쪽: 주차장 선택 */}
            <div className="flex gap-6 items-center flex-1">
              <h2 className="flex-shrink-0 text-xl font-bold text-foreground">
                ※ 주차장 선택
              </h2>
              <div className="flex-1 max-w-sm relative z-[100]">
                <SimpleDropdown
                  options={parkingLots.map(lot => ({
                    value: lot.id.toString(),
                    label: `${lot.name} (${lot.code})`
                  }))}
                  value={selectedParkingLot?.toString() || ''}
                  onChange={(value) => onParkingLotSelect(parseInt(value))}
                  placeholder="주차장을 선택하세요"
                />
              </div>
            </div>
            
            {/* 오른쪽: 저장 버튼 */}
            {showSaveButton && (
              <button
                onClick={handleSaveChanges}
                disabled={saving || !selectedParkingLot}
                className="px-6 py-3 text-sm font-semibold rounded-xl bg-blue-600 text-white border border-blue-700 shadow-md hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '저장 중...' : '변경사항 저장'}
              </button>
            )}
          </div>
        </div>

        {/* 메뉴 통계 및 액션 버튼 */}
        <div className="mb-4">
          <div className="flex gap-4 items-center">
            <div className="flex gap-3 items-center">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-base font-semibold text-foreground w-[150]">
                {assignedMenuIds.size}/{allMenus.length}개 선택됨
              </span>
            </div>
            
            <button
              onClick={toggleAllMenus}
              className="bg-white border border-gray-300 shadow-sm px-4 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-gray-50 hover:shadow-md active:bg-gray-100"
            >
              {assignedMenuIds.size === allMenus.length ? (
                <div className='flex items-center'>
                  <span className="mr-2">👁️‍🗨️</span>
                  전체 해제
                </div>  
              ) : (
                <div className='flex items-center'>
                  <span className="mr-2">👁️</span>
                  전체 선택
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 메뉴 목록 */}
      <MenuTree
        menuTree={menuTree}
        loading={loading}
        expandedMenus={expandedMenus}
        assignedMenuIds={assignedMenuIds}
        isReadOnly={false}
        onToggleMenu={toggleMenu}
        onToggleExpansion={toggleMenuExpansion}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
  // #endregion
}

// SaveButton을 MenuManager의 정적 속성으로 추가
MenuManager.SaveButton = SaveButton;