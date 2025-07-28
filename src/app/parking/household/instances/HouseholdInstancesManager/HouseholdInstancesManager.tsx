/* 
  파일명: /app/parking/household/instances/HouseholdInstancesManager/HouseholdInstancesManager.tsx
  기능: 거주 이력 관리의 핵심 비즈니스 로직과 상태 관리
  책임: 데이터 필터링, 검색, 테이블 렌더링을 조율한다.
*/ // ------------------------------

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Users, Plus } from 'lucide-react';

import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import { PaginatedTable } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';

import { searchHouseholdInstance } from '@/services/household/household_instance$_GET';
import { deleteHouseholdInstance } from '@/services/household/household_instance@instanceId_DELETE';
import type { HouseholdInstance, SearchHouseholdInstanceRequest, HouseholdInstanceListResponse } from '@/types/household';
import { useInstanceOperations } from './useInstanceOperations';
import { createColumns } from './InstanceTable/columns';

// #region Extended Types for Table
interface HouseholdInstanceTableRow extends HouseholdInstance, Record<string, unknown> {}

interface SearchFilters {
  household_id: string;
  instance_name: string;
  date_range: string;
}
// #endregion

// #region 컴포넌트
export function HouseholdInstancesManager() {
  // #region 상태
  const [instances, setInstances] = useState<HouseholdInstanceTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    household_id: '',
    instance_name: '',
    date_range: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  // #endregion

  // #region 데이터 로드
  const loadInstances = async (params?: SearchHouseholdInstanceRequest) => {
    setLoading(true);
    try {
      const result = await searchHouseholdInstance(params);
      
      if (result.success && result.data) {
        const responseData = result.data as HouseholdInstanceListResponse;
        setInstances(responseData.data as HouseholdInstanceTableRow[]);
        setTotalCount(responseData.total);
      } else {
        console.error('세대 인스턴스 조회 실패:', result.errorMsg);
        setInstances([]);
      }
    } catch (error) {
      console.error('세대 인스턴스 조회 중 오류:', error);
      setInstances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstances({
      page: currentPage,
      limit: pageSize
    });
  }, [currentPage, pageSize]);
  // #endregion

  // #region 훅
  const { 
    handleView, 
    handleEdit, 
    handleSettings 
  } = useInstanceOperations();

  const handleDelete = async (id: number) => {
    if (confirm('정말로 이 거주 기록을 삭제하시겠습니까?')) {
      try {
        const result = await deleteHouseholdInstance(id);
        if (result.success) {
          alert('거주 기록이 성공적으로 삭제되었습니다.');
          loadInstances({
            page: currentPage,
            limit: pageSize
          });
        } else {
          alert(`삭제 실패: ${result.errorMsg}`);
        }
      } catch (error) {
        console.error('삭제 중 오류:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleRowClick = (instance: HouseholdInstanceTableRow, index: number) => {
    console.log('행 클릭됨:', instance, '인덱스:', index);
    handleView(instance.id);
  };
  // #endregion

  // #region 상수
  const dateRangeOptions = [
    { value: '', label: '전체' },
    { value: 'this_month', label: '이번 달' },
    { value: 'last_month', label: '지난 달' },
    { value: 'this_year', label: '올해' }
  ];

  // 검색 필드 구성
  const searchFields = [
    {
      key: 'household_id',
      label: '세대 ID',
      element: (
        <FieldText
          id="household_id"
          label="세대 ID"
          placeholder="예: 1"
          value={filters.household_id}
          onChange={(value) => setFilters(prev => ({ ...prev, household_id: value }))}
          showSearchIcon={true}
        />
      ),
      visible: true
    },
    {
      key: 'instance_name',
      label: '인스턴스명',
      element: (
        <FieldText
          id="instance_name"
          label="인스턴스명"
          placeholder="예: 김철수네"
          value={filters.instance_name}
          onChange={(value) => setFilters(prev => ({ ...prev, instance_name: value }))}
        />
      ),
      visible: true
    },
    {
      key: 'date_range',
      label: '시작 시기',
      element: (
        <FieldSelect
          id="date_range"
          label="시작 시기"
          placeholder="시작 시기 선택"
          options={dateRangeOptions}
          value={filters.date_range}
          onChange={(value) => setFilters(prev => ({ ...prev, date_range: value }))}
        />
      ),
      visible: true
    }
  ];

  // 테이블 컬럼 생성
  const columns = createColumns({
    onView: handleView,
    onSettings: handleSettings,
    onEdit: handleEdit,
    onDelete: handleDelete
  });
  // #endregion

  // #region 핸들러
  const handleSearch = () => {
    const searchParams: SearchHouseholdInstanceRequest = {
      page: 1,
      limit: pageSize
    };

    if (filters.household_id) {
      searchParams.householdId = parseInt(filters.household_id) || undefined;
    }
    if (filters.instance_name) {
      searchParams.instanceName = filters.instance_name;
    }

    setCurrentPage(1);
    loadInstances(searchParams);
  };

  const handleReset = () => {
    setFilters({
      household_id: '',
      instance_name: '',
      date_range: ''
    });
    setCurrentPage(1);
    loadInstances({
      page: 1,
      limit: pageSize
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  // #endregion

  // #region 렌더링
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="p-6 rounded-xl neu-flat">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">거주 이력 관리</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {loading ? '로딩 중...' : `전체 ${totalCount}개 기록`}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/parking/household"
              className="flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 text-primary-foreground bg-primary neu-raised-primary hover:animate-click-feedback"
            >
              <Plus className="w-4 h-4" />
              세대 관리로 이동
            </Link>
          </div>
        </div>
      </div>

      {/* 검색 필터 */}
      <AdvancedSearch
        title="거주 이력 검색"
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        statusText={loading ? '로딩 중...' : `전체 ${totalCount}개 기록`}
        defaultOpen={true}
      />

      {/* 테이블뷰 */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-muted-foreground">로딩 중...</div>
        </div>
      ) : (
        <PaginatedTable
          data={instances}
          columns={columns}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[5, 10, 20, 50]}
          itemName="거주 기록"
          onRowClick={handleRowClick}
        />
      )}

      {/* 검색 결과 없음 */}
      {!loading && instances.length === 0 && (
        <div className="py-12 text-center rounded-xl neu-flat">
          <Users className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium text-foreground">검색 결과가 없습니다</h3>
          <p className="text-muted-foreground">검색 조건을 변경해서 다시 시도해보세요.</p>
        </div>
      )}
    </div>
  );
  // #endregion
}
// #endregion 