'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RefreshCw, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/ui-input/button/Button';
import TitleRow from '@/components/ui/ui-layout/title-row/TitleRow';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import FieldDatePicker from '@/components/ui/ui-input/field/datepicker/FieldDatePicker';
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
  // #region 타입 정의
  interface HistoryFilters {
    actionType: string;
    changedFields: string;
    startDate: Date | null;
    endDate: Date | null;
  }
  // #endregion

  // #region 상태 관리
  const [history, setHistory] = useState<ParkingDeviceHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 검색 필터
  const [filters, setFilters] = useState<HistoryFilters>({
    actionType: '',
    changedFields: '',
    startDate: null,
    endDate: null,
  });
  // #endregion

  // #region 데이터 로드
  const loadHistory = useCallback(async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    try {
      const dateToLocalDatetimeString = (date: Date) => {
        const pad2 = (n: number) => n.toString().padStart(2, '0');
        const y = date.getFullYear();
        const m = pad2(date.getMonth() + 1);
        const d = pad2(date.getDate());
        const hh = pad2(date.getHours());
        const mm = pad2(date.getMinutes());
        return `${y}-${m}-${d}T${hh}:${mm}`;
      };

      const searchParams = {
        page,
        limit,
        ...(filters.actionType && { actionType: filters.actionType }),
        ...(filters.changedFields && { changedFields: filters.changedFields }),
        ...(filters.startDate && { startDate: dateToLocalDatetimeString(filters.startDate) }),
        ...(filters.endDate && { endDate: dateToLocalDatetimeString(filters.endDate) }),
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
      startDate: null,
      endDate: null,
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

  const updateFilter = useCallback(<K extends keyof HistoryFilters>(field: K, value: HistoryFilters[K]) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);
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

  // 빠른 기간 설정 핸들러
  const setLast7Days = useCallback(() => {
    const end = new Date();
    const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    updateFilter('startDate', start);
    updateFilter('endDate', end);
  }, [updateFilter]);

  const setTodayRange = useCallback(() => {
    const now = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    updateFilter('startDate', start);
    updateFilter('endDate', now);
  }, [updateFilter]);
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

  // #region 검색 필드 구성
  const searchFields = useMemo(() => [
    {
      key: 'actionType',
      label: '작업 유형',
      element: (
        <FieldSelect
          id="history-action-type"
          label="작업 유형"
          placeholder="작업 유형 선택"
          options={ACTION_TYPE_OPTIONS}
          value={filters.actionType}
          onChange={(value) => updateFilter('actionType', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'changedFields',
      label: '변경 필드',
      element: (
        <FieldText
          id="history-changed-fields"
          placeholder="변경된 필드명"
          value={filters.changedFields}
          onChange={(value) => updateFilter('changedFields', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'startDate',
      label: '시작 시간',
      element: (
        <FieldDatePicker
          id="history-start-datetime"
          label="시작 시간"
          datePickerType="datetime"
          value={filters.startDate}
          onChange={(date) => updateFilter('startDate', date)}
        />
      ),
      visible: true,
    },
    {
      key: 'endDate',
      label: '종료 시간',
      element: (
        <FieldDatePicker
          id="history-end-datetime"
          label="종료 시간"
          datePickerType="datetime"
          value={filters.endDate}
          onChange={(date) => updateFilter('endDate', date)}
        />
      ),
      visible: true,
    },
  ], [filters.actionType, filters.changedFields, filters.startDate, filters.endDate, updateFilter]);
  // #endregion

  return (
    <div className="space-y-6">
      {/* 변경 이력 섹션 */}
      <TitleRow 
        title="변경 이력" 
        subtitle="차단기 설정 변경 이력을 조회합니다."
        endContent={(
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
        )}
      />

        {/* 검색 필터: AdvancedSearch */}
        <AdvancedSearch
          fields={searchFields}
          onSearch={handleSearch}
          onReset={handleReset}
          defaultOpen={false}
          searchMode="server"
          footerLeft={(
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={setLast7Days}
                disabled={loading}
              >
                <Calendar size={14} className="mr-1" />
                최근 7일
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={setTodayRange}
                disabled={loading}
              >
                <Calendar size={14} className="mr-1" />
                오늘
              </Button>
            </div>
          )}
        />

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
          minWidth="1200px"
        />
    </div>
  );
}
