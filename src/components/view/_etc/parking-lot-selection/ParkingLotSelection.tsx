/* 
  파일명: /components/view/parking-lot-selection/ParkingLotSelection.tsx
  기능: 현장 선택 공통 컴포넌트 (페이지/모달 모드 지원)
  책임: 현장 선택 로직과 UI를 통합 제공
*/

'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { useAuth } from '@/hooks/auth-hooks/useAuth/useAuth';
import { useLocale } from '@/hooks/ui-hooks/useI18n';
import { parkingLotSelectionModalOpenAtom } from '@/store/ui';
import { Portal } from '@/components/ui/ui-layout/portal/Portal';
import { ParkingLot } from '@/store/auth';
import { X } from 'lucide-react';

// 하위 컴포넌트들
import { SelectedParkingLotCard } from './SelectedParkingLotCard/SelectedParkingLotCard';
import { ParkingLotTable } from './ParkingLotTable/ParkingLotTable';
import { ActionButtons } from './ActionButtons/ActionButtons';

// #region 타입
interface ParkingLotSelectionProps {
  isModal?: boolean;
  onSelectionComplete?: () => void;
}
// #endregion

export default function ParkingLotSelection({ 
  isModal = false, 
  onSelectionComplete 
}: ParkingLotSelectionProps) {
  // #region 상태
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useAtom(parkingLotSelectionModalOpenAtom);
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
    
    if (isModal) {
      // 모달 모드: 모달 닫기
      setIsModalOpen(false);
      setSelectedId(null);
    } else {
      // 페이지 모드: 선택 완료 콜백 호출
      onSelectionComplete?.();
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    if (isModal) {
      setIsModalOpen(false);
      setSelectedId(null);
    }
  };
  // #endregion

  // 모달 모드에서 닫혀있으면 렌더링하지 않음
  if (isModal && !isModalOpen) return null;

  // #region 공통 콘텐츠
  const content = (
    <div className="rounded-lg border shadow-lg bg-card border-border">
      {/* 헤더 */}
      <div className={`${isModal ? 'flex justify-between items-center' : 'text-center'} p-6 border-b border-border bg-serial-4`}>
        <div>

        <h1 className="text-2xl font-bold text-foreground">
          현장 선택
        </h1>
        <p className="text-muted-foreground">
          관리할 현장을 선택해주세요
        </p>
        </div>
        {isModal && (
          <button
            onClick={handleClose}
            className="p-2 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-counter-2"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-6 space-y-6 bg-serial-1">

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
  );
  // #endregion

  // #region 렌더링
  if (isModal) {
    // 모달 모드
    return (
      <div 
        className="flex fixed inset-0 z-50 justify-center items-center font-multilang"
        style={{ 
          backgroundColor: `hsla(var(--modal-overlay))`,
          fontFamily: "'MultiLang', 'Pretendard', 'Inter', 'Cairo', system-ui, sans-serif"
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
        onClick={handleClose}
      >
        <div 
          className="mx-4 w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  } else {
    // 페이지 모드
    return (
      <Portal containerId="parking-lot-selection-portal">
        <div 
          className={`flex fixed inset-0 z-50 justify-center items-center bg-background font-multilang`}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{ 
            fontFamily: "'MultiLang', 'Pretendard', 'Inter', 'Cairo', system-ui, sans-serif"
          }}
        >
          <div className="mx-4 w-full max-w-2xl">
            {content}
          </div>
        </div>
      </Portal>
    );
  }
  // #endregion
} 