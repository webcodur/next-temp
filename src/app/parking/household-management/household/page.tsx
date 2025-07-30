'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Eye, Trash2 } from 'lucide-react';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { PaginatedTable } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import type { BaseTableColumn } from '@/components/ui/ui-data/baseTable/types';
import { searchHousehold } from '@/services/household/household$_GET';
import { deleteHousehold } from '@/services/household/household@id_DELETE';
import type { Household, HouseholdType } from '@/types/household';

// #region 타입 정의 확장
interface HouseholdWithStatus extends Household, Record<string, unknown> {
  status: 'occupied' | 'vacant' | 'maintenance';
  occupantName?: string;
  monthlyFee: number;
  roomNumber: string;
}
// #endregion

export default function HouseholdListPage() {
  // #region 상태 관리
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState<HouseholdType | ''>('');
  const [households, setHouseholds] = useState<HouseholdWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // #endregion

  // #region 데이터 로딩
  const loadHouseholds = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchHousehold({
        page: currentPage,
        limit: pageSize,
        householdType: selectedType || undefined,
        address1Depth: selectedFloor || undefined,
      });

      if (response.success && response.data) {
        // API 데이터를 UI 형식으로 변환
        const transformedData: HouseholdWithStatus[] = response.data.households.map((household: Household) => ({
          ...household,
          roomNumber: `${household.address1Depth} ${household.address2Depth}${household.address3Depth ? ' ' + household.address3Depth : ''}`,
          status: household.instances?.length ? 'occupied' : 'vacant' as 'occupied' | 'vacant' | 'maintenance',
          occupantName: household.instances?.[0]?.instanceName,
          monthlyFee: 0, // 관리비 정보는 별도 API에서 조회 필요
        }));
        
        setHouseholds(transformedData);
      } else {
        throw new Error(response.errorMsg || '데이터 로딩 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setHouseholds([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, selectedType, selectedFloor]);

  useEffect(() => {
    loadHouseholds();
  }, [loadHouseholds]);
  // #endregion

  // #region 필터링된 데이터 (클라이언트 사이드 필터링)
  const filteredData = households.filter((household) => {
    const matchesKeyword = household.roomNumber.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          (household.occupantName && household.occupantName.toLowerCase().includes(searchKeyword.toLowerCase()));
    const matchesStatus = !selectedStatus || household.status === selectedStatus;
    
    return matchesKeyword && matchesStatus;
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
          placeholder="호실번호 또는 입주자명 검색"
          value={searchKeyword}
          onChange={setSearchKeyword}
          showClearButton={true}
        />
      ),
      visible: true,
    },
    {
      key: 'floor',
      label: '동',
      element: (
        <Field
          type="select"
          placeholder="동 선택"
          value={selectedFloor}
          onChange={setSelectedFloor}
          options={[
            { value: '101동', label: '101동' },
            { value: '102동', label: '102동' },
            { value: '103동', label: '103동' },
            { value: '104동', label: '104동' },
          ]}
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
            { value: 'occupied', label: '입주중' },
            { value: 'vacant', label: '공실' },
            { value: 'maintenance', label: '수리중' },
          ]}
        />
      ),
      visible: true,
    },
    {
      key: 'type',
      label: '타입',
      element: (
        <Field
          type="select"
          placeholder="타입 선택"
          value={selectedType}
          onChange={(value) => setSelectedType(value as HouseholdType | '')}
          options={[
            { value: 'GENERAL', label: '일반' },
            { value: 'TEMP', label: '임시' },
            { value: 'COMMERCIAL', label: '상업' },
          ]}
        />
      ),
      visible: true,
    },
  ];
  // #endregion

  // #region 테이블 컬럼 설정
  const columns: BaseTableColumn<HouseholdWithStatus>[] = [
    {
      key: 'roomNumber',
      header: '호실번호',
      cell: (household: HouseholdWithStatus) => (
        <div className="font-medium">{household.roomNumber}</div>
      ),
    },
    {
      key: 'householdType',
      header: '타입',
      cell: (household: HouseholdWithStatus) => {
        const typeMap = {
          GENERAL: '일반',
          TEMP: '임시',
          COMMERCIAL: '상업',
        };
        return (
          <div className="text-center">{typeMap[household.householdType]}</div>
        );
      },
    },
    {
      key: 'status',
      header: '상태',
      cell: (household: HouseholdWithStatus) => {
        const statusMap: Record<HouseholdWithStatus['status'], { label: string; className: string }> = {
          occupied: { label: '입주중', className: 'bg-green-100 text-green-800' },
          vacant: { label: '공실', className: 'bg-yellow-100 text-yellow-800' },
          maintenance: { label: '수리중', className: 'bg-red-100 text-red-800' },
        };
        const status = statusMap[household.status];
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      key: 'occupantName',
      header: '입주자',
      cell: (household: HouseholdWithStatus) => (
        <div className="text-center">
          {household.occupantName || '-'}
        </div>
      ),
    },
    {
      key: 'monthlyFee',
      header: '월 관리비',
      cell: (household: HouseholdWithStatus) => (
        <div className="font-medium text-right">
          {household.monthlyFee.toLocaleString()}원
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: '등록일',
      cell: (household: HouseholdWithStatus) => (
        <div className="text-sm text-center">
          {new Date(household.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '작업',
      cell: (household: HouseholdWithStatus) => (
        <div className="flex gap-1 justify-center">
          <Link
            href={`/parking/household-management/household/${household.id}`}
            className="p-1 text-blue-600 rounded hover:bg-blue-50"
            title="상세보기"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <button
            onClick={() => handleDelete(household.id)}
            className="p-1 text-red-600 rounded hover:bg-red-50"
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
    loadHouseholds();
  };

  const handleReset = () => {
    setSearchKeyword('');
    setSelectedFloor('');
    setSelectedStatus('');
    setSelectedType('');
    setCurrentPage(1);
    loadHouseholds();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 호실을 삭제하시겠습니까?')) return;
    
    try {
      const response = await deleteHousehold(id);
      if (response.success) {
        alert('호실이 삭제되었습니다.');
        loadHouseholds();
      } else {
        throw new Error(response.errorMsg || '삭제 실패');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.');
    }
  };

  const handleRowClick = (household: HouseholdWithStatus) => {
    console.log('행 클릭:', household);
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
    <Link
      href="/parking/household-management/household/create"
      className="flex gap-2 items-center px-4 py-2 rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Plus className="w-4 h-4" />
      호실 등록
    </Link>
  );
  // #endregion

  // #region 에러 상태
  if (error) {
    return (
      <div className="p-6">
        <PageHeader
          title="호실 관리"
          subtitle="아파트 호실 정보를 관리합니다"
          rightActions={rightActions}
        />
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">오류가 발생했습니다: {error}</p>
          <button 
            onClick={loadHouseholds}
            className="px-4 py-2 mt-2 text-white bg-red-600 rounded hover:bg-red-700"
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
        title="호실 관리"
        subtitle="아파트 호실 정보를 관리합니다"
        rightActions={rightActions}
      />
      
      <div className="space-y-6">
        {/* 검색/필터 패널 */}
        <AdvancedSearch
          title="호실 검색"
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
          itemName="호실"
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