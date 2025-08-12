/* 
  파일명: /components/view/parking-lot-selection/ParkingLotTable/ParkingLotTable.tsx
  기능: 주차장 목록 테이블
  책임: 주차장 목록을 테이블 형태로 표시하고 선택 기능 제공
*/

'use client';

import { useMemo, useCallback } from 'react';
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
        <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto border-2 transition-all ${
          selectedId === item.id
            ? 'border-primary bg-primary'
            : 'border-border bg-card hover:border-primary hover:border-opacity-60'
        }`}>
          {selectedId === item.id && (
            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )
    },
  ], [selectedId]);

  // 행 클래스명 메모이제이션
  const getRowClassName = useCallback((item: ParkingLot) => {
    return `cursor-pointer transition-all ${
      selectedId === item.id
        ? 'bg-primary-0 border-l-4 border-l-primary'
        : 'hover:bg-counter-1'
    }`;
  }, [selectedId]);
  // #endregion

  // #region 렌더링
  if (parkingLots.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          사용 가능한 현장이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto mb-8 max-h-96">
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