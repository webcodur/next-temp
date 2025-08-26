/* 
  파일명: /components/view/parking-lot-selection/ParkingLotTable/ParkingLotTable.tsx
  기능: 주차장 목록 테이블
  책임: 주차장 목록을 테이블 형태로 표시하고 선택 기능 제공
*/

'use client';

import { useMemo, useCallback } from 'react';
import { Building2, Check } from 'lucide-react';
import { BaseTable, BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';
import { ParkingLot } from '@/store/auth';

// #region 타입
interface ParkingLotTableProps {
  parkingLots: ParkingLot[];
  selectedId: number | null;
  onParkingLotSelect: (parkingLot: ParkingLot) => void;
}
// #endregion

export function ParkingLotTable({ 
  parkingLots, 
  selectedId, 
  onParkingLotSelect 
}: ParkingLotTableProps) {
  // #region 테이블 설정
  // 테이블 컬럼 정의
  const columns: BaseTableColumn<ParkingLot>[] = useMemo(() => [
    {
      key: 'name',
      header: '현장명',
      align: 'start',
      minWidth: '200px',
    },
    {
      key: 'description',
      header: '설명',
      align: 'start',
      minWidth: '250px',
      render: (value) => (value as string) || '-',
    },
    {
      header: '선택',
      align: 'center',
      minWidth: '80px',
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

  // 행 클래스명 메모이제이션
  const getRowClassName = useCallback((item: ParkingLot) => {
    return `cursor-pointer ${
      selectedId === item.id
        ? 'bg-primary-0 border-l-4 border-l-primary'
        : 'hover:bg-counter-1'
    }`;
  }, [selectedId]);
  // #endregion

  // #region 렌더링
  if (parkingLots.length === 0) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center p-8 text-center bg-counter-0">
        <div className="flex justify-center items-center mb-4 w-16 h-16 rounded-full bg-counter-2">
          <Building2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          사용 가능한 현장이 없습니다
        </h3>
        <p className="mb-4 text-muted-foreground">
          현재 계정에 할당된 현장이 없습니다
        </p>
        <p className="text-sm text-muted-foreground">
          • 관리자에게 현장 권한을 요청해주세요<br/>
          • 계정 설정을 확인해주세요
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1">
      <BaseTable
        data={parkingLots}
        columns={columns}
        onRowClick={onParkingLotSelect}
        getRowClassName={getRowClassName}
      />
    </div>
  );
  // #endregion
}