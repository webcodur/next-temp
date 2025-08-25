/* 
  파일명: /components/view/parking-lot-selection/SelectedParkingLotCard/SelectedParkingLotCard.tsx
  기능: 선택된 주차장 표시 카드
  책임: 현재 선택된 주차장 정보를 시각적으로 표시
*/

'use client';

import { Building2, Check } from 'lucide-react';
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
      <div className={`p-5 border rounded-lg ${
        selectedId 
          ? 'border-primary bg-primary-0' 
          : 'border-border bg-counter-2'
      }`}>
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            {selectedId ? (
              <div className="space-y-2">
                {/* 선택된 현장명 */}
                <div className="flex gap-2 items-center">
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedParkingLot?.name}
                  </h3>
                </div>
                
                {/* 설명 정보 */}
                {selectedParkingLot?.description && (
                  <div className="text-sm text-muted-foreground">
                    {selectedParkingLot.description}
                  </div>
                )}
                
                {/* 현장 ID 정보 */}
                <div className="text-xs text-muted-foreground">
                  현장 ID: {selectedParkingLot?.id}
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="text-lg font-semibold text-foreground">현장을 선택해주세요</span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    관리할 현장을 선택하여 시작해보세요
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* 상태 아이콘 */}
          <div className="relative">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
              selectedId 
                ? 'bg-primary-1 text-primary' 
                : 'bg-counter-3 text-muted-foreground'
            }`}>
              {selectedId ? (
                <Check className="w-6 h-6" />
              ) : (
                <Building2 className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // #endregion
}