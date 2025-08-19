'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CarFront, Calendar, Fuel, Tag } from 'lucide-react';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import { searchCars } from '@/services/cars/cars$_GET';
import { createCarInstance } from '@/services/cars/cars_instances_POST';
import { CarWithInstance } from '@/types/car';
import { Option } from '@/components/ui/ui-input/field/core/types';

interface CarSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  instanceId: number;
  onSuccess: () => void;
}

interface SearchFilters {
  carNumber: string;
  brand: string;
  model: string;
  type: string;
  fuel: string;
}

const CAR_TYPE_OPTIONS: Option[] = [
  { value: 'SEDAN', label: '세단' },
  { value: 'SUV', label: 'SUV' },
  { value: 'HATCHBACK', label: '해치백' },
  { value: 'COUPE', label: '쿠페' },
  { value: 'CONVERTIBLE', label: '컨버터블' },
  { value: 'TRUCK', label: '트럭' },
  { value: 'VAN', label: '밴' },
  { value: 'OTHER', label: '기타' },
];

const FUEL_OPTIONS: Option[] = [
  { value: 'GASOLINE', label: '휘발유' },
  { value: 'DIESEL', label: '경유' },
  { value: 'HYBRID', label: '하이브리드' },
  { value: 'ELECTRIC', label: '전기' },
  { value: 'LPG', label: 'LPG' },
  { value: 'OTHER', label: '기타' },
];

export default function CarSearchModal({
  isOpen,
  onClose,
  instanceId,
  onSuccess,
}: CarSearchModalProps) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    carNumber: '',
    brand: '',
    model: '',
    type: '',
    fuel: '',
  });

  const [carList, setCarList] = useState<CarWithInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarWithInstance | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 검색 수행
  const loadCarData = useCallback(async (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      const result = await searchCars({
        page: 1,
        limit: 100,
        carNumber: filters.carNumber || undefined,
        brand: filters.brand || undefined,
        model: filters.model || undefined,
        type: filters.type || undefined,
        fuel: filters.fuel || undefined,
      });

      if (result.success && result.data) {
        // 이미 연결된 차량 제외 (인스턴스가 없는 차량만 표시)
        const availableCars = result.data.data.filter(car => 
          car.carInstance.length === 0 || 
          !car.carInstance.some(instance => instance.instanceId === instanceId)
        );
        setCarList(availableCars);
      } else {
        setCarList([]);
        setErrorMessage(result.errorMsg || '차량 목록 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('차량 목록 로드 중 오류:', error);
      setCarList([]);
      setErrorMessage('차량 목록 로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [instanceId]);

  // 초기 로드
  useEffect(() => {
    if (isOpen) {
      loadCarData(searchFilters);
    }
  }, [isOpen, loadCarData, searchFilters]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSearch = useCallback(() => {
    loadCarData(searchFilters);
    setSelectedCar(null);
  }, [searchFilters, loadCarData]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      carNumber: '',
      brand: '',
      model: '',
      type: '',
      fuel: '',
    };
    setSearchFilters(resetFilters);
    loadCarData(resetFilters);
    setSelectedCar(null);
  }, [loadCarData]);

  const handleCarSelect = (car: CarWithInstance) => {
    setSelectedCar(car);
    setErrorMessage('');
  };

  const handleConnect = async () => {
    if (!selectedCar) return;

    setIsConnecting(true);
    setErrorMessage('');

    try {
      const result = await createCarInstance({
        carNumber: selectedCar.carNumber,
        instanceId: instanceId,
        carShareOnoff: false, // 기본값
      });

      if (result.success) {
        onSuccess();
        handleClose();
      } else {
        setErrorMessage(result.errorMsg || '차량 연결에 실패했습니다.');
      }
    } catch (error) {
      console.error('차량 연결 중 오류:', error);
      setErrorMessage('차량 연결 중 오류가 발생했습니다.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    if (!isConnecting) {
      setSelectedCar(null);
      setErrorMessage('');
      onClose();
    }
  };

  // #region 테이블 컬럼 정의
  const columns: BaseTableColumn<CarWithInstance>[] = [
    {
      key: 'selected',
      header: '선택',
      width: '8%',
      align: 'center',
      cell: (item: CarWithInstance) => (
        <input
          type="radio"
          name="selectedCar"
          checked={selectedCar?.id === item.id}
          onChange={() => handleCarSelect(item)}
          className="w-4 h-4 text-primary"
        />
      ),
    },
    {
      key: 'carNumber',
      header: '차량번호',
      align: 'center',
      width: '15%',
    },
    {
      key: 'brand',
      header: '브랜드',
      align: 'center',
      width: '12%',
      cell: (item: CarWithInstance) => item.brand || '-',
    },
    {
      key: 'model',
      header: '모델',
      align: 'center',
      width: '15%',
      cell: (item: CarWithInstance) => item.model || '-',
    },
    {
      key: 'type',
      header: '차종',
      align: 'center',
      width: '12%',
      cell: (item: CarWithInstance) => item.type || '-',
    },
    {
      key: 'fuel',
      header: '연료',
      align: 'center',
      width: '12%',
      cell: (item: CarWithInstance) => item.fuel || '-',
    },
    {
      key: 'year',
      header: '연식',
      align: 'center',
      width: '10%',
      cell: (item: CarWithInstance) => item.year ? `${item.year}년` : '-',
    },
    {
      key: 'externalSticker',
      header: '외부 스티커',
      align: 'center',
      width: '16%',
      cell: (item: CarWithInstance) => item.externalSticker || '-',
    },
  ];
  // #endregion

  // 검색 필드 구성
  const searchFields = [
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
          options={CAR_TYPE_OPTIONS}
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
          options={FUEL_OPTIONS}
          value={searchFilters.fuel}
          onChange={(value) => updateFilter('fuel', value)}
        />
      ),
      visible: true,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="차량 검색 및 연결"
      size="xl"
    >
      <div className="space-y-4">
        {/* 검색 섹션 */}
        <AdvancedSearch
          fields={searchFields}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* 에러 메시지 */}
        {errorMessage && (
          <div className="p-4 bg-red-50 rounded-md border border-red-200">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}

        {/* 차량 목록 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">검색 중...</div>
          </div>
        ) : carList.length === 0 ? (
          <div className="flex justify-center items-center py-8 text-center">
            <div>
              <CarFront size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                연결 가능한 차량이 없습니다
              </p>
            </div>
          </div>
        ) : (
          <div className="max-h-96 overflow-hidden">
            <PaginatedTable
              data={carList as unknown as Record<string, unknown>[]}
              columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
              onRowClick={(car) => handleCarSelect(car as unknown as CarWithInstance)}
              pageSize={10}
              pageSizeOptions={[5, 10, 20]}
              itemName="차량"
              showPagination={false}
            />
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <button
            onClick={handleClose}
            disabled={isConnecting}
            className="px-4 py-2 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleConnect}
            disabled={!selectedCar || isConnecting}
            className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isConnecting ? '연결 중...' : '연결'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
