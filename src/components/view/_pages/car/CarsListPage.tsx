/* 메뉴 설명: 차량 관리 목록 페이지 */
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
import { searchCars } from '@/services/cars/cars$_GET';
import { deleteCar } from '@/services/cars/cars@id_DELETE';

// 타입 정의
import { CarWithInstance } from '@/types/car';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 검색 필터 인터페이스
interface SearchFilters {
  carNumber: string;
  brand: string;
  model: string;
  type: string;
  fuel: string;
  yearFrom: string;
  yearTo: string;
}
// #endregion

export default function CarsListPage() {
  const router = useRouter();
  
  // #region 상태 관리
  const [carList, setCarList] = useState<CarWithInstance[]>([]);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    carNumber: '',
    brand: '',
    model: '',
    type: '',
    fuel: '',
    yearFrom: '',
    yearTo: '',
  });
  
  // 다이얼로그 관련 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 차량 타입 및 연료 옵션
  const carTypeOptions: Option[] = useMemo(() => [
    { value: 'SEDAN', label: '세단' },
    { value: 'SUV', label: 'SUV' },
    { value: 'HATCHBACK', label: '해치백' },
    { value: 'COUPE', label: '쿠페' },
    { value: 'CONVERTIBLE', label: '컨버터블' },
    { value: 'TRUCK', label: '트럭' },
    { value: 'VAN', label: '밴' },
    { value: 'OTHER', label: '기타' },
  ], []);

  const fuelOptions: Option[] = useMemo(() => [
    { value: 'GASOLINE', label: '휘발유' },
    { value: 'DIESEL', label: '경유' },
    { value: 'HYBRID', label: '하이브리드' },
    { value: 'ELECTRIC', label: '전기' },
    { value: 'LPG', label: 'LPG' },
    { value: 'OTHER', label: '기타' },
  ], []);
  // #endregion

  // #region 데이터 로드
  const loadCarData = useCallback(async (filters?: Partial<SearchFilters>) => {
    try {
      const searchParams = {
        page: 1,
        limit: 100,
        ...(filters?.carNumber && { carNumber: filters.carNumber }),
        ...(filters?.brand && { brand: filters.brand }),
        ...(filters?.model && { model: filters.model }),
        ...(filters?.type && { type: filters.type }),
        ...(filters?.fuel && { fuel: filters.fuel }),
        ...(filters?.yearFrom && { yearFrom: filters.yearFrom }),
        ...(filters?.yearTo && { yearTo: filters.yearTo }),
      };

      const result = await searchCars(searchParams);
      
      if (result.success) {
        setCarList(result.data?.data || []);
      } else {
        console.error('차량 목록 로드 실패:', result.errorMsg);
        setCarList([]);
      }
    } catch (error) {
      console.error('차량 목록 로드 중 오류:', error);
      setCarList([]);
    }
  }, []);

  useEffect(() => {
    loadCarData();
  }, [loadCarData]);
  // #endregion

  // #region 검색 관련 핸들러
  const handleSearch = useCallback(() => {
    const activeFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key as keyof SearchFilters] = value.trim();
      }
      return acc;
    }, {} as Partial<SearchFilters>);

    loadCarData(activeFilters);
  }, [searchFilters, loadCarData]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      carNumber: '',
      brand: '',
      model: '',
      type: '',
      fuel: '',
      yearFrom: '',
      yearTo: '',
    };
    setSearchFilters(resetFilters);
    loadCarData({});
  }, [loadCarData]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  // #endregion

  // #region 이벤트 핸들러
  const handleCreateClick = useCallback(() => {
    router.push('/parking/occupancy/car/create');
  }, [router]);

  const handleRowClick = useCallback((car: CarWithInstance, _index: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    router.push(`/parking/occupancy/car/${car.id}`);
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
      const result = await deleteCar(deleteTargetId);
      
      if (result.success) {
        setCarList((prev) => prev.filter((car) => car.id !== deleteTargetId));
        setDialogMessage('차량이 성공적으로 삭제되었습니다.');
        setSuccessDialogOpen(true);
      } else {
        setDialogMessage(`차량 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('차량 삭제 중 오류:', error);
      setDialogMessage('차량 삭제 중 오류가 발생했습니다.');
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
      key: 'carNumber',
      label: '차량번호 검색',
      element: (
        <FieldText
          id="search-car-number"
          label="차량번호"
          placeholder="차량번호를 입력하세요"
          value={searchFilters.carNumber}
          onChange={(value) => updateFilter('carNumber', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'brand',
      label: '브랜드 검색',
      element: (
        <FieldText
          id="search-brand"
          label="브랜드"
          placeholder="브랜드를 입력하세요"
          value={searchFilters.brand}
          onChange={(value) => updateFilter('brand', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'model',
      label: '모델 검색',
      element: (
        <FieldText
          id="search-model"
          label="모델"
          placeholder="모델을 입력하세요"
          value={searchFilters.model}
          onChange={(value) => updateFilter('model', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'type',
      label: '차종 검색',
      element: (
        <FieldSelect
          id="search-type"
          label="차종"
          placeholder="차종을 선택하세요"
          options={carTypeOptions}
          value={searchFilters.type}
          onChange={(value) => updateFilter('type', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'fuel',
      label: '연료 검색',
      element: (
        <FieldSelect
          id="search-fuel"
          label="연료"
          placeholder="연료를 선택하세요"
          options={fuelOptions}
          value={searchFilters.fuel}
          onChange={(value) => updateFilter('fuel', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'yearFrom',
      label: '연식 시작',
      element: (
        <FieldText
          id="search-year-from"
          label="연식 시작"
          placeholder="2020"
          value={searchFilters.yearFrom}
          onChange={(value) => updateFilter('yearFrom', value)}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'yearTo',
      label: '연식 끝',
      element: (
        <FieldText
          id="search-year-to"
          label="연식 끝"
          placeholder="2024"
          value={searchFilters.yearTo}
          onChange={(value) => updateFilter('yearTo', value)}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
  ], [searchFilters, carTypeOptions, fuelOptions, updateFilter, handleKeyDown]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<CarWithInstance>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '6%',
      align: 'center',
    },
    {
      key: 'carNumber',
      header: '차량번호',
      align: 'center',
      width: '12%',
    },
    {
      key: 'brand',
      header: '브랜드',
      align: 'start',
      width: '10%',
      cell: (item: CarWithInstance) => item.brand || '-',
    },
    {
      key: 'model',
      header: '모델',
      align: 'start',
      width: '12%',
      cell: (item: CarWithInstance) => item.model || '-',
    },
    {
      key: 'type',
      header: '차종',
      align: 'center',
      width: '8%',
      cell: (item: CarWithInstance) => {
        const typeMap: Record<string, string> = {
          SEDAN: '세단',
          SUV: 'SUV',
          HATCHBACK: '해치백',
          COUPE: '쿠페',
          CONVERTIBLE: '컨버터블',
          TRUCK: '트럭',
          VAN: '밴',
          OTHER: '기타',
        };
        return item.type ? typeMap[item.type] || item.type : '-';
      },
    },
    {
      key: 'year',
      header: '연식',
      align: 'center',
      width: '8%',
      cell: (item: CarWithInstance) => item.year?.toString() || '-',
    },
    {
      key: 'fuel',
      header: '연료',
      align: 'center',
      width: '8%',
      cell: (item: CarWithInstance) => {
        const fuelMap: Record<string, string> = {
          GASOLINE: '휘발유',
          DIESEL: '경유',
          HYBRID: '하이브리드',
          ELECTRIC: '전기',
          LPG: 'LPG',
          OTHER: '기타',
        };
        return item.fuel ? fuelMap[item.fuel] || item.fuel : '-';
      },
    },
    {
      key: 'carInstance',
      header: '등록 호실',
      align: 'center',
      width: '10%',
      cell: (item: CarWithInstance) => `${item.carInstance?.length || 0}개`,
    },
    {
      key: 'createdAt',
      header: '등록일자',
      align: 'center',
      width: '12%',
      cell: (item: CarWithInstance) => {
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
      width: '8%',
      cell: (item: CarWithInstance) => (
        <div className="flex gap-1 justify-center">
          <CrudButton
            action="delete"
            iconOnly
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item.id);
            }}
            title="차량 삭제"
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
        title="차량 관리" 
        subtitle="차량 등록, 수정, 삭제 및 호실 연결 관리"
        rightActions={
          <CrudButton
            action="create"
            size="default"
            onClick={handleCreateClick}
            title="차량 추가"
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
        data={carList as unknown as Record<string, unknown>[]}
        columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
        onRowClick={handleRowClick as unknown as (item: Record<string, unknown>, index: number) => void}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName="차량"
        minWidth="1200px"
      />

      {/* 삭제 확인 다이얼로그 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="차량 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 차량 정보가 영구적으로 삭제됩니다.
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
