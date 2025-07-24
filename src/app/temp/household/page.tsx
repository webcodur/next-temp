'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';

// #region Mock Data & Types
interface Household extends Record<string, unknown> {
  id: number;
  address1Depth: string;
  address2Depth: string;
  address3Depth?: string;
  householdType: 'GENERAL' | 'TEMP' | 'COMMERCIAL';
  currentResident?: string;
  residentCount: number;
  createdAt: string;
  status: 'occupied' | 'vacant';
}

const mockHouseholds: Household[] = [
  {
    id: 1,
    address1Depth: '101동',
    address2Depth: '1104호',
    householdType: 'GENERAL',
    currentResident: '김철수네',
    residentCount: 4,
    createdAt: '2024-01-15',
    status: 'occupied'
  },
  {
    id: 2,
    address1Depth: '102동',
    address2Depth: '502호',
    householdType: 'GENERAL',
    currentResident: '이영희네',
    residentCount: 2,
    createdAt: '2024-02-01',
    status: 'occupied'
  },
  {
    id: 3,
    address1Depth: '101동',
    address2Depth: '803호',
    householdType: 'TEMP',
    residentCount: 0,
    createdAt: '2024-02-10',
    status: 'vacant'
  },
  {
    id: 4,
    address1Depth: '상가',
    address2Depth: '1층A호',
    householdType: 'COMMERCIAL',
    currentResident: '편의점',
    residentCount: 1,
    createdAt: '2024-01-01',
    status: 'occupied'
  }
];
// #endregion

// #region Search Filter Component
interface SearchFilters {
  householdType: string;
  address1depth: string;
  address2depth: string;
  status: string;
}
// #endregion

// #region Table Columns & Pagination
// PaginatedTable을 위한 컬럼 정의가 여기에 추가됨
// #endregion

// #region Main Component
export default function HouseholdListPage() {
  const [households, setHouseholds] = useState<Household[]>(mockHouseholds);
  const [filteredHouseholds, setFilteredHouseholds] = useState<Household[]>(mockHouseholds);
  const [filters, setFilters] = useState<SearchFilters>({
    householdType: '',
    address1depth: '',
    address2depth: '',
    status: ''
  });

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // #region 검색 필드 옵션
  const householdTypeOptions = [
    { value: '', label: '전체' },
    { value: 'GENERAL', label: '일반세대' },
    { value: 'TEMP', label: '임시세대' },
    { value: 'COMMERCIAL', label: '상업세대' }
  ];

  const statusOptions = [
    { value: '', label: '전체' },
    { value: 'occupied', label: '거주중' },
    { value: 'vacant', label: '공실' }
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
    },
    {
      key: 'status',
      label: '거주 상태',
      element: (
        <FieldSelect
          id="status"
          label="거주 상태"
          placeholder="거주 상태 선택"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
        />
      ),
      visible: true
    }
  ];

  // 테이블 컬럼 정의
  const columns: BaseTableColumn<Household>[] = [
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
      key: 'currentResident',
      header: '현재 거주',
      sortable: false,
      align: 'start',
      width: '150px',
      cell: (household) => household.currentResident || '-',
    },
    {
      key: 'residentCount',
      header: '거주자 수',
      sortable: true,
      align: 'center',
      width: '100px',
      cell: (household) => `${household.residentCount}명`,
    },
    {
      key: 'createdAt',
      header: '등록일',
      sortable: true,
      align: 'center',
      width: '120px',
    },
    {
      key: 'status',
      header: '상태',
      sortable: true,
      align: 'center',
      width: '100px',
      cell: (household) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          household.status === 'occupied' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {household.status === 'occupied' ? '거주중' : '공실'}
        </span>
      ),
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
            className="p-1 text-blue-600 rounded transition-colors hover:text-blue-900 hover:bg-blue-50"
            title="상세보기"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(household.id)}
            className="p-1 text-green-600 rounded transition-colors hover:text-green-900 hover:bg-green-50"
            title="수정"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(household.id)}
            className="p-1 text-red-600 rounded transition-colors hover:text-red-900 hover:bg-red-50"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];
  // #endregion

  // 필터링 로직
  useEffect(() => {
    let filtered = households;

    if (filters.householdType) {
      filtered = filtered.filter(h => h.householdType === filters.householdType);
    }
    if (filters.address1depth) {
      filtered = filtered.filter(h => h.address1Depth.includes(filters.address1depth));
    }
    if (filters.address2depth) {
      filtered = filtered.filter(h => h.address2Depth.includes(filters.address2depth));
    }
    if (filters.status) {
      filtered = filtered.filter(h => h.status === filters.status);
    }

    setFilteredHouseholds(filtered);
  }, [filters, households]);

  const handleView = (id: number) => {
    // 상세 페이지로 이동
    window.location.href = `/temp/household/${id}`;
  };

  const handleEdit = (id: number) => {
    // 수정 페이지로 이동
    window.location.href = `/temp/household/${id}/edit`;
  };

  const handleDelete = (id: number) => {
    if (confirm('정말로 이 세대를 삭제하시겠습니까?')) {
      setHouseholds(prev => prev.filter(h => h.id !== id));
    }
  };

  const handleExport = () => {
    alert('엑셀 파일로 내보내기 기능 (구현 예정)');
  };

  // 페이지네이션 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로
  };

  const handleRowClick = (household: Household, index: number) => {
    console.log('행 클릭됨:', household, '인덱스:', index);
    handleView(household.id);
  };

  const handleSearch = () => {
    // 검색 로직은 이미 useEffect에서 자동으로 처리됨
    console.log('검색 실행:', filters);
  };

  const handleReset = () => {
    setFilters({
      householdType: '',
      address1depth: '',
      address2depth: '',
      status: ''
    });
  };

  return (
    <div className="p-6 space-y-6 font-multilang animate-fadeIn">
      {/* 페이지 헤더 */}
      <div className="p-6 rounded-xl neu-flat">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">세대 관리</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              전체 {households.length}개 세대 중 {filteredHouseholds.length}개 표시
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
              href="/temp/household/create"
              className="flex gap-2 items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 text-primary-foreground bg-primary neu-raised-primary hover:animate-click-feedback"
            >
              <Plus className="w-4 h-4" />
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


    </div>
  );
}
// #endregion 