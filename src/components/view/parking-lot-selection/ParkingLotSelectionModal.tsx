/* 
  파일명: /components/view/parking-lot-selection/ParkingLotSelectionModal.tsx
  기능: 헤더 검색 버튼에서 호출되는 현장 선택 모달
  책임: 모달 형태로 현장 선택 UI 제공
*/

'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useI18n';
import { parkingLotSelectionModalOpenAtom } from '@/store/searchModal';
import { ParkingLot } from '@/store/auth';
import { X } from 'lucide-react';

// 하위 컴포넌트들
import { SelectedParkingLotCard } from './SelectedParkingLotCard/SelectedParkingLotCard';
import { ParkingLotTable } from './ParkingLotTable/ParkingLotTable';
import { ActionButtons } from './ActionButtons/ActionButtons';

export function ParkingLotSelectionModal() {
  // #region 상태
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useAtom(parkingLotSelectionModalOpenAtom);
  // #endregion

  // #region 훅
  const { parkingLots, selectParkingLot } = useAuth();
  const { isRTL } = useLocale();
  // #endregion

  // #region 핸들러
  const handleParkingLotSelect = (parkingLot: ParkingLot) => {
    setSelectedId(parkingLot.id);
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    
    setIsLoading(true);
    
    // 현장 선택 실행 - Jotai 상태가 즉시 업데이트됨
    selectParkingLot(selectedId);
    
    console.log('현장 선택됨:', selectedId);
    
    // 모달 닫기
    setIsOpen(false);
    setSelectedId(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedId(null);
  };
  // #endregion

  if (!isOpen) return null;

  // #region 렌더링
  return (
    <div 
      className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50 font-multilang"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ 
        fontFamily: "'MultiLang', 'Pretendard', 'Inter', 'Cairo', system-ui, sans-serif"
      }}
      onClick={handleClose}
    >
      <div 
        className="mx-4 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 rounded-xl neu-elevated bg-background">
          {/* 모달 헤더 */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-foreground">
                현장 선택
              </h1>
              <p className="text-muted-foreground">
                관리할 현장을 선택해주세요
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg transition-all text-muted-foreground hover:text-foreground neu-flat hover:neu-pressed"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
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
  );
  // #endregion
}