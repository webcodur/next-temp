/* 
  파일명: /components/view/parking-lot-selection/ParkingLotSelection.tsx
  기능: 현장 선택 공통 컴포넌트 (페이지/모달 모드 지원)
  책임: 현장 선택 로직과 UI를 통합 제공
*/

'use client';

import { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { useAuth } from '@/hooks/auth-hooks/useAuth/useAuth';
import { useLocale } from '@/hooks/ui-hooks/useI18n';
import { parkingLotSelectionModalOpenAtom } from '@/store/ui';
import { Portal } from '@/components/ui/ui-layout/portal/Portal';
import { ParkingLot } from '@/store/auth';
import { X, Building2, ChevronDown, Check } from 'lucide-react';

// 하위 컴포넌트들
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useAtom(parkingLotSelectionModalOpenAtom);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // #endregion

  // #region 훅
  const { parkingLots, selectParkingLot } = useAuth();
  const { isRTL } = useLocale();
  // #endregion

  // #region 핸들러
  const handleParkingLotSelect = (parkingLot: ParkingLot) => {
    setSelectedId(parkingLot.id);
  };

  const handleDropdownSelect = (parkingLot: ParkingLot) => {
    setSelectedId(parkingLot.id);
    setIsDropdownOpen(false);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    
    setIsLoading(true);
    
    try {
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

  // #region 이펙트
  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);
  // #endregion

  // 모달 모드에서 닫혀있으면 렌더링하지 않음
  if (isModal && !isModalOpen) return null;

  // #region 공통 콘텐츠
  const content = (
    <div className="flex flex-col h-full rounded-lg border shadow-lg bg-card border-border">
      {/* 헤더 */}
      <div className="flex-shrink-0 p-4 rounded-t-lg border-b-2 shadow-sm border-border bg-serial-4">
        <div className="flex gap-6 justify-between items-center">
          {/* 좌측: 타이틀 */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-foreground">
              현장 선택
            </h1>
            <p className="text-sm text-muted-foreground">
              관리할 현장을 선택해주세요
            </p>
          </div>
          
          {/* 우측: 현장 선택 드롭다운 */}
          <div className="flex-1 max-w-md">
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full px-4 py-2.5 text-left rounded-lg border transition-all border-border bg-background text-foreground hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              >
                <div className="flex gap-2 items-center">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className={selectedParkingLot ? "text-foreground" : "text-muted-foreground"}>
                    {selectedParkingLot ? selectedParkingLot.name : "현장을 선택해주세요..."}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="overflow-y-auto absolute right-0 left-0 top-full z-10 mt-1 max-h-60 rounded-lg border shadow-lg bg-background border-border">
                  {parkingLots.length > 0 ? (
                    parkingLots.map((lot) => (
                      <button
                        key={lot.id}
                        onClick={() => handleDropdownSelect(lot)}
                        className="flex gap-3 items-center px-4 py-3 w-full text-left border-b transition-colors hover:bg-counter-1 border-border last:border-b-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{lot.name}</div>
                          {lot.description && (
                            <div className="text-sm text-muted-foreground">{lot.description}</div>
                          )}
                        </div>
                        {selectedId === lot.id && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      사용 가능한 현장이 없습니다
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 모달 닫기 버튼 */}
          {isModal && (
            <button
              onClick={handleClose}
              className="p-2 rounded-md cursor-pointer text-muted-foreground hover:text-foreground hover:bg-counter-2"
              aria-label="닫기"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex overflow-hidden flex-col flex-1 p-2 bg-serial-1">



        {/* 주차장 목록 테이블 */}
        <div className="flex flex-col flex-1 p-4 min-h-0">
          <div className="flex flex-col flex-1 min-h-0 rounded-lg border shadow-sm bg-background border-border">
            <ParkingLotTable
              parkingLots={parkingLots}
              selectedId={selectedId}
              onParkingLotSelect={handleParkingLotSelect}
            />
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex-shrink-0 p-3 mt-2 rounded-lg border-t-2 shadow-sm border-border bg-serial-2">
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
            className="mx-4 w-full max-w-3xl h-[70vh] flex flex-col"
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
          <div className="mx-4 w-full max-w-3xl h-[70vh] flex flex-col">
            {content}
          </div>
        </div>
      </Portal>
    );
  }
  // #endregion
} 