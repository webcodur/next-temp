'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Settings, Eye, Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';

// #region Mock Data & Types
interface HouseholdInstance extends Record<string, unknown> {
  id: number;
  household_id: number;
  household_address: string;
  instance_name: string;
  password: string;
  start_date: string;
  end_date?: string;
  resident_count: number;
  status: 'active' | 'moved_out';
  created_at: string;
  service_settings: {
    temp_access: boolean;
    common_entrance: boolean;
    temp_car_limit: number;
  };
}

const mockInstances: HouseholdInstance[] = [
  {
    id: 1,
    household_id: 1,
    household_address: '101동 1104호',
    instance_name: '김철수네',
    password: '1234',
    start_date: '2024-01-15',
    resident_count: 4,
    status: 'active',
    created_at: '2024-01-15',
    service_settings: {
      temp_access: true,
      common_entrance: true,
      temp_car_limit: 2
    }
  },
  {
    id: 2,
    household_id: 2,
    household_address: '102동 502호',
    instance_name: '이영희네',
    password: '5678',
    start_date: '2024-02-01',
    resident_count: 2,
    status: 'active',
    created_at: '2024-02-01',
    service_settings: {
      temp_access: false,
      common_entrance: true,
      temp_car_limit: 1
    }
  },
  {
    id: 3,
    household_id: 1,
    household_address: '101동 1104호',
    instance_name: '박민수네',
    password: '9999',
    start_date: '2023-03-01',
    end_date: '2024-01-10',
    resident_count: 3,
    status: 'moved_out',
    created_at: '2023-03-01',
    service_settings: {
      temp_access: false,
      common_entrance: false,
      temp_car_limit: 0
    }
  },
  {
    id: 4,
    household_id: 3,
    household_address: '101동 803호',
    instance_name: '최영수네',
    password: '1111',
    start_date: '2023-12-01',
    end_date: '2024-02-05',
    resident_count: 1,
    status: 'moved_out',
    created_at: '2023-12-01',
    service_settings: {
      temp_access: true,
      common_entrance: false,
      temp_car_limit: 1
    }
  }
];
// #endregion

// #region Search Filter Component
interface SearchFilters {
  household_id: string;
  instance_name: string;
  status: string;
  date_range: string;
}

// SearchFilter가 AdvancedSearch + Field 컴포넌트로 교체됨
// #endregion

