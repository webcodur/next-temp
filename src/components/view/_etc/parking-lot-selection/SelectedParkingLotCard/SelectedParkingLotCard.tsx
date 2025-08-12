/* 
  파일명: /components/view/parking-lot-selection/SelectedParkingLotCard/SelectedParkingLotCard.tsx
  기능: 선택된 주차장 표시 카드
  책임: 현재 선택된 주차장 정보를 시각적으로 표시
*/

'use client';

import { ParkingLot } from '@/store/auth';

// #region 타입
interface SelectedParkingLotCardProps {
  selectedId: number | null;
  parkingLots: ParkingLot[];
}
// #endregion

export function SelectedParkingLotCard({ selectedId, parkingLots }: SelectedParkingLotCardProps) {
  // #region 계산된 값
  const selectedParkingLot = selectedId 
    ? parkingLots.find(p => p.id === selectedId) 
    : null;
  // #endregion

  // #region 렌더링
  return (
    <div className="mb-6">
      <div className={`p-5 border rounded-lg transition-all ${
        selectedId 
          ? 'border-primary bg-primary-0' 
          : 'border-border bg-counter-2'
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            {selectedId ? (
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedParkingLot?.name}
                </h3>
                {selectedParkingLot?.description && (
                  <span className="text-sm text-muted-foreground">
                    {selectedParkingLot.description}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">현장을 선택해주세요</span>
                <span className="text-sm text-muted-foreground">관리할 현장을 선택해주세요</span>
              </div>
            )}
          </div>
          <div className="relative">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
              selectedId 
                ? 'bg-primary-1 text-primary' 
                : 'bg-counter-3 text-muted-foreground'
            }`}>
              {selectedId ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // #endregion
}