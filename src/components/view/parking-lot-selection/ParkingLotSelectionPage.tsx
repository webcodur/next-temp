/* 
  파일명: /components/view/parking-lot-selection/ParkingLotSelectionPage.tsx
  기능: 로그인 후 현장(주차장) 선택 페이지
  책임: 사용자가 관리할 현장을 선택하고 메인 페이지로 진입할 수 있도록 한다.
*/

'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocale } from '@/hooks/useI18n';
import { Portal } from '@/components/ui/ui-layout/portal/Portal';
import { Card } from '@/components/ui/ui-effects/card/Card';
import { Button } from '@/components/ui/ui-input/button/Button';
import { ParkingLot } from '@/store/auth';

// #region 타입

interface ParkingLotSelectionPageProps {
  onSelectionComplete?: () => void;
}
// #endregion

export default function ParkingLotSelectionPage({ onSelectionComplete }: ParkingLotSelectionPageProps) {
  // #region 상수
  const { parkingLots, selectParkingLot } = useAuth();
  const { isRTL } = useLocale();
  // #endregion

  // #region 상태
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                현장 선택
              </h1>
              <p className="text-muted-foreground">
                관리할 현장을 선택해주세요
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {parkingLots.map((parkingLot) => (
                <Card 
                  key={parkingLot.id}
                  className={`p-4 cursor-pointer border-2 transition-colors ${
                    selectedId === parkingLot.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  clickable={true}
                  onClick={() => handleParkingLotSelect(parkingLot)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {parkingLot.name}
                      </h3>
                      {parkingLot.code && (
                        <p className="text-sm text-muted-foreground mt-1">
                          코드: {parkingLot.code}
                        </p>
                      )}
                      {parkingLot.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {parkingLot.description}
                        </p>
                      )}
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedId === parkingLot.id
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}>
                      {selectedId === parkingLot.id && (
                        <div className="w-2 h-2 rounded-full bg-primary-foreground m-0.5" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {parkingLots.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  사용 가능한 현장이 없습니다.
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleConfirm}
                disabled={!selectedId || isLoading}
                className="min-w-32"
              >
                {isLoading ? '처리 중...' : '확인'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Portal>
  );
  // #endregion
}