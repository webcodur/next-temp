/* 
  파일명: /components/view/parking-lot-selection/ParkingLotSelection.tsx
  기능: 현장 선택 공통 컴포넌트 (페이지/모달 모드 지원)
  책임: 현장 선택 로직과 UI를 통합 제공
*/

'use client';

import { useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import { useAuth } from '@/hooks/auth-hooks/useAuth/useAuth';
import { parkingLotSelectionModalOpenAtom } from '@/store/ui';
import { ParkingLot } from '@/store/auth';
import { Building2, Check } from 'lucide-react';

// 공통 모듈 import
import { 
  SelectionDialog,
  type HeaderConfig,
  type ActionButtonConfig,
  type EmptyStateConfig,
} from '@/components/ui/ui-layout/selection-dialog';
import { BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';

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
  // #endregion

  // #region 핸들러
  const handleParkingLotSelect = (parkingLot: ParkingLot) => {
    setSelectedId(parkingLot.id);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    
    setIsLoading(true);
    
    try {
      // 현장 선택 실행 - Jotai 상태가 즉시 업데이트됨
      selectParkingLot(selectedId);
      
      if (isModal) {
        // 모달 모드: 모달 닫기
        setIsModalOpen(false);
        setSelectedId(null);
      } else {
        // 페이지 모드: 선택 완료 콜백 호출
        onSelectionComplete?.();
      }
      
      // 현장 변경 후 페이지 리로딩으로 새로운 현장 데이터 로드
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error) {
      console.error('현장 선택 중 오류:', error);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isModal) {
      setIsModalOpen(false);
      setSelectedId(null);
    }
  };
  // #endregion

  // #region 계산된 값
  const selectedParkingLot = selectedId 
    ? parkingLots.find(p => p.id === selectedId) 
    : null;
  // #endregion

  // #region 설정 객체들
  const headerConfig: HeaderConfig = useMemo(() => ({
    title: '현장 선택',
    description: '관리할 현장을 선택해주세요'
  }), []);

  const actionButtonConfig: ActionButtonConfig = useMemo(() => ({
    label: '확인',
    loadingLabel: '처리 중...',
    icon: Check
  }), []);

  const emptyStateConfig: EmptyStateConfig = useMemo(() => ({
    icon: Building2,
    title: '사용 가능한 현장이 없습니다',
    description: '현재 계정에 할당된 현장이 없습니다',
    tips: [
      '관리자에게 현장 권한을 요청해주세요',
      '계정 설정을 확인해주세요'
    ]
  }), []);

  // 테이블 컬럼 정의
  const columns: BaseTableColumn<ParkingLot>[] = useMemo(() => [
    {
      key: 'name',
      header: '현장명',
      align: 'start',
    },
    {
      key: 'description',
      header: '설명',
      align: 'start',
      render: (value) => (value as string) || '-',
    },
    {
      header: '선택',
      align: 'center',
      width: '80px',
      cell: (item) => (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto border-2 transition-none ${
          selectedId === item.id
            ? 'border-primary bg-primary'
            : 'border-border bg-card hover:border-primary hover:border-opacity-60'
        }`}>
          {selectedId === item.id && (
            <Check className="w-3 h-3 text-primary-foreground" />
          )}
        </div>
      )
    },
  ], [selectedId]);
  // #endregion

  // #region 검색 컨트롤 (선택된 현장 정보 표시)
  const searchControl = (
    <div className="flex gap-3 items-center p-3 h-12 rounded-lg border bg-primary-0 border-primary-2">
      <Building2 className="w-5 h-5 text-primary" />
      <div className="flex-1 font-medium text-foreground">
        {selectedParkingLot ? selectedParkingLot.name : '아래 테이블에서 현장을 선택해주세요'}
      </div>
    </div>
  );
  // #endregion

  // 모달 모드에서 닫혀있으면 렌더링하지 않음
  if (isModal && !isModalOpen) return null;

  // #region 렌더링
  return (
    <SelectionDialog
      isModal={isModal}
      items={parkingLots}
      selectedItem={selectedParkingLot || null}
      isLoading={isLoading}
      header={headerConfig}
      actionButton={actionButtonConfig}
      emptyState={emptyStateConfig}
      columns={columns}
      searchControl={searchControl}
      onItemSelect={handleParkingLotSelect}
      onConfirm={handleConfirm}
      onClose={handleClose}
      onSelectionComplete={onSelectionComplete}
    />
  );
  // #endregion
} 