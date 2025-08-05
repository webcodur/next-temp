/* 메뉴 설명: IP 차단 내역 검색 및 조회 */
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';

// API 호출
import { searchBlockHistory } from '@/services/ip/block_history$_GET';

// 타입 정의
import { IpBlockHistory, SearchIpBlockHistoryRequest } from '@/types/api';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 검색 필터 인터페이스
interface SearchFilters {
  ip: string;
  blockType: string;
  blockReason: string;
  userAgent: string;
  requestMethod: string;
  requestUrl: string;
  isActive: string;
  startDate: string;
  endDate: string;
}
// #endregion

export default function IpBlockHistoryPage() {
  
  // #region 상태 관리
  const [historyList, setHistoryList] = useState<IpBlockHistory[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    ip: '',
    blockType: '',
    blockReason: '',
    userAgent: '',
    requestMethod: '',
    requestUrl: '',
    isActive: '',
    startDate: '',
    endDate: '',
  });
  // #endregion

  // #region 옵션 정의
  const blockTypeOptions: Option[] = useMemo(() => [
    { value: 'MANUAL', label: '수동 차단' },
    { value: 'AUTO', label: '자동 차단' },
  ], []);

  const requestMethodOptions: Option[] = useMemo(() => [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'PATCH', label: 'PATCH' },
  ], []);

  const activeStatusOptions: Option[] = useMemo(() => [
    { value: '1', label: '활성 (차단 중)' },
    { value: '0', label: '비활성 (해제됨)' },
  ], []);
  // #endregion

  // #region 데이터 로드
  const loadHistoryData = useCallback(async (filters?: Partial<SearchFilters>) => {
    setLoading(true);
    try {
      const searchParams: SearchIpBlockHistoryRequest = {
        page: 1,
        limit: 50,
        ...(filters?.ip && { ip: filters.ip }),
        ...(filters?.blockReason && { reason: filters.blockReason }),
        ...(filters?.startDate && { date_from: filters.startDate }),
        ...(filters?.endDate && { date_to: filters.endDate }),
      };

      const result = await searchBlockHistory(searchParams);
      
      if (result.success) {
        setHistoryList(result.data?.data || []);
      } else {
        console.error('IP 차단 내역 로드 실패:', result.errorMsg);
        setHistoryList([]);
      }
    } catch (error) {
      console.error('IP 차단 내역 로드 중 오류:', error);
      setHistoryList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistoryData();
  }, [loadHistoryData]);
  // #endregion

  // #region 검색 관련 핸들러
  const handleSearch = useCallback(() => {
    const activeFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key as keyof SearchFilters] = value.trim();
      }
      return acc;
    }, {} as Partial<SearchFilters>);

    loadHistoryData(activeFilters);
  }, [searchFilters, loadHistoryData]);

  const handleReset = useCallback(() => {
    setSearchFilters({
      ip: '',
      blockType: '',
      blockReason: '',
      userAgent: '',
      requestMethod: '',
      requestUrl: '',
      isActive: '',
      startDate: '',
      endDate: '',
    });
    loadHistoryData();
  }, [loadHistoryData]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);


  // #endregion

  // #region 검색 필드 구성
  const searchFields = useMemo(() => [
    {
      key: 'ip',
      label: 'IP 주소 검색',
      element: (
        <FieldText
          id="search-ip"
          label="IP 주소"
          placeholder="IP 주소를 입력하세요"
          value={searchFilters.ip}
          onChange={(value) => updateFilter('ip', value)}
          showSearchIcon={true}
        />
      ),
      visible: true,
    },
    {
      key: 'blockType',
      label: '차단 유형 검색',
      element: (
        <FieldSelect
          id="search-blockType"
          label="차단 유형"
          placeholder="차단 유형을 선택하세요"
          options={blockTypeOptions}
          value={searchFilters.blockType}
          onChange={(value) => updateFilter('blockType', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'blockReason',
      label: '차단 사유 검색',
      element: (
        <FieldText
          id="search-blockReason"
          label="차단 사유"
          placeholder="차단 사유를 입력하세요"
          value={searchFilters.blockReason}
          onChange={(value) => updateFilter('blockReason', value)}
          showSearchIcon={true}
        />
      ),
      visible: true,
    },
    {
      key: 'requestMethod',
      label: '요청 메소드 검색',
      element: (
        <FieldSelect
          id="search-requestMethod"
          label="요청 메소드"
          placeholder="요청 메소드를 선택하세요"
          options={requestMethodOptions}
          value={searchFilters.requestMethod}
          onChange={(value) => updateFilter('requestMethod', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'isActive',
      label: '상태 검색',
      element: (
        <FieldSelect
          id="search-isActive"
          label="차단 상태"
          placeholder="차단 상태를 선택하세요"
          options={activeStatusOptions}
          value={searchFilters.isActive}
          onChange={(value) => updateFilter('isActive', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'startDate',
      label: '시작 날짜',
      element: (
        <FieldText
          id="search-startDate"
          label="시작 날짜"
          placeholder="YYYY-MM-DD 형식으로 입력"
          value={searchFilters.startDate}
          onChange={(value: string) => updateFilter('startDate', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'endDate',
      label: '종료 날짜',
      element: (
        <FieldText
          id="search-endDate"
          label="종료 날짜"
          placeholder="YYYY-MM-DD 형식으로 입력"
          value={searchFilters.endDate}
          onChange={(value: string) => updateFilter('endDate', value)}
        />
      ),
      visible: true,
    },
  ], [searchFilters, blockTypeOptions, requestMethodOptions, activeStatusOptions, updateFilter]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<IpBlockHistory>[] = [
    {
      key: 'id',
      header: 'ID',
      align: 'center',
      width: '6%',
    },
    {
      key: 'ip',
      header: 'IP 주소',
      align: 'start',
      width: '12%',
    },
    {
      key: 'blockType',
      header: '차단 유형',
      align: 'center',
      width: '8%',
      cell: (item: IpBlockHistory) => item.blockType === 'MANUAL' ? '수동' : '자동',
    },
    {
      key: 'requestMethod',
      header: '메소드',
      align: 'center',
      width: '7%',
    },
    {
      key: 'requestUrl',
      header: '요청 URL',
      align: 'start',
      width: '20%',
      cell: (item: IpBlockHistory) => (
        <span className="truncate" title={item.requestUrl || '-'}>
          {item.requestUrl || '-'}
        </span>
      ),
    },
    {
      key: 'blockReason',
      header: '차단 사유',
      align: 'start',
      width: '15%',
      cell: (item: IpBlockHistory) => (
        <span className="truncate" title={item.blockReason}>
          {item.blockReason}
        </span>
      ),
    },
    {
      key: 'blockedAt',
      header: '차단 시간',
      align: 'center',
      width: '12%',
      cell: (item: IpBlockHistory) => {
        const date = new Date(item.blockedAt);
        return date.toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      key: 'unblockedAt',
      header: '해제 시간',
      align: 'center',
      width: '12%',
      cell: (item: IpBlockHistory) => {
        if (!item.unblockedAt) return '-';
        const date = new Date(item.unblockedAt);
        return date.toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      key: 'isActive',
      header: '상태',
      align: 'center',
      width: '8%',
      cell: (item: IpBlockHistory) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          item.isActive 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {item.isActive ? '차단 중' : '해제됨'}
        </span>
      ),
    },
  ];
  // #endregion

  // #region 렌더링
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="IP 차단 내역" 
        subtitle="IP 차단 내역 검색 및 조회"
        rightActions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleSearch}
            disabled={loading}
            title="검색"
          >
            <Search size={16} />
          </Button>
        }
      />

      {/* 고급 검색 */}
      <AdvancedSearch
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        
        defaultOpen={true}
      />
      
      {/* 테이블 */}
      <PaginatedTable
        data={historyList as unknown as Record<string, unknown>[]}
        columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName="차단 내역"
      />
    </div>
  );
  // #endregion
} 