/* 
  파일명: /app/temp/menu-management/page.tsx
  기능: 주차장별 메뉴 권한 관리 페이지
  책임: 페이지 타이틀 관리 및 하위 컴포넌트 조율
*/ // ------------------------------

'use client';

import { useState, useEffect } from 'react';

import { useAtom } from 'jotai';
import { Settings } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { pageTitleAtom, pageDescriptionAtom } from '@/store/page';

import { MenuManager } from './MenuManager/MenuManager';
import { ParkingLotSelector } from './ParkingLotSelector/ParkingLotSelector';

export default function MenuManagementPage() {
  // #region 상태
  const [, setPageTitle] = useAtom(pageTitleAtom);
  const [, setPageDescription] = useAtom(pageDescriptionAtom);
  const [selectedParkingLot, setSelectedParkingLot] = useState<number | null>(null);
  // #endregion

  // #region 훅
  const { parkingLots } = useAuth();
  // #endregion

  // #region 생명주기
  useEffect(() => {
    setPageTitle('메뉴 관리');
    setPageDescription('주차장별 메뉴 권한을 설정합니다.');

    return () => {
      setPageTitle(null);
      setPageDescription('');
    };
  }, [setPageTitle, setPageDescription]);
  // #endregion

  // #region 이벤트 핸들러
  const handleParkingLotSelect = (parkingLotId: number) => {
    setSelectedParkingLot(parkingLotId);
  };
  // #endregion

  // #region 렌더링
  return (
    <div className="p-6 mx-auto space-y-8 max-w-6xl">
      {/* 헤더 */}
      <div className="flex gap-3 items-center pb-2 border-b border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">메뉴 관리</h1>
          <p className="mt-1 text-muted-foreground">주차장별 접근 가능한 메뉴를 설정합니다</p>
        </div>
      </div>

      {/* 주차장 선택 */}
      <ParkingLotSelector
        parkingLots={parkingLots}
        selectedParkingLot={selectedParkingLot}
        onParkingLotSelect={handleParkingLotSelect}
      />

      {/* 메뉴 설정 */}
      <MenuManager
        parkingLots={parkingLots}
        selectedParkingLot={selectedParkingLot}
      />

      {/* 안내 메시지 */}
      {!selectedParkingLot && (
        <div className="p-8 rounded-xl border shadow-sm bg-card border-border">
          <div className="text-center text-muted-foreground">
            <div className="flex justify-center items-center p-3 mx-auto mb-4 w-16 h-16 rounded-full bg-muted/50">
              <Settings className="w-8 h-8 text-muted-foreground/70" />
            </div>
            <div className="mb-2 text-lg font-medium text-card-foreground">주차장을 선택하세요</div>
            <div className="text-sm text-muted-foreground">
              주차장을 선택하면 해당 주차장의 메뉴 설정을 관리할 수 있습니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
  // #endregion
} 