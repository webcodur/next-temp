/* 
  파일명: /app/preview/menu-management/page.tsx
  기능: 주차장별 메뉴 권한 관리 페이지
  책임: 페이지 타이틀 관리 및 하위 컴포넌트 조율
  메뉴 설명: 주차장별 메뉴 권한을 설정

  메뉴 API 개편을 위해 비활성화 처리
*/ // ------------------------------

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
// import { MenuManager } from './MenuManager/MenuManager';

export default function MenuManagementPage() {
  // #region 상태
  const [selectedParkingLot, setSelectedParkingLot] = useState<number | null>(null);
  // #endregion

  // #region 훅
  const { parkingLots } = useAuth();
  // #endregion

  // #region 이벤트 핸들러
  const handleParkingLotSelect = (parkingLotId: number | null) => {
    setSelectedParkingLot(parkingLotId);
  };
  // #endregion

  // #region 렌더링
  return (
    <div className="p-6 mx-auto space-y-6 max-w-6xl font-multilang">
      {/* 메뉴 설정 영역 */}
      {/* <MenuManager
        parkingLots={parkingLots}
        selectedParkingLot={selectedParkingLot}
        onParkingLotSelect={handleParkingLotSelect}
        showSaveButton={true}
      /> */}
      
    </div>
  );
  // #endregion
} 