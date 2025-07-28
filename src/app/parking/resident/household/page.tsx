'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { searchHousehold } from '@/services/household/household$_GET';
import { deleteHousehold } from '@/services/household/household@id_DELETE';
import type { Household, SearchHouseholdRequest, HouseholdListResponse, HouseholdType } from '@/types/household';

// #region Extended Household Type for Table
interface HouseholdTableRow extends Household, Record<string, unknown> {}
// #endregion

// #region Search Filter Component
interface SearchFilters {
  householdType: string;
  address1depth: string;
  address2depth: string;
}
// #endregion

// #region Main Component
export default function HouseholdListPage() {
  const [filteredHouseholds, setFilteredHouseholds] = useState<HouseholdTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    householdType: '',
    address1depth: '',
    address2depth: ''
  });

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // #region 데이터 로드
  const loadHouseholds = async (params?: SearchHouseholdRequest) => {
    setLoading(true);
    try {
      const result = await searchHousehold(params);
      
      if (result.success && result.data) {
        const responseData = result.data as HouseholdListResponse;
        setFilteredHouseholds(responseData.data as HouseholdTableRow[]);
        setTotalCount(responseData.total);
      } else {
        console.error('세대 목록 조회 실패:', result.errorMsg);
        setFilteredHouseholds([]);
      }
    } catch (error) {
      console.error('세대 목록 조회 중 오류:', error);
      setFilteredHouseholds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHouseholds({
      page: currentPage,
      limit: pageSize
    });
  }, [currentPage, pageSize]);
  // #endregion

  // #region 검색 필드 옵션
  const householdTypeOptions = [
    { value: '', label: '전체' },
    { value: 'GENERAL', label: '일반세대' },
    { value: 'TEMP', label: '임시세대' },
    { value: 'COMMERCIAL', label: '상업세대' }
  ];

  // 검색 필드 구성
  const searchFields = [
    {
      key: 'householdType',
      label: '세대 유형',
      element: (
        <FieldSelect
          id="householdType"
          label="세대 유형"
          placeholder="세대 유형 선택"
          options={householdTypeOptions}
          value={filters.householdType}
          onChange={(value) => setFilters(prev => ({ ...prev, householdType: value }))}
        />
      ),
      visible: true
    },
    {
      key: 'address1depth',
      label: '동',
      element: (
        <FieldText
          id="address1depth"
          label="동"
          placeholder="예: 101동"
          value={filters.address1depth}
          onChange={(value) => setFilters(prev => ({ ...prev, address1depth: value }))}
          showSearchIcon={true}
        />
      ),
      visible: true
    },
    {
      key: 'address2depth',
      label: '호수',
      element: (
        <FieldText
          id="address2depth"
          label="호수"
          placeholder="예: 1104호"
          value={filters.address2depth}
          onChange={(value) => setFilters(prev => ({ ...prev, address2depth: value }))}
        />
      ),
      visible: true
    }
  ];

  // 테이블 컬럼 정의
  const columns: BaseTableColumn<HouseholdTableRow>[] = [
    {
      key: 'id',
      header: '세대 ID',
      sortable: true,
      align: 'center',
      width: '100px',
      cell: (household) => `#${household.id}`,
    },
    {
      key: 'address',
      header: '주소',
      sortable: false,
      align: 'start',
      width: '200px',
      cell: (household) => `${household.address1Depth} ${household.address2Depth}${household.address3Depth ? ` ${household.address3Depth}` : ''}`,
    },
    {
      key: 'householdType',
      header: '세대 유형',
      sortable: true,
      align: 'center',
      width: '120px',
      cell: (household) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          household.householdType === 'GENERAL' ? 'bg-blue-100 text-blue-800' :
          household.householdType === 'TEMP' ? 'bg-yellow-100 text-yellow-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {household.householdType === 'GENERAL' ? '일반' :
          household.householdType === 'TEMP' ? '임시' : '상업'}
        </span>
      ),
    },
    {
      key: 'instanceCount',
      header: '인스턴스 수',
      sortable: false,
      align: 'center',
      width: '100px',
      cell: (household) => `${household.instances?.length || 0}개`,
    },
    {
      key: 'createdAt',
      header: '등록일',
      sortable: true,
      align: 'center',
      width: '120px',
      cell: (household) => new Date(household.createdAt).toLocaleDateString('ko-KR'),
    },
    {
      key: 'actions',
      header: '액션',
      sortable: false,
      align: 'center',
      width: '120px',
      cell: (household) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleView(household.id)}
            className="p-2 rounded-lg text-muted-foreground neu-flat hover:text-foreground hover:neu-raised"
            title="상세보기"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(household.id)}
            className="p-2 rounded-lg text-muted-foreground neu-flat hover:text-foreground hover:neu-raised"
            title="수정"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(household.id)}
            className="p-2 rounded-lg text-muted-foreground neu-flat hover:text-foreground hover:neu-raised"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
  // #endregion

  // #region 핸들러
  const handleView = (id: number) => window.location.href = `/parking/household/${id}`;
  const handleEdit = (id: number) => window.location.href = `/parking/household/${id}/edit`;

  const handleDelete = async (id: number) => {
    if (confirm('정말로 이 세대를 삭제하시겠습니까?')) {
      try {
        const result = await deleteHousehold(id);
        if (result.success) {
          alert('세대가 성공적으로 삭제되었습니다.');
          loadHouseholds({
            page: currentPage,
            limit: pageSize
          });
        } else {
          alert(`세대 삭제 실패: ${result.errorMsg}`);
        }
      } catch (error) {
        console.error('세대 삭제 중 오류:', error);
        alert('세대 삭제 중 오류가 발생했습니다.');
      }
    }
  };
  
  const handleExport = () => alert('엑셀 파일로 내보내기 기능 (구현 예정)');
  
  // 페이지네이션 핸들러
  const handlePageChange = (page: number) => setCurrentPage(page);

  // 페이지 크기 변경 시 첫 페이지로
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); 
  };

  const handleRowClick = (household: HouseholdTableRow, index: number) => {
    console.log('행 클릭됨:', household, '인덱스:', index);
    handleView(household.id);
  };

  const handleSearch = () => {
    const searchParams: SearchHouseholdRequest = {
      page: 1,
      limit: pageSize
    };

    if (filters.householdType) {
      searchParams.householdType = filters.householdType as HouseholdType;
    }
    if (filters.address1depth) {
      searchParams.address1Depth = filters.address1depth;
    }
    if (filters.address2depth) {
      searchParams.address2Depth = filters.address2depth;
    }

    setCurrentPage(1);
    loadHouseholds(searchParams);
  };

  const handleReset = () => {
    setFilters({
      householdType: '',
      address1depth: '',
      address2depth: ''
    });
    setCurrentPage(1);
    loadHouseholds({
      page: 1,
      limit: pageSize
    });
  };
  // #endregion

  return (
    <div className="p-6 space-y-6 font-multilang animate-fadeIn">
      {/* 페이지 헤더 */}
      <div className="p-6 rounded-xl neu-flat">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">세대 관리</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {loading ? '로딩 중...' : `전체 ${totalCount}개 세대`}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 neu-raised hover:animate-click-feedback"
            >
              <Download className="w-4 h-4" />
              엑셀 다운로드
            </button>
            <Link
              href="/parking/household/create"
              className="flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 text-primary-foreground bg-primary neu-raised-primary hover:animate-click-feedback"
            >
              <Plus className="w-4 h-4 text-primary-foreground" />
              새 세대 등록
            </Link>
          </div>
        </div>
      </div>

      {/* 검색 필터 */}
      <AdvancedSearch
        title="세대 검색"
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        defaultOpen={true}
      />

      {/* 테이블 */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-muted-foreground">로딩 중...</div>
        </div>
      ) : (
        <PaginatedTable
          data={filteredHouseholds}
          columns={columns}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[5, 10, 20, 50]}
          itemName="세대"
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
}
// #endregion 