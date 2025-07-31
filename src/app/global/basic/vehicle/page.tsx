'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Eye, Trash2 } from 'lucide-react';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { PaginatedTable } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import type { BaseTableColumn } from '@/components/ui/ui-data/baseTable/types';
import { Button } from '@/components/ui/ui-input/button/Button';
import { searchCar, deleteCar } from '@/services/car';
import type { CarWithHousehold, SearchCarRequest, CarHousehold } from '@/types/car';

// #region 타입 정의 확장
interface CarTableData extends CarWithHousehold, Record<string, unknown> {
  roomInfo: string;
  householdInfo: string;
  statusText: string;
}
// #endregion

export default function VehicleListPage() {
  // #region 상태 관리
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [cars, setCars] = useState<CarTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  
  // 삭제 다이얼로그 상태
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCarForDelete, setSelectedCarForDelete] = useState<CarTableData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // #endregion

  // #region 데이터 로딩
  const loadCars = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const searchParams: SearchCarRequest = {
        page: currentPage,
        limit: pageSize,
      };

      if (searchKeyword.trim()) {
        searchParams.carNumber = searchKeyword.trim();
      }
      if (selectedBrand) {
        searchParams.brand = selectedBrand;
      }
      if (selectedFuel) {
        searchParams.fuel = selectedFuel;
      }
      if (selectedStatus) {
        searchParams.inOutStatus = selectedStatus as 'IN' | 'OUT';
      }
      if (yearFrom) {
        searchParams.yearFrom = parseInt(yearFrom);
      }
      if (yearTo) {
        searchParams.yearTo = parseInt(yearTo);
      }

      const response = await searchCar(searchParams);
      console.log('response', response)
      
      if (response.success && response.data) {
        const transformedData: CarTableData[] = response.data.data.map((car: CarWithHousehold) => ({
          ...car,
          roomInfo: car.carHousehold?.length > 0 
            ? car.carHousehold.map((ch: CarHousehold) => 
                ch.householdInstance.map((hi) => `${hi.code}`).join(', ')
              ).join(', ')
            : '미등록',
          householdInfo: car.carHousehold?.length > 0 
            ? car.carHousehold.map((ch: CarHousehold) => 
                ch.householdInstance.map((hi) => hi.name).join(', ')
              ).join(', ')
            : '없음',
          statusText: car.inOutStatus === 'IN' ? '입차' : car.inOutStatus === 'OUT' ? '출차' : '미확인'
        }));
        
        setCars(transformedData);
      } else {
        setError(response.errorMsg || '차량 목록을 불러오는데 실패했습니다.');
        setCars([]);
      }
    } catch (err) {
      console.error('차량 목록 로딩 실패:', err);
      setError('차량 목록을 불러오는데 실패했습니다.');
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchKeyword, selectedBrand, selectedFuel, selectedStatus, yearFrom, yearTo]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);
  // #endregion

  // #region 검색 핸들러
  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    loadCars();
  }, [loadCars]);

  const handleReset = useCallback(() => {
    setSearchKeyword('');
    setSelectedBrand('');
    setSelectedFuel('');
    setSelectedStatus('');
    setYearFrom('');
    setYearTo('');
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (searchKeyword === '' && selectedBrand === '' && selectedFuel === '' && 
        selectedStatus === '' && yearFrom === '' && yearTo === '') {
      loadCars();
    }
  }, [searchKeyword, selectedBrand, selectedFuel, selectedStatus, yearFrom, yearTo, loadCars]);
  // #endregion

  // #region 삭제 핸들러
  const handleDeleteClick = useCallback((car: CarTableData) => {
    setSelectedCarForDelete(car);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedCarForDelete || isDeleting) return;
    
    setIsDeleting(true);
    try {
      const response = await deleteCar(selectedCarForDelete.id);
      
      if (response.success) {
        // 로컬 상태에서 삭제된 차량 제거
        setCars(prev => prev.filter(car => car.id !== selectedCarForDelete.id));
        setIsDeleteDialogOpen(false);
        setSelectedCarForDelete(null);
      } else {
        alert(response.errorMsg || '차량 삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('차량 삭제 실패:', err);
      alert('차량 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  }, [selectedCarForDelete, isDeleting]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedCarForDelete(null);
  }, []);
  // #endregion

  // #region 테이블 컬럼 정의
  const columns: BaseTableColumn<CarTableData>[] = useMemo(() => [
    {
      key: 'carNumber',
      header: '차량번호',
      width: '120px',
      cell: (car) => (
        <span className="font-mono font-medium">{car.carNumber}</span>
      )
    },
    {
      key: 'brand',
      header: '제조사',
      width: '100px',
      cell: (car) => car.brand || '-'
    },
    {
      key: 'model',
      header: '모델',
      width: '120px',
      cell: (car) => car.model || '-'
    },
    {
      key: 'year',
      header: '연식',
      width: '80px',
      cell: (car) => car.year ? `${car.year}년` : '-'
    },
    {
      key: 'fuel',
      header: '연료',
      width: '80px',
      cell: (car) => car.fuel || '-'
    },
    {
      key: 'statusText',
      header: '상태',
      width: '80px',
      cell: (car) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          car.inOutStatus === 'IN' 
            ? 'bg-green-100 text-green-800' 
            : car.inOutStatus === 'OUT'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {car.statusText}
        </span>
      )
    },
    {
      key: 'roomInfo',
      header: '등록 세대',
      width: '120px',
      cell: (car) => car.roomInfo
    },
    {
      key: 'createdAt',
      header: '등록일',
      width: '100px',
      cell: (car) => new Date(car.createdAt).toLocaleDateString('ko-KR')
    },
    {
      key: 'actions',
      header: '작업',
      width: '120px',
      cell: (car) => (
        <div className="flex gap-2">
          <Link 
            href={`/global/basic/vehicle/${car.id}`}
            className="p-1 text-blue-600 transition-colors hover:text-blue-800"
            title="상세보기"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDeleteClick(car)}
            className="p-1 text-red-600 transition-colors hover:text-red-800"
            title="삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ], [handleDeleteClick]);
  // #endregion

  // #region 검색 필드 정의
  const searchFields = useMemo(() => [
    {
      key: 'carNumber',
      label: '차량번호',
      visible: true,
      element: (
        <Field
          label="차량번호"
          type="text"
          value={searchKeyword}
          onChange={setSearchKeyword}
          placeholder="차량번호 검색"
        />
      )
    },
    {
      key: 'brand',
      label: '제조사',
      visible: true,
      element: (
        <Field
          label="제조사"
          type="select"
          value={selectedBrand}
          onChange={setSelectedBrand}
          options={[
            { value: '', label: '전체' },
            { value: '현대', label: '현대' },
            { value: '기아', label: '기아' },
            { value: '제네시스', label: '제네시스' },
            { value: '삼성', label: '삼성' },
            { value: '쌍용', label: '쌍용' },
            { value: '한국GM', label: '한국GM' },
            { value: '르노삼성', label: '르노삼성' },
            { value: '벤츠', label: '벤츠' },
            { value: 'BMW', label: 'BMW' },
            { value: '아우디', label: '아우디' },
            { value: '토요타', label: '토요타' },
            { value: '혼다', label: '혼다' },
            { value: '니산', label: '니산' }
          ]}
        />
      )
    },
    {
      key: 'fuel',
      label: '연료',
      visible: true,
      element: (
        <Field
          label="연료"
          type="select"
          value={selectedFuel}
          onChange={setSelectedFuel}
          options={[
            { value: '', label: '전체' },
            { value: '가솔린', label: '가솔린' },
            { value: '디젤', label: '디젤' },
            { value: '하이브리드', label: '하이브리드' },
            { value: '전기', label: '전기' },
            { value: 'LPG', label: 'LPG' }
          ]}
        />
      )
    },
    {
      key: 'status',
      label: '상태',
      visible: true,
      element: (
        <Field
          label="상태"
          type="select"
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={[
            { value: '', label: '전체' },
            { value: 'IN', label: '입차' },
            { value: 'OUT', label: '출차' }
          ]}
        />
      )
    },
    {
      key: 'yearFrom',
      label: '연식 (시작)',
      visible: true,
      element: (
        <Field
          label="연식 (시작)"
          type="text"
          value={yearFrom}
          onChange={setYearFrom}
          placeholder="2000"
        />
      )
    },
    {
      key: 'yearTo',
      label: '연식 (끝)',
      visible: true,
      element: (
        <Field
          label="연식 (끝)"
          type="text"
          value={yearTo}
          onChange={setYearTo}
          placeholder="2024"
        />
      )
    }
  ], [searchKeyword, selectedBrand, selectedFuel, selectedStatus, yearFrom, yearTo]);
  // #endregion

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="차량 관리"
        subtitle="시스템에 등록된 차량 정보를 관리합니다"
        rightActions={
          <Link href="/global/basic/vehicle/create">
            <Button>
              <Plus className="mr-2 w-4 h-4" />
              차량 추가
            </Button>
          </Link>
        }
      />

      <AdvancedSearch
        fields={searchFields}
        onSearch={handleSearch}
        onReset={handleReset}
        defaultOpen={false}
      />

      {error && (
        <div className="p-4 bg-red-50 rounded-md border border-red-200">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <PaginatedTable
        data={cars}
        columns={columns}
        isFetching={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemName="차량"
        onRowClick={(car) => window.location.href = `/global/basic/vehicle/${car.id}`}
      />

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        title="차량 삭제 확인"
        size="sm"
      >
        <div className="space-y-4">
          {selectedCarForDelete && (
            <div className="text-center">
              <p className="text-gray-700">
                차량번호 <strong>{selectedCarForDelete.carNumber}</strong>을(를) 삭제하시겠습니까?
              </p>
              <p className="mt-2 text-sm text-red-600">
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
          )}
          
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}