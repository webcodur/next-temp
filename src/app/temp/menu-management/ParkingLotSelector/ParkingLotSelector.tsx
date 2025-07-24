/* 
  파일명: /app/temp/menu-management/ParkingLotSelector/ParkingLotSelector.tsx
  기능: 주차장 선택 컴포넌트
  책임: 주차장 목록 표시 및 선택 처리
*/ // ------------------------------

import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';

// #region 타입 정의
interface ParkingLot {
  id: number;
  name: string;
  code: string;
}

interface ParkingLotSelectorProps {
  parkingLots: ParkingLot[];
  selectedParkingLot: number | null;
  onParkingLotSelect: (parkingLotId: number) => void;
}
// #endregion

export function ParkingLotSelector({
  parkingLots,
  selectedParkingLot,
  onParkingLotSelect,
}: ParkingLotSelectorProps) {
  // #region 렌더링
  return (
    <div className="p-6 rounded-xl border shadow-sm bg-card border-border">
      <div className="mb-4">
        <h2 className="flex gap-2 items-center text-lg font-semibold text-card-foreground">
          <span className="flex justify-center items-center w-6 h-6 text-sm font-bold rounded-full text-primary bg-primary/10">1</span>
          주차장 선택
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">메뉴를 설정할 주차장을 선택하세요</p>
      </div>
      <div className="max-w-md relative z-[100]">
        <SimpleDropdown
          label="주차장"
          options={parkingLots.map(lot => ({
            value: lot.id.toString(),
            label: `${lot.name} (${lot.code})`
          }))}
          value={selectedParkingLot?.toString() || ''}
          onChange={(value) => onParkingLotSelect(parseInt(value))}
          placeholder="주차장을 선택하세요"
        />
      </div>
    </div>
  );
  // #endregion
}