/* 
  파일명: /components/view/parking-lot-selection/ParkingLotSelectionPage.tsx
  기능: 로그인 후 현장(주차장) 선택 페이지 (Manager)
  책임: 전체 페이지 상태 관리와 하위 컴포넌트들의 조정
*/

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useI18n';
import { Portal } from '@/components/ui/ui-layout/portal/Portal';
import { ParkingLot } from '@/store/auth';

// 하위 컴포넌트들
import { SelectedParkingLotCard } from './SelectedParkingLotCard/SelectedParkingLotCard';
import { ParkingLotTable } from './ParkingLotTable/ParkingLotTable';
import { ActionButtons } from './ActionButtons/ActionButtons';

// #region 타입
interface ParkingLotSelectionPageProps {
  onSelectionComplete?: () => void;
}
// #endregion

export default function ParkingLotSelectionPage({ onSelectionComplete }: ParkingLotSelectionPageProps) {
  // #region 상태
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // #endregion

  // #region 훅
  const { parkingLots, selectParkingLot } = useAuth();
  const { isRTL } = useLocale();
  // #endregion
  
  console.log('ParkingLotSelectionPage 렌더링:', { 
    parkingLotsCount: parkingLots.length, 
    selectedId,
    parkingLots: parkingLots.map(p => ({ id: p.id, name: p.name }))
  });

  // #region 핸들러
  const handleParkingLotSelect = (parkingLot: ParkingLot) => {
    console.log('주차장 선택:', parkingLot.id, parkingLot.name);
    setSelectedId(parkingLot.id);
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    
    setIsLoading(true);
    
    // 현장 선택 실행 - Jotai 상태가 즉시 업데이트됨
    selectParkingLot(selectedId);
    
    // MainLayout이 selectedParkingLotId 변경을 감지하여 자동으로 메인 페이지로 전환됨
    console.log('현장 선택됨:', selectedId);
    
    // 선택 완료 콜백 호출
    onSelectionComplete?.();
    
    setIsLoading(false);
  };
  // #endregion

  // #region 렌더링
  return (
    <Portal containerId="parking-lot-selection-portal">
      <div 
        className={`flex fixed inset-0 z-50 justify-center items-center bg-background font-multilang`}
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ 
          fontFamily: "'MultiLang', 'Pretendard', 'Inter', 'Cairo', system-ui, sans-serif"
        }}
      >
        <div className="w-full max-w-2xl mx-4">
          <div className="p-8 neu-elevated rounded-xl">
            {/* 페이지 헤더 */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-foreground">
                현장 선택
              </h1>
              <p className="text-muted-foreground">
                관리할 현장을 선택해주세요
              </p>
            </div>

            {/* 선택된 현장 카드 */}
            <SelectedParkingLotCard 
              selectedId={selectedId}
              parkingLots={parkingLots}
            />

            {/* 주차장 목록 테이블 */}
            <ParkingLotTable
              parkingLots={parkingLots}
              selectedId={selectedId}
              onParkingLotSelect={handleParkingLotSelect}
            />

            {/* 액션 버튼 */}
            <ActionButtons
              selectedId={selectedId}
              isLoading={isLoading}
              onConfirm={handleConfirm}
            />
          </div>
        </div>
      </div>
    </Portal>
  );
  // #endregion
}