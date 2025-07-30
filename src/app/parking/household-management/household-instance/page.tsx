'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Users, Plus, Eye, Trash2, ArrowRightLeft } from 'lucide-react';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { PaginatedTable } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import type { BaseTableColumn } from '@/components/ui/ui-data/baseTable/types';
import { searchHouseholdInstance } from '@/services/household/household_instance$_GET';
import { deleteHouseholdInstance } from '@/services/household/household_instance@instanceId_DELETE';
import type { HouseholdInstance, SearchHouseholdInstanceRequest } from '@/types/household';

// #region 타입 정의 확장
interface HouseholdInstanceWithStatus extends HouseholdInstance, Record<string, unknown> {
  status: 'active' | 'inactive' | 'moving';
  roomNumber: string;
  householdName: string;
  ownerName: string;
  residentCount: number;
  contact?: string;
  monthlyFee: number;
}
// #endregion

export default function HouseholdInstanceListPage() {
  // #region 상태 관리
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedResidentCount, setSelectedResidentCount] = useState('');
  const [moveInDateStart, setMoveInDateStart] = useState<Date | null>(null);
  const [moveInDateEnd, setMoveInDateEnd] = useState<Date | null>(null);
  const [householdInstances, setHouseholdInstances] = useState<HouseholdInstanceWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // #endregion

  // #region 데이터 로딩
  const loadHouseholdInstances = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: SearchHouseholdInstanceRequest = {
        page: currentPage,
        limit: pageSize,
        instanceName: searchKeyword || undefined,
      };

      const response = await searchHouseholdInstance(params);

      if (response.success && response.data) {
        // API 데이터를 UI 형식으로 변환
        const transformedData: HouseholdInstanceWithStatus[] = response.data.householdInstances.map((instance: HouseholdInstance) => ({
          ...instance,
          status: instance.endDate && new Date(instance.endDate) < new Date() ? 'inactive' : 'active' as const,
          roomNumber: instance.household ? 
            `${instance.household.address1Depth} ${instance.household.address2Depth}${instance.household.address3Depth ? ' ' + instance.household.address3Depth : ''}` : 
            '정보 없음',
          householdName: instance.instanceName || '세대명 없음',
          ownerName: '-', // 거주자 정보는 별도 API에서 조회 필요
          residentCount: 0, // 거주자 정보는 별도 API에서 조회 필요
          contact: undefined, // 연락처 정보는 별도 API에서 조회 필요
          monthlyFee: 0, // 관리비 정보는 별도 API에서 조회 필요
        }));
        
        setHouseholdInstances(transformedData);
      } else {
        throw new Error(response.errorMsg || '데이터 로딩 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setHouseholdInstances([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchKeyword]);

  useEffect(() => {
    loadHouseholdInstances();
  }, [loadHouseholdInstances]);
  // #endregion

  // #region 필터링된 데이터 (클라이언트 사이드 필터링)
  const filteredData = householdInstances.filter((instance) => {
    const matchesKeyword = instance.roomNumber.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          instance.householdName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          instance.ownerName.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesStatus = !selectedStatus || instance.status === selectedStatus;
    const matchesResidentCount = !selectedResidentCount || instance.residentCount.toString() === selectedResidentCount;
    
    return matchesKeyword && matchesStatus && matchesResidentCount;
  });
  // #endregion

  // #region 검색 필드 설정
  const searchFields = [
    {
      key: 'keyword',
      label: '검색어',
      element: (
        <Field
          type="text"
          placeholder="호실번호, 세대명, 세대주명 검색"
          value={searchKeyword}
          onChange={setSearchKeyword}
          showClearButton={true}
        />
      ),
      visible: true,
    },
    {
      key: 'status',
      label: '상태',
      element: (
        <Field
          type="select"
          placeholder="상태 선택"
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={[
            { value: 'active', label: '거주중' },
            { value: 'moving', label: '이사중' },
            { value: 'inactive', label: '퇴거' },
          ]}
        />
      ),
      visible: true,
    },
    {
      key: 'residentCount',
      label: '가구원 수',
      element: (
        <Field
          type="select"
          placeholder="가구원 수 선택"
          value={selectedResidentCount}
          onChange={setSelectedResidentCount}
          options={[
            { value: '1', label: '1명' },
            { value: '2', label: '2명' },
            { value: '3', label: '3명' },
            { value: '4', label: '4명' },
            { value: '5', label: '5명 이상' },
          ]}
        />
      ),
      visible: true,
    },
    {
      key: 'moveInDate',
      label: '입주일 범위',
      element: (
        <Field
          type="datepicker"
          datePickerType="range"
          placeholder="입주일 범위 선택"
          startDate={moveInDateStart}
          endDate={moveInDateEnd}
          onStartDateChange={setMoveInDateStart}
          onEndDateChange={setMoveInDateEnd}
        />
      ),
      visible: true,
    },
  ];
  // #endregion

  // #region 테이블 컬럼 설정
  const columns: BaseTableColumn<HouseholdInstanceWithStatus>[] = [
    {
      key: 'roomNumber',
      header: '호실번호',
      cell: (instance: HouseholdInstanceWithStatus) => (
        <div className="font-medium">{instance.roomNumber}</div>
      ),
    },
    {
      key: 'householdName',
      header: '세대명',
      cell: (instance: HouseholdInstanceWithStatus) => (
        <div className="font-medium">{instance.householdName}</div>
      ),
    },
    {
      key: 'ownerName',
      header: '세대주',
      cell: (instance: HouseholdInstanceWithStatus) => (
        <div className="text-center">{instance.ownerName}</div>
      ),
    },
    {
      key: 'residentCount',
      header: '가구원 수',
      cell: (instance: HouseholdInstanceWithStatus) => (
        <div className="text-center">
          <span className="flex items-center justify-center gap-1">
            <Users className="w-4 h-4" />
            {instance.residentCount}명
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      cell: (instance: HouseholdInstanceWithStatus) => {
        const statusMap: Record<HouseholdInstanceWithStatus['status'], { label: string; className: string }> = {
          active: { label: '거주중', className: 'bg-green-100 text-green-800' },
          moving: { label: '이사중', className: 'bg-yellow-100 text-yellow-800' },
          inactive: { label: '퇴거', className: 'bg-gray-100 text-gray-800' },
        };
        const status = statusMap[instance.status];
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      key: 'startDate',
      header: '입주일',
      cell: (instance: HouseholdInstanceWithStatus) => (
        <div className="text-center text-sm">
          {instance.startDate ? new Date(instance.startDate).toLocaleDateString() : '-'}
        </div>
      ),
    },
    {
      key: 'contact',
      header: '연락처',
      cell: (instance: HouseholdInstanceWithStatus) => (
        <div className="text-center text-sm">{instance.contact || '-'}</div>
      ),
    },
    {
      key: 'monthlyFee',
      header: '월 관리비',
      cell: (instance: HouseholdInstanceWithStatus) => (
        <div className="text-right font-medium">
          {instance.monthlyFee.toLocaleString()}원
        </div>
      ),
    },
    {
      key: 'actions',
      header: '작업',
      cell: (instance: HouseholdInstanceWithStatus) => (
        <div className="flex gap-1 justify-center">
          <Link
            href={`/parking/household-management/household-instance/${instance.id}`}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="상세보기"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <button
            onClick={() => handleDelete(instance.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
  // #endregion

  // #region 이벤트 핸들러
  const handleSearch = () => {
    setCurrentPage(1);
    loadHouseholdInstances();
  };

  const handleReset = () => {
    setSearchKeyword('');
    setSelectedStatus('');
    setSelectedResidentCount('');
    setMoveInDateStart(null);
    setMoveInDateEnd(null);
    setCurrentPage(1);
    loadHouseholdInstances();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 입주세대를 삭제하시겠습니까?')) return;
    
    try {
      const response = await deleteHouseholdInstance(id);
      if (response.success) {
        alert('입주세대가 삭제되었습니다.');
        loadHouseholdInstances();
      } else {
        throw new Error(response.errorMsg || '삭제 실패');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.');
    }
  };

  const handleRowClick = (instance: HouseholdInstanceWithStatus) => {
    console.log('행 클릭:', instance);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  // #endregion

  // #region 액션 버튼
  const rightActions = (
    <div className="flex gap-2">
      <Link
        href="/parking/household-management/household-instance/move"
        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
      >
        <ArrowRightLeft className="w-4 h-4" />
        세대 이동
      </Link>
      <Link
        href="/parking/household-management/household-instance/create"
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        세대 등록
      </Link>
    </div>
  );
  // #endregion

  // #region 에러 상태
  if (error) {
    return (
      <div className="p-6">
        <PageHeader
          title="입주세대 관리"
          subtitle="아파트 입주세대 정보를 관리합니다"
          rightActions={rightActions}
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">오류가 발생했습니다: {error}</p>
          <button 
            onClick={loadHouseholdInstances}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }
  // #endregion

  return (
    <div className="p-6">
      <PageHeader
        title="입주세대 관리"
        subtitle="아파트 입주세대 정보를 관리합니다"
        rightActions={rightActions}
      />
      
      <div className="space-y-6">
        {/* 검색/필터 패널 */}
        <AdvancedSearch
          title="입주세대 검색"
          fields={searchFields}
          onSearch={handleSearch}
          onReset={handleReset}
          searchLabel="검색"
          resetLabel="초기화"
          defaultOpen={true}
        />

        {/* 데이터 테이블 */}
        <PaginatedTable
          data={filteredData}
          columns={columns}
          onRowClick={handleRowClick}
          itemName="세대"
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[5, 10, 20, 50]}
          isFetching={loading}
        />
      </div>
    </div>
  );
} 