'use client';

import React, { useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';

import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { searchParkingDeviceCommandLogs } from '@/services/devices/devices@id_command-logs$_GET';
import { ParkingDevice, ParkingDeviceCommandLog } from '@/types/device';

interface DeviceCommandLogSectionProps {
  device: ParkingDevice;
}

export interface DeviceCommandLogSectionRef {
  refresh: () => void;
}

const DeviceCommandLogSection = forwardRef<DeviceCommandLogSectionRef, DeviceCommandLogSectionProps>(({ 
  device 
}, ref) => {
  // #region 상태 관리
  const [commandLogs, setCommandLogs] = useState<ParkingDeviceCommandLog[]>([]);
  const [loading, setLoading] = useState(false);
  // const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // #endregion

  // #region 데이터 로드
  const loadCommandLogs = useCallback(async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    try {
      const result = await searchParkingDeviceCommandLogs(device.id, {
        page,
        limit,
      });
      
      if (result.success && result.data) {
        setCommandLogs(Array.isArray(result.data.data) ? result.data.data : []);
        // setTotalCount(result.data.total || 0);
        setCurrentPage(result.data.page || 1);
      } else {
        console.error('명령 로그 조회 실패:', '데이터 조회에 실패했습니다.');
        setCommandLogs([]);
        // setTotalCount(0);
      }
    } catch (error) {
      console.error('명령 로그 조회 중 오류:', error);
      setCommandLogs([]);
      // setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [device.id]);

  useEffect(() => {
    loadCommandLogs(currentPage, pageSize);
  }, [loadCommandLogs, currentPage, pageSize]);
  // #endregion

  // #region 핸들러
  const handleRefresh = useCallback(() => {
    loadCommandLogs(currentPage, pageSize);
  }, [loadCommandLogs, currentPage, pageSize]);

  useImperativeHandle(ref, () => ({
    refresh: handleRefresh
  }), [handleRefresh]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로
  };
  // #endregion

  // #region 유틸리티 함수
  const getStatusBadge = (status: number) => {
    const statusMap = {
      0: { label: '대기', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
      1: { label: '성공', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      2: { label: '실패', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { 
      label: '알 수 없음', 
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' 
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };


  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<ParkingDeviceCommandLog>[] = useMemo(() => [
    {
      key: 'id',
      header: 'ID',
      minWidth: '100px',
      align: 'center',
    },
    {
      key: 'command',
      header: '명령',
      align: 'start',
      minWidth: '180px',
      cell: (item: ParkingDeviceCommandLog) => (
        <code className="px-2 py-1 text-sm rounded bg-muted">
          {item.command}
        </code>
      ),
    },
    {
      key: 'status',
      header: '상태',
      align: 'center',
      minWidth: '120px',
      cell: (item: ParkingDeviceCommandLog) => getStatusBadge(item.status),
    },
    {
      key: 'adminId',
      header: '실행자',
      align: 'center',
      minWidth: '120px',
      cell: (item: ParkingDeviceCommandLog) => item.adminId || 'SYSTEM',
    },
    {
      key: 'requestData',
      header: '요청 데이터',
      align: 'start',
      minWidth: '240px',
      cell: (item: ParkingDeviceCommandLog) => (
        <div className="truncate max-w-40">
          {item.requestData ? JSON.stringify(item.requestData) : '-'}
        </div>
      ),
    },
    {
      key: 'responseData',
      header: '응답 데이터',
      align: 'start',
      minWidth: '240px',
      cell: (item: ParkingDeviceCommandLog) => (
        <div className="truncate max-w-40">
          {item.responseData ? JSON.stringify(item.responseData) : '-'}
        </div>
      ),
    },
    {
      key: 'errorMessage',
      header: '오류 메시지',
      align: 'start',
      minWidth: '180px',
      cell: (item: ParkingDeviceCommandLog) => (
        <div className="text-red-600 truncate max-w-32">
          {item.errorMessage || '-'}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: '실행 시간',
      align: 'center',
      minWidth: '140px',
      type: 'datetime',
    },
  ], []);
  // #endregion

  return (
    <>
      {/* 테이블 */}
        <PaginatedTable
          data={commandLogs as unknown as Record<string, unknown>[]}
          columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          itemName="로그"
          isFetching={loading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
    </>
  );
});

DeviceCommandLogSection.displayName = 'DeviceCommandLogSection';

export default DeviceCommandLogSection;
