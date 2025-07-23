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
      sortable: true,
      align: 'start',
    },
    {
      key: 'code',
      header: '코드',
      sortable: true,
      align: 'start',
      render: (value) => (value as string) || '-',
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
        <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto ${
          selectedId === item.id
            ? 'neu-inset text-primary'
            : 'neu-flat'
        }`}>
          {selectedId === item.id && (
            <div className="w-2 h-2 rounded-full bg-primary" />
          )}
        </div>
      )
    },
  ], [selectedId]);

  // 행 클래스명 메모이제이션
  const getRowClassName = useCallback((item: ParkingLot) => {
    return `cursor-pointer transition-all ${
      selectedId === item.id
        ? 'neu-inset-shadow bg-primary/5'
        : 'hover:neu-inset-shadow hover:bg-muted/30'
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
    <div className="mb-8 max-h-96 overflow-y-auto">
      <BaseTable
        data={parkingLots}
        columns={columns}
        onRowClick={onParkingLotSelect}
        rowClassName={getRowClassName}
      />
    </div>
  );
  // #endregion
}