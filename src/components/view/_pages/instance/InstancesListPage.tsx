/* 메뉴 설명: 인스턴스 관리 목록 페이지 */
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
// Plus, Trash2 아이콘은 CrudButton에서 처리
import { useRouter } from 'next/navigation';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';

// API 호출
import { searchInstances } from '@/services/instances/instances$_GET';
import { deleteInstance } from '@/services/instances/instances@id_DELETE';

// 타입 정의
import { Instance, InstanceType } from '@/types/instance';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 검색 필터 인터페이스
interface SearchFilters {
  address1Depth: string;
  address2Depth: string;
  instanceType: string;
  instanceName: string;
}
// #endregion

export default function InstancesListPage() {
  const router = useRouter();
  
  // #region 상태 관리
  const [instanceList, setInstanceList] = useState<Instance[]>([]);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    address1Depth: '',
    address2Depth: '',
    instanceType: '',
    instanceName: '',
  });
  
  // 다이얼로그 관련 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 인스턴스 타입 옵션
  const instanceTypeOptions: Option[] = useMemo(() => [
    { value: 'GENERAL', label: '일반' },
    { value: 'TEMP', label: '임시' },
    { value: 'COMMERCIAL', label: '상업' },
  ], []);
  // #endregion

  // #region 데이터 로드
  const loadInstanceData = useCallback(async (filters?: Partial<SearchFilters>) => {
    try {
      const searchParams = {
        page: 1,
        limit: 100,
        ...(filters?.address1Depth && { address1Depth: filters.address1Depth }),
        ...(filters?.address2Depth && { address2Depth: filters.address2Depth }),
        ...(filters?.instanceType && { instanceType: filters.instanceType as InstanceType }),
        ...(filters?.instanceName && { instanceName: filters.instanceName }),
      };

      const result = await searchInstances(searchParams);
      
      if (result.success) {
        setInstanceList(result.data?.data || []);
      } else {
        console.error('인스턴스 목록 로드 실패:', result.errorMsg);
        setInstanceList([]);
      }
    } catch (error) {
      console.error('인스턴스 목록 로드 중 오류:', error);
      setInstanceList([]);
    }
  }, []);

  useEffect(() => {
    loadInstanceData();
  }, [loadInstanceData]);
  // #endregion

  // #region 검색 관련 핸들러
  const handleSearch = useCallback(() => {
    const activeFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key as keyof SearchFilters] = value.trim();
      }
      return acc;
    }, {} as Partial<SearchFilters>);

    loadInstanceData(activeFilters);
  }, [searchFilters, loadInstanceData]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      address1Depth: '',
      address2Depth: '',
      instanceType: '',
      instanceName: '',
    };
    setSearchFilters(resetFilters);
    loadInstanceData({});
  }, [loadInstanceData]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  // #endregion

  // #region 이벤트 핸들러
  const handleCreateClick = useCallback(() => {
    router.push('/parking/occupancy/instance/create');
  }, [router]);

  const handleRowClick = useCallback((instance: Instance, _index: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    router.push(`/parking/occupancy/instance/${instance.id}`);
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleDeleteClick = useCallback((id: number) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteInstance(deleteTargetId);
      
      if (result.success) {
        setInstanceList((prev) => prev.filter((instance) => instance.id !== deleteTargetId));
        setDialogMessage('호실이 성공적으로 삭제되었습니다.');
        setSuccessDialogOpen(true);
      } else {
        setDialogMessage(`호실 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('인스턴스 삭제 중 오류:', error);
      setDialogMessage('호실 삭제 중 오류가 발생했습니다.');
      setErrorDialogOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  }, [deleteTargetId]);
  // #endregion

  // #region 검색 필드 구성
  const searchFields = useMemo(() => [
    {
      key: 'address1Depth',
      label: '주소 1단계 검색',
      element: (
        <FieldText
          id="search-address1"
          label="주소 1단계"
          placeholder="시/도를 입력하세요"
          value={searchFilters.address1Depth}
          onChange={(value) => updateFilter('address1Depth', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'address2Depth',
      label: '주소 2단계 검색',
      element: (
        <FieldText
          id="search-address2"
          label="주소 2단계"
          placeholder="시/군/구를 입력하세요"
          value={searchFilters.address2Depth}
          onChange={(value) => updateFilter('address2Depth', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'instanceType',
      label: '호실 타입 검색',
      element: (
        <FieldSelect
          id="search-type"
          label="호실 타입"
          placeholder="타입을 선택하세요"
          options={instanceTypeOptions}
          value={searchFilters.instanceType}
          onChange={(value) => updateFilter('instanceType', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'instanceName',
      label: '호실명 검색',
      element: (
        <FieldText
          id="search-name"
          label="호실명"
          placeholder="호실명을 입력하세요"
          value={searchFilters.instanceName}
          onChange={(value) => updateFilter('instanceName', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
  ], [searchFilters, instanceTypeOptions, updateFilter, handleKeyDown]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<Instance>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '6%',
      align: 'center',
    },
    {
      key: 'address1Depth',
      header: '주소 1단계',
      align: 'start',
      width: '12%',
    },
    {
      key: 'address2Depth',
      header: '주소 2단계',
      align: 'start',
      width: '12%',
    },
    {
      key: 'address3Depth',
      header: '주소 3단계',
      align: 'start',
      width: '15%',
      cell: (item: Instance) => item.address3Depth || '-',
    },
    {
      key: 'instanceType',
      header: '타입',
      align: 'center',
      width: '8%',
      cell: (item: Instance) => {
        const typeMap = {
          GENERAL: '일반',
          TEMP: '임시',
          COMMERCIAL: '상업',
        };
        return typeMap[item.instanceType] || item.instanceType;
      },
    },
    {
      key: 'parkinglotId',
      header: '주차장 ID',
      align: 'center',
      width: '10%',
    },
    {
      key: 'memo',
      header: '메모',
      align: 'start',
      width: '15%',
      cell: (item: Instance) => item.memo || '-',
    },
    {
      key: 'createdAt',
      header: '등록일자',
      align: 'center',
      width: '12%',
      cell: (item: Instance) => {
        const date = new Date(item.createdAt);
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      },
    },
    {
      header: '관리',
      align: 'center',
      width: '10%',
      cell: (item: Instance) => (
        <div className="flex gap-1 justify-center">
          <CrudButton
            action="delete"
            iconOnly
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item.id);
            }}
            title="호실 삭제"
          />
        </div>
      ),
    },
  ];
  // #endregion

  // #region 렌더링
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="호실 관리" 
        subtitle="호실 등록, 수정, 삭제 및 설정 관리"
        rightActions={
          <CrudButton
            action="create"
            size="default"
            onClick={handleCreateClick}
            title="호실 추가"
          >
            추가
          </CrudButton>
        }
      />

      {/* 고급 검색 */}
      <AdvancedSearch
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        defaultOpen={false}
      />
      
      {/* 테이블 */}
      <PaginatedTable
        data={instanceList as unknown as Record<string, unknown>[]}
        columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
        onRowClick={handleRowClick as unknown as (item: Record<string, unknown>, index: number) => void}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName="호실"
        minWidth="1000px"
      />

      {/* 삭제 확인 다이얼로그 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="호실 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 호실 정보가 영구적으로 삭제됩니다.
            </p>
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="ghost" 
              onClick={() => setDeleteConfirmOpen(false)}
            >
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>

      {/* 성공 다이얼로그 */}
      <Modal
        isOpen={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        title="작업 완료"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-green-600">성공</h3>
            <p className="text-muted-foreground">{dialogMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setSuccessDialogOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>

      {/* 오류 다이얼로그 */}
      <Modal
        isOpen={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        title="오류 발생"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="mb-2 text-lg font-semibold text-red-600">오류</h3>
            <p className="text-muted-foreground">{dialogMessage}</p>
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => setErrorDialogOpen(false)}>
              확인
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
  // #endregion
}
