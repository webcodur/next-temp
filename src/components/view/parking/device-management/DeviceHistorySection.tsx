'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { searchParkingDeviceHistory } from '@/services/devices/devices@id_history$_GET';
import { ParkingDevice, ParkingDeviceHistory } from '@/types/device';

interface DeviceHistorySectionProps {
  device: ParkingDevice;
}

const ACTION_TYPE_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'CREATED', label: '생성' },
  { value: 'UPDATED', label: '수정' },
  { value: 'DELETED', label: '삭제' },
];

export default function DeviceHistorySection({ 
  device 
}: DeviceHistorySectionProps) {
  // #region 상태 관리
  const [history, setHistory] = useState<ParkingDeviceHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 검색 필터
  const [filters, setFilters] = useState({
    actionType: '',
    changedFields: '',
    startDate: '',
    endDate: '',
  });
  // #endregion

  // #region 데이터 로드
  const loadHistory = useCallback(async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    try {
      const searchParams = {
        page,
        limit,
        ...(filters.actionType && { actionType: filters.actionType }),
        ...(filters.changedFields && { changedFields: filters.changedFields }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };

      const result = await searchParkingDeviceHistory(device.id, searchParams);
      
      if (result.success && result.data) {
        setHistory(Array.isArray(result.data.data) ? result.data.data : []);
        setCurrentPage(result.data.page || 1);
      } else {
        console.error('변경 이력 조회 실패:', result.errorMsg);
        setHistory([]);
      }
    } catch (error) {
      console.error('변경 이력 조회 중 오류:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [device.id, filters]);

  useEffect(() => {
    loadHistory(currentPage, pageSize);
  }, [loadHistory, currentPage, pageSize]);
  // #endregion

  // #region 핸들러
  const handleRefresh = () => {
    loadHistory(currentPage, pageSize);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadHistory(1, pageSize);
  };

  const handleReset = () => {
    setFilters({
      actionType: '',
      changedFields: '',
      startDate: '',
      endDate: '',
    });
    setCurrentPage(1);
    setTimeout(() => loadHistory(1, pageSize), 0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  // #endregion

  // #region 유틸리티 함수
  const getActionTypeBadge = (actionType: string) => {
    const actionMap = {
      CREATED: { label: '생성', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
      UPDATED: { label: '수정', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
      DELETED: { label: '삭제', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    };
    
    const actionInfo = actionMap[actionType as keyof typeof actionMap] || { 
      label: actionType, 
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' 
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionInfo.className}`}>
        {actionInfo.label}
      </span>
    );
  };

  const getChangedByTypeBadge = (changedByType: string) => {
    const typeMap = {
      ADMIN: { label: '관리자', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
      SYSTEM: { label: '시스템', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
      API: { label: 'API', className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400' },
    };
    
    const typeInfo = typeMap[changedByType as keyof typeof typeMap] || { 
      label: changedByType, 
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' 
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeInfo.className}`}>
        {typeInfo.label}
      </span>
    );
  };

  const formatDateTime = (date: Date | string) => {
    if (!date) return '-';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '-';
    
    return dateObj.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // 오늘 날짜를 기본값으로 설정
  const today = formatDateForInput(new Date());
  const lastWeek = formatDateForInput(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<ParkingDeviceHistory>[] = useMemo(() => [
    {
      key: 'id',
      header: 'ID',
      width: '6%',
      align: 'center',
    },
    {
      key: 'actionType',
      header: '작업 유형',
      align: 'center',
      width: '8%',
      cell: (item: ParkingDeviceHistory) => getActionTypeBadge(item.actionType),
    },
    {
      key: 'changedFields',
      header: '변경 필드',
      align: 'start',
      width: '15%',
      cell: (item: ParkingDeviceHistory) => (
        <div className="truncate max-w-32">
          {item.changedFields || '-'}
        </div>
      ),
    },
    {
      key: 'changedByType',
      header: '변경 주체',
      align: 'center',
      width: '8%',
      cell: (item: ParkingDeviceHistory) => getChangedByTypeBadge(item.changedByType),
    },
    {
      key: 'admin',
      header: '관리자',
      align: 'center',
      width: '10%',
      cell: (item: ParkingDeviceHistory) => item.admin?.name || '-',
    },
    {
      key: 'reason',
      header: '변경 사유',
      align: 'start',
      width: '15%',
      cell: (item: ParkingDeviceHistory) => (
        <div className="truncate max-w-32">
          {item.reason || '-'}
        </div>
      ),
    },
    {
      key: 'beforeData',
      header: '변경 전',
      align: 'start',
      width: '15%',
      cell: (item: ParkingDeviceHistory) => (
        <div className="px-2 py-1 text-xs truncate bg-red-50 rounded max-w-32">
          {item.beforeData ? JSON.stringify(item.beforeData).substring(0, 50) + '...' : '-'}
        </div>
      ),
    },
    {
      key: 'afterData',
      header: '변경 후',
      align: 'start',
      width: '15%',
      cell: (item: ParkingDeviceHistory) => (
        <div className="px-2 py-1 text-xs truncate bg-green-50 rounded max-w-32">
          {item.afterData ? JSON.stringify(item.afterData).substring(0, 50) + '...' : '-'}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: '변경 시간',
      align: 'center',
      width: '12%',
      cell: (item: ParkingDeviceHistory) => formatDateTime(item.createdAt),
    },
  ], []);
  // #endregion

  return (
    <div className="space-y-6">
      {/* 변경 이력 섹션 */}
      <div className="p-6 rounded-lg border bg-card border-border">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            title="새로고침"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            새로고침
          </Button>
        </div>

        {/* 검색 필터 */}
        <div className="p-4 mb-6 rounded-lg bg-muted/30">
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
            <SimpleDropdown
              value={filters.actionType}
              onChange={(value) => handleFilterChange('actionType', value)}
              options={ACTION_TYPE_OPTIONS}
              placeholder="작업 유형 선택"
              validationRule={{ type: 'free', mode: 'edit' }}
            />
            <SimpleTextInput
              value={filters.changedFields}
              onChange={(value) => handleFilterChange('changedFields', value)}
              placeholder="변경된 필드명"
              validationRule={{ type: 'free', mode: 'edit' }}
            />
            <SimpleTextInput
              type="datetime-local"
              value={filters.startDate}
              onChange={(value) => handleFilterChange('startDate', value)}
              placeholder="시작 날짜"
              validationRule={{ type: 'free', mode: 'edit' }}
            />
            <SimpleTextInput
              type="datetime-local"
              value={filters.endDate}
              onChange={(value) => handleFilterChange('endDate', value)}
              placeholder="종료 날짜"
              validationRule={{ type: 'free', mode: 'edit' }}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSearch}
              disabled={loading}
            >
              검색
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={loading}
            >
              초기화
            </Button>
            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleFilterChange('startDate', lastWeek);
                  handleFilterChange('endDate', today);
                }}
                disabled={loading}
              >
                <Calendar size={14} className="mr-1" />
                최근 7일
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleFilterChange('startDate', today);
                  handleFilterChange('endDate', today);
                }}
                disabled={loading}
              >
                <Calendar size={14} className="mr-1" />
                오늘
              </Button>
            </div>
          </div>
        </div>

        {/* 테이블 */}
        <PaginatedTable
          data={history as unknown as Record<string, unknown>[]}
          columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          itemName="이력"
          isFetching={loading}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