// #region Instance Card Component
function InstanceCard({ 
  instance, 
  onView, 
  onEdit, 
  onDelete, 
  onSettings 
}: { 
  instance: HouseholdInstance;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onSettings: (id: number) => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return months > 0 ? `${months}개월 ${days}일` : `${days}일`;
  };

  return (
    <div className="neu-elevated p-4 rounded-xl transition-all duration-200 hover:animate-fadeIn">
      {/* 카드 헤더 */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2 items-center">
          <h3 className="text-lg font-semibold text-foreground">{instance.instance_name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            instance.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
          }`}>
            {instance.status === 'active' ? '거주중' : '이사완료'}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onView(instance.id)}
            className="neu-raised p-2 rounded-lg transition-all duration-200 hover:animate-click-feedback"
            title="상세보기"
          >
            <Eye className="w-4 h-4 text-primary" />
          </button>
          <button
            onClick={() => onSettings(instance.id)}
            className="neu-raised p-2 rounded-lg transition-all duration-200 hover:animate-click-feedback"
            title="설정"
          >
            <Settings className="w-4 h-4 text-accent" />
          </button>
          <button
            onClick={() => onEdit(instance.id)}
            className="neu-raised p-2 rounded-lg transition-all duration-200 hover:animate-click-feedback"
            title="수정"
          >
            <Edit className="w-4 h-4 text-success" />
          </button>
          <button
            onClick={() => onDelete(instance.id)}
            className="neu-raised p-2 rounded-lg transition-all duration-200 hover:animate-click-feedback"
            title="삭제"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="mb-4 space-y-2">
        <div className="flex gap-2 items-center text-sm text-muted-foreground">
          <span className="font-medium text-foreground">주소:</span>
          <span>{instance.household_address}</span>
        </div>
        <div className="flex gap-2 items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            {formatDate(instance.start_date)} ~ {instance.end_date ? formatDate(instance.end_date) : '현재'}
            <span className="ml-2 text-primary">({getDuration(instance.start_date, instance.end_date)})</span>
          </span>
        </div>
        <div className="flex gap-2 items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>거주자 {instance.resident_count}명</span>
          <span className="mx-2">•</span>
          <span>비밀번호: <span className="text-foreground font-medium">{instance.password}</span></span>
        </div>
      </div>

      {/* 서비스 설정 */}
      <div className="pt-3 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {instance.service_settings.temp_access && (
            <span className="px-2 py-1 text-xs text-primary-foreground bg-primary rounded-lg">임시접근</span>
          )}
          {instance.service_settings.common_entrance && (
            <span className="px-2 py-1 text-xs text-success-foreground bg-success rounded-lg">공동현관</span>
          )}
          {instance.service_settings.temp_car_limit > 0 && (
            <span className="px-2 py-1 text-xs text-warning-foreground bg-warning rounded-lg">
              임시차량 {instance.service_settings.temp_car_limit}대
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
// #endregion

// #region Main Component
export default function HouseholdInstancesPage() {
  const [instances, setInstances] = useState<HouseholdInstance[]>(mockInstances);
  const [filteredInstances, setFilteredInstances] = useState<HouseholdInstance[]>(mockInstances);
  const [filters, setFilters] = useState<SearchFilters>({
    household_id: '',
    instance_name: '',
    status: '',
    date_range: ''
  });

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 뷰 모드 상태 (카드뷰 vs 테이블뷰)
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // #region 검색 필드 옵션
  const statusOptions = [
    { value: '', label: '전체' },
    { value: 'active', label: '현재 거주' },
    { value: 'moved_out', label: '이사 완료' }
  ];

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
      label: '가족명',
      element: (
        <FieldText
          id="instance_name"
          label="가족명"
          placeholder="예: 김철수네"
          value={filters.instance_name}
          onChange={(value) => setFilters(prev => ({ ...prev, instance_name: value }))}
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
    },
    {
      key: 'date_range',
      label: '입주 시기',
      element: (
        <FieldSelect
          id="date_range"
          label="입주 시기"
          placeholder="입주 시기 선택"
          options={dateRangeOptions}
          value={filters.date_range}
          onChange={(value) => setFilters(prev => ({ ...prev, date_range: value }))}
        />
      ),
      visible: true
    }
  ];

  // 테이블 컬럼 정의
  const columns: BaseTableColumn<HouseholdInstance>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      align: 'center',
      width: '80px',
      cell: (instance) => `#${instance.id}`,
    },
    {
      key: 'instance_name',
      header: '가족명',
      sortable: true,
      align: 'start',
      width: '120px',
    },
    {
      key: 'household_address',
      header: '주소',
      sortable: false,
      align: 'start',
      width: '150px',
    },
    {
      key: 'status',
      header: '거주 상태',
      sortable: true,
      align: 'center',
      width: '100px',
      cell: (instance) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          instance.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {instance.status === 'active' ? '거주중' : '이사완료'}
        </span>
      ),
    },
    {
      key: 'resident_count',
      header: '거주자 수',
      sortable: true,
      align: 'center',
      width: '100px',
      cell: (instance) => `${instance.resident_count}명`,
    },
    {
      key: 'start_date',
      header: '입주일',
      sortable: true,
      align: 'center',
      width: '100px',
      cell: (instance) => new Date(instance.start_date).toLocaleDateString('ko-KR'),
    },
    {
      key: 'duration',
      header: '거주 기간',
      sortable: false,
      align: 'center',
      width: '120px',
      cell: (instance) => {
        const start = new Date(instance.start_date);
        const end = instance.end_date ? new Date(instance.end_date) : new Date();
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        const days = diffDays % 30;
        return months > 0 ? `${months}개월 ${days}일` : `${days}일`;
      },
    },
    {
      key: 'password',
      header: '비밀번호',
      sortable: false,
      align: 'center',
      width: '100px',
    },
    {
      key: 'actions',
      header: '액션',
      sortable: false,
      align: 'center',
      width: '140px',
      cell: (instance) => (
        <div className="flex gap-1 justify-center">
          <button
            onClick={() => handleView(instance.id)}
            className="p-1 text-blue-600 rounded transition-colors hover:bg-blue-50"
            title="상세보기"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleSettings(instance.id)}
            className="p-1 text-purple-600 rounded transition-colors hover:bg-purple-50"
            title="설정"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(instance.id)}
            className="p-1 text-green-600 rounded transition-colors hover:bg-green-50"
            title="수정"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(instance.id)}
            className="p-1 text-red-600 rounded transition-colors hover:bg-red-50"
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
    let filtered = instances;

    if (filters.household_id) {
      filtered = filtered.filter(i => i.household_id.toString().includes(filters.household_id));
    }
    if (filters.instance_name) {
      filtered = filtered.filter(i => i.instance_name.toLowerCase().includes(filters.instance_name.toLowerCase()));
    }
    if (filters.status) {
      filtered = filtered.filter(i => i.status === filters.status);
    }
    if (filters.date_range) {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisYear = new Date(now.getFullYear(), 0, 1);

      filtered = filtered.filter(i => {
        const startDate = new Date(i.start_date);
        switch (filters.date_range) {
          case 'this_month':
            return startDate >= thisMonth;
          case 'last_month':
            return startDate >= lastMonth && startDate < thisMonth;
          case 'this_year':
            return startDate >= thisYear;
          default:
            return true;
        }
      });
    }

    setFilteredInstances(filtered);
  }, [filters, instances]);

  const handleView = (id: number) => {
    window.location.href = `/temp/household/instances/${id}`;
  };

  const handleEdit = (id: number) => {
    window.location.href = `/temp/household/instances/${id}/edit`;
  };

  const handleDelete = (id: number) => {
    if (confirm('정말로 이 거주 기록을 삭제하시겠습니까?')) {
      setInstances(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleSettings = (id: number) => {
    window.location.href = `/temp/household/instances/${id}/settings`;
  };

  const handleSearch = () => {
    // 검색 로직은 이미 useEffect에서 자동으로 처리됨
    console.log('검색 실행:', filters);
  };

  const handleReset = () => {
    setFilters({
      household_id: '',
      instance_name: '',
      status: '',
      date_range: ''
    });
  };

  // 페이지네이션 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleRowClick = (instance: HouseholdInstance, index: number) => {
    console.log('행 클릭됨:', instance, '인덱스:', index);
    handleView(instance.id);
  };

  const activeInstances = filteredInstances.filter(i => i.status === 'active');
  const movedOutInstances = filteredInstances.filter(i => i.status === 'moved_out');

  return (
    <div className="p-6 space-y-6 font-multilang animate-fadeIn">
      {/* 페이지 헤더 */}
      <div className="neu-flat p-6 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">거주 이력 관리</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              전체 {instances.length}개 기록 중 {filteredInstances.length}개 표시 
              (현재 거주: {activeInstances.length}개, 이사 완료: {movedOutInstances.length}개)
            </p>
          </div>
          <div className="flex gap-3">
            {/* 뷰 모드 토글 */}
            <div className="flex neu-flat rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  viewMode === 'card' 
                    ? 'bg-primary text-primary-foreground neu-inset' 
                    : 'neu-raised hover:animate-click-feedback'
                }`}
              >
                카드뷰
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table' 
                    ? 'bg-primary text-primary-foreground neu-inset' 
                    : 'neu-raised hover:animate-click-feedback'
                }`}
              >
                테이블뷰
              </button>
            </div>
          
            <Link
              href="/temp/household"
              className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary neu-raised-primary rounded-xl transition-all duration-200 hover:animate-click-feedback"
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
        statusText={`전체 ${instances.length}개 기록 중 ${filteredInstances.length}개 표시`}
        defaultOpen={true}
      />

      {/* 조건부 렌더링: 카드뷰 vs 테이블뷰 */}
      {viewMode === 'card' ? (
        <>
          {/* 현재 거주중인 가족들 */}
          {activeInstances.length > 0 && (
            <div className="mb-8">
              <h2 className="flex gap-2 items-center mb-4 text-lg font-semibold text-foreground">
                <Users className="w-5 h-5 text-success" />
                현재 거주중 ({activeInstances.length}개)
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeInstances.map((instance) => (
                  <InstanceCard
                    key={instance.id}
                    instance={instance}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSettings={handleSettings}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 이사한 가족들 */}
          {movedOutInstances.length > 0 && (
            <div>
              <h2 className="flex gap-2 items-center mb-4 text-lg font-semibold text-foreground">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                이사 완료 ({movedOutInstances.length}개)
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {movedOutInstances.map((instance) => (
                  <InstanceCard
                    key={instance.id}
                    instance={instance}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSettings={handleSettings}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* 테이블뷰 */
        <PaginatedTable
          data={filteredInstances}
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
      {filteredInstances.length === 0 && (
        <div className="neu-flat py-12 rounded-xl text-center">
          <Users className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium text-foreground">검색 결과가 없습니다</h3>
          <p className="text-muted-foreground">검색 조건을 변경해서 다시 시도해보세요.</p>
        </div>
      )}
    </div>
  );
}
// #endregion 