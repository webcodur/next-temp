'use client';

import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { ParkingDevice } from '@/types/device';

interface DeviceHistorySectionProps {
  device: ParkingDevice;
}

export interface DeviceHistorySectionRef {
  refresh: () => void;
}

// 임시 히스토리 타입 정의
interface DeviceHistoryRecord {
  id: number;
  timestamp: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  user: string;
}

const DeviceHistorySection = forwardRef<DeviceHistorySectionRef, DeviceHistorySectionProps>(({ 
  device 
}, ref) => {
  // #region 상태 관리
  const [historyRecords, setHistoryRecords] = useState<DeviceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  // #endregion

  // #region 데이터 로드
  const loadHistoryRecords = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: 실제 API 호출로 교체 필요
      // const result = await getDeviceHistory(device.id);
      
      // 임시 더미 데이터
      const dummyData: DeviceHistoryRecord[] = [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          action: '설정 변경',
          field: 'IP 주소',
          oldValue: '192.168.1.100',
          newValue: device.ip,
          user: '관리자'
        }
      ];
      
      setHistoryRecords(dummyData);
    } catch (error) {
      console.error('히스토리 조회 중 오류:', error);
      setHistoryRecords([]);
    } finally {
      setLoading(false);
    }
  }, [device.ip]);

  useEffect(() => {
    loadHistoryRecords();
  }, [loadHistoryRecords]);

  // ref 메서드 노출
  useImperativeHandle(ref, () => ({
    refresh: loadHistoryRecords,
  }));
  // #endregion

  // #region 테이블 컬럼 정의
  const columns: BaseTableColumn<DeviceHistoryRecord>[] = [
    {
      key: 'timestamp',
      header: '변경 일시',
      align: 'center',
      width: '20%',
      type: 'datetime',
    },
    {
      key: 'action',
      header: '작업',
      align: 'center', 
      width: '15%',
    },
    {
      key: 'field',
      header: '변경 필드',
      align: 'center',
      width: '15%',
    },
    {
      key: 'oldValue',
      header: '이전 값',
      align: 'center',
      width: '20%',
    },
    {
      key: 'newValue', 
      header: '새로운 값',
      align: 'center',
      width: '20%',
    },
    {
      key: 'user',
      header: '변경자',
      align: 'center',
      width: '10%',
    },
  ];
  // #endregion

  return (
    <div className="space-y-4">
      <PaginatedTable
        data={historyRecords as unknown as Record<string, unknown>[]}
        columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName="히스토리"
        isFetching={loading}
        minWidth="800px"
        // emptyMessage="변경 이력이 없습니다."
      />
    </div>
  );
});

DeviceHistorySection.displayName = 'DeviceHistorySection';

export default DeviceHistorySection;
