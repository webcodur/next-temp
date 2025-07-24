/* 
  파일명: /app/temp/menu-management/MenuManager/MenuManager.tsx
  기능: 메뉴 관리 메인 컴포넌트
  책임: 메뉴 데이터 관리, 주차장별 메뉴 설정 조율
*/ // ------------------------------

import { useEffect } from 'react';

import { MenuConfigurationCard } from './MenuConfigurationCard/MenuConfigurationCard';
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
}
// #endregion

export function MenuManager({ parkingLots, selectedParkingLot }: MenuManagerProps) {
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
  } = useMenuOperations();
  // #endregion

  // #region 계산된 값
  const selectedParkingLotName = parkingLots.find(lot => lot.id === selectedParkingLot)?.name || '';
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
  if (!selectedParkingLot) {
    return null;
  }

  return (
    <MenuConfigurationCard
      selectedParkingLotName={selectedParkingLotName}
      allMenus={allMenus}
      menuTree={menuTree}
      assignedMenuIds={assignedMenuIds}
      expandedMenus={expandedMenus}
      loading={loading}
      saving={saving}
      onToggleMenu={toggleMenu}
      onToggleAllMenus={toggleAllMenus}
      onToggleExpansion={toggleMenuExpansion}
      onSaveChanges={handleSaveChanges}
    />
  );
  // #endregion
}