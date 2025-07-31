'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { PaginatedTable } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import type { BaseTableColumn } from '@/components/ui/ui-data/baseTable/types';
import { searchHousehold } from '@/services/household/household$_GET';
import { deleteHousehold } from '@/services/household/household@id_DELETE';
import type { Household, HouseholdType, HouseholdInstance } from '@/types/household';
import Modal from '@/components/ui/ui-layout/modal/Modal';

// #region 타입 정의 확장
interface ParkingLot {
  id: number;
  code: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

interface HouseholdWithStatus extends Household, Record<string, unknown> {
  status: 'occupied' | 'vacant';
  occupantName?: string | null;
  roomNumber: string;
  instanceCount: number;
  instances?: HouseholdInstance[]; // 모달에서 사용할 인스턴스 목록
  parkinglot?: ParkingLot; // 주차장 정보
}
// #endregion

export default function HouseholdListPage() {
  // #region 상태 관리
  const [selectedType, setSelectedType] = useState<HouseholdType | ''>('');
  const [selectedLv1Address, setSelectedLv1Address] = useState(''); // 동
  const [selectedLv2Address, setSelectedLv2Address] = useState(''); // 호수
  const [selectedLv3Address, setSelectedLv3Address] = useState(''); // 상세주소
  const [households, setHouseholds] = useState<HouseholdWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 모달 관련 상태
  const [isInstanceModalOpen, setIsInstanceModalOpen] = useState(false);
  const [selectedHouseholdInstances, setSelectedHouseholdInstances] = useState<HouseholdInstance[]>([]);
  const [selectedHouseholdInfo, setSelectedHouseholdInfo] = useState<HouseholdWithStatus | null>(null);
  
  // 깊은 객체 모달 상태
  const [isParkingLotModalOpen, setIsParkingLotModalOpen] = useState(false);
  const [selectedParkingLot, setSelectedParkingLot] = useState<ParkingLot | null>(null);
  // #endregion

  // #region 데이터 로딩
  const loadHouseholds = useCallback(async (searchParams?: {
    householdType?: string;
    address1Depth?: string;
    address2Depth?: string;
    address3Depth?: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchHousehold({
        page: currentPage,
        limit: pageSize,
        householdType: (searchParams?.householdType as HouseholdType) || undefined,
        address1Depth: searchParams?.address1Depth || undefined,
        address2Depth: searchParams?.address2Depth || undefined,
        address3Depth: searchParams?.address3Depth || undefined,
      });

      if (response.success && response.data) {
        // API 응답 구조 확인
        const households = response.data.data || response.data.households || response.data || [];
        console.log('households', households)
        // API 데이터를 UI 형식으로 변환
        const transformedData: HouseholdWithStatus[] = households.map((household: Household) => {
          // 실제 API 응답에서는 householdInstance 배열을 사용
          const instances = household.householdInstance || [];
          // 현재 활성 인스턴스 (endDate가 null인 것)
          const activeInstances = instances.filter((instance: HouseholdInstance) => !instance.endDate);
          // 현재 활성 입주자 찾기
          const currentOccupant = activeInstances.length > 0 ? activeInstances[0] : null;
          
          return {
            ...household,
            roomNumber: `${household.address1Depth} ${household.address2Depth}`,
            status: activeInstances.length > 0 ? 'occupied' : 'vacant' as const,
            occupantName: currentOccupant?.instanceName || null,
            instanceCount: instances.length,
            instances: instances, // 모달에서 사용할 전체 인스턴스 목록
            parkinglot: household.parkinglot // 주차장 정보 보존
          };
        });
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
  }, [currentPage, pageSize]);

  // 페이지 최초 진입 시에만 데이터 로드
  useEffect(() => {
    loadHouseholds();
  }, [loadHouseholds]);
  // #endregion



  // #region 검색 필드 설정
  const searchFields = [
    {
      key: 'type',
      label: '호실 타입',
      element: (
        <Field
          type="select"
          label="호실 타입"
          placeholder="타입 선택"
          value={selectedType}
          onChange={(value) => setSelectedType(value as HouseholdType | '')}
          options={[
            { value: 'GENERAL', label: '거주지' },
            { value: 'COMMERCIAL', label: '점포' },
            { value: 'TEMP', label: '미정' },
          ]}
        />
      ),
      visible: true,
    },
    {
      key: 'lv1Address',
      label: '동 검색',
      element: (
        <Field
          type="text"
          label="동 검색"
          placeholder="동 정보 입력 (ex: 101동)"
          value={selectedLv1Address}
          onChange={setSelectedLv1Address}
        />
      ),
      visible: true,
    },
    {
      key: 'lv2Address',
      label: '호수 검색',
      element: (
        <Field
          type="text"
          label="호수 검색"
          placeholder="호수 정보 입력 (ex: 101호)"
          value={selectedLv2Address}
          onChange={setSelectedLv2Address}
          showClearButton={true}
        />
      ),
      visible: true,
    },
    {
      key: 'lv3Address',
      label: '상세주소 검색',
      element: (
        <Field
          type="text"
          label="상세주소 검색"
          placeholder="상세주소 입력 (ex: 도로명 주소)"
          value={selectedLv3Address}
          onChange={setSelectedLv3Address}
          showClearButton={true}
        />
      ),
      visible: true,
    },
  ];
  // #endregion

  // #region 테이블 컬럼 설정
  const columns: BaseTableColumn<HouseholdWithStatus>[] = [
    {
      key: 'address1Depth',
      header: '동',
      cell: (household: HouseholdWithStatus) => (
        <div className="font-medium text-center">{household.address1Depth}</div>
      ),
    },
    {
      key: 'address2Depth',
      header: '호',
      cell: (household: HouseholdWithStatus) => (
        <div className="font-medium text-center">{household.address2Depth}</div>
      ),
    },
    {
      key: 'address3Depth',
      header: '상세주소',
      cell: (household: HouseholdWithStatus) => (
        <div className="text-center">{household.address3Depth || '-'}</div>
      ),
    },
    {
      key: 'parkinglot',
      header: '주차장',
      cell: (household: HouseholdWithStatus) => (
        <div>
          {household.parkinglot ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (household.parkinglot) {
                  handleShowParkingLot(household.parkinglot);
                }
              }}
              className="text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
              title="주차장 정보 상세보기"
            >
              {household.parkinglot.name}
            </button>
          ) : (
            <span className="text-gray-500">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'householdType',
      header: '타입',
      cell: (household: HouseholdWithStatus) => {
        const typeMap = {
          GENERAL: '거주지',
          TEMP: '미정',
          COMMERCIAL: '점포',
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
      key: 'instanceCount',
      header: '입주 이력',
      cell: (household: HouseholdWithStatus) => (
        <div className="text-center">
          {household.instanceCount > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShowInstances(household);
              }}
              className="text-blue-600 cursor-pointer hover:text-blue-800 hover:underline"
              title="입주 이력 상세보기"
            >
              {household.instanceCount}건
            </button>
          ) : (
            <span className="text-gray-500">0건</span>
          )}
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(household.id);
            }}
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
    loadHouseholds({
      householdType: selectedType || undefined,
      address1Depth: selectedLv1Address || undefined,
      address2Depth: selectedLv2Address || undefined,
      address3Depth: selectedLv3Address || undefined,
    });
  };

  const handleReset = () => {
    setSelectedType('');
    setSelectedLv1Address('');
    setSelectedLv2Address('');
    setSelectedLv3Address('');
    setCurrentPage(1);
    loadHouseholds(); // 초기화 시에는 검색 파라미터 없이 호출
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 호실을 삭제하시겠습니까?')) return;
    
    try {
      const response = await deleteHousehold(id);
      if (response.success) {
        alert('호실이 삭제되었습니다.');
        // 삭제 후 현재 검색 조건을 유지하여 새로고침
        loadHouseholds({
          householdType: selectedType || undefined,
          address1Depth: selectedLv1Address || undefined,
          address2Depth: selectedLv2Address || undefined,
          address3Depth: selectedLv3Address || undefined,
        });
      } else {
        throw new Error(response.errorMsg || '삭제 실패');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.');
    }
  };

  const handleRowClick = (household: HouseholdWithStatus) => {
    window.location.href = `/parking/household-management/household/${household.id}`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleShowInstances = (household: HouseholdWithStatus) => {
    setSelectedHouseholdInfo(household);
    setSelectedHouseholdInstances(household.instances || []);
    setIsInstanceModalOpen(true);
  };

  const handleCloseInstanceModal = () => {
    setIsInstanceModalOpen(false);
    setSelectedHouseholdInstances([]);
    setSelectedHouseholdInfo(null);
  };

  const handleShowParkingLot = (parkinglot: ParkingLot) => {
    setSelectedParkingLot(parkinglot);
    setIsParkingLotModalOpen(true);
  };

  const handleCloseParkingLotModal = () => {
    setIsParkingLotModalOpen(false);
    setSelectedParkingLot(null);
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
          subtitle="건물 호실 정보를 관리합니다"
          rightActions={rightActions}
        />
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">오류가 발생했습니다: {error}</p>
          <button 
            onClick={() => loadHouseholds()}
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
        subtitle="건물 호실 정보를 관리합니다"
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
          data={households}
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

      {/* 입주 이력 상세 모달 */}
      <Modal
        isOpen={isInstanceModalOpen}
        onClose={handleCloseInstanceModal}
        title={selectedHouseholdInfo ? `${selectedHouseholdInfo.address1Depth} ${selectedHouseholdInfo.address2Depth} 입주 이력` : '입주 이력'}
        size="lg"
      >
        <div className="space-y-4">
          {selectedHouseholdInstances.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              입주 이력이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedHouseholdInstances.map((instance, index) => (
                <div key={instance.id} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {instance.instanceName || `세대 ${index + 1}`}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>입주일:</span>
                          <span>{instance.startDate ? new Date(instance.startDate).toLocaleDateString() : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>퇴거일:</span>
                          <span>{instance.endDate ? new Date(instance.endDate).toLocaleDateString() : '거주중'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>등록일:</span>
                          <span>{new Date(instance.createdAt).toLocaleDateString()}</span>
                        </div>
                        {instance.memo && (
                          <div className="mt-2">
                            <span className="text-gray-700">메모:</span>
                            <p className="mt-1 text-gray-600">{instance.memo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <Link
                        href={`/parking/household-management/household-instance/${instance.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={handleCloseInstanceModal}
                      >
                        상세보기
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* 주차장 정보 상세 모달 */}
      <Modal
        isOpen={isParkingLotModalOpen}
        onClose={handleCloseParkingLotModal}
        title="주차장 정보"
        size="md"
      >
        {selectedParkingLot && (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">이름:</span>
              <span className="font-medium">{selectedParkingLot.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">코드:</span>
              <span className="font-medium">{selectedParkingLot.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">설명:</span>
              <span className="font-medium">{selectedParkingLot.description || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">생성일:</span>
              <span className="font-medium">{new Date(selectedParkingLot.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">수정일:</span>
              <span className="font-medium">{new Date(selectedParkingLot.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 