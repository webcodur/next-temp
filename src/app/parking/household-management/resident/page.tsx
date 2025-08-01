'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { User, Plus, Eye, Trash2, ArrowRightLeft, History } from 'lucide-react';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { PaginatedTable } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { Field } from '@/components/ui/ui-input/field/core/Field';
import type { BaseTableColumn } from '@/components/ui/ui-data/baseTable/types';
import { searchResident, type SearchResidentParams, type ResidentDto } from '@/services/resident/resident$_GET';
import { deleteResident } from '@/services/resident/resident@id_DELETE';
import Modal from '@/components/ui/ui-layout/modal/Modal';

// #region 타입 정의 확장
interface ResidentWithStatus extends ResidentDto, Record<string, unknown> {
  status: 'active' | 'inactive';
  relationship?: string;
  roomNumber?: string;
  householdName?: string;
  hasHousehold: boolean;
}
// #endregion

export default function ResidentListPage() {
  // #region 상태 관리
  // 기본 검색 조건
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedGender, setSelectedGender] = useState<'M' | 'F' | ''>('');
  const [selectedBirthYear, setSelectedBirthYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [ageRangeMin, setAgeRangeMin] = useState('');
  const [ageRangeMax, setAgeRangeMax] = useState('');
  
  // 추가 검색 조건 (백엔드 API 지원)
  const [searchPhone, setSearchPhone] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedAddress1Depth, setSelectedAddress1Depth] = useState('');
  const [selectedAddress2Depth, setSelectedAddress2Depth] = useState('');
  const [selectedAddress3Depth, setSelectedAddress3Depth] = useState('');
  
  const [residents, setResidents] = useState<ResidentWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 모달 관련 상태
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [selectedResidentHouseholds, setSelectedResidentHouseholds] = useState<unknown[]>([]);
  const [selectedResidentInfo, setSelectedResidentInfo] = useState<ResidentWithStatus | null>(null);
  // #endregion

  // #region 데이터 로딩
  const loadResidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: SearchResidentParams = {
        page: currentPage,
        limit: pageSize,
        name: searchKeyword || undefined,
        phone: searchPhone || undefined,
        email: searchEmail || undefined,
        gender: selectedGender || undefined,
        address1Depth: selectedAddress1Depth || undefined,
        address2Depth: selectedAddress2Depth || undefined,
        address3Depth: selectedAddress3Depth || undefined,
      };

      const response = await searchResident(params);

      console.log('🔍 [Resident API] Full Response:', response);
      console.log('🔍 [Resident API] Response.data:', response.data);
      console.log('🔍 [Resident API] Response.data.data:', response.data?.data);

      if (response.success && response.data) {
        // Resident API는 { data: [...], meta: {...} } 구조
        const residents = response.data.data || [];
        console.log('🔍 [Resident API] Final residents array:', residents);
        console.log('🔍 [Resident API] Array length:', residents.length);
        console.log('🔍 [Resident API] Meta info:', response.data.meta);
        
        if (residents.length > 0) {
          console.log('🔍 [Resident API] First resident sample:', residents[0]);
        }

        // API 데이터를 UI 형식으로 변환
        const transformedData: ResidentWithStatus[] = residents.map((resident: ResidentDto) => {
          return {
            ...resident,
            status: resident.deletedAt ? 'inactive' : 'active' as const,
            hasHousehold: !!(resident.residentHouseholds && resident.residentHouseholds.length > 0),
            // 세대 관련 정보는 residentHouseholds에서 가져올 수 있지만, 복잡한 구조이므로 별도 처리 필요
            relationship: undefined,
            roomNumber: undefined,
            householdName: undefined,
          };
        });
        
        setResidents(transformedData);
      } else {
        throw new Error(response.errorMsg || '데이터 로딩 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setResidents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, selectedGender, searchKeyword, searchPhone, searchEmail, selectedAddress1Depth, selectedAddress2Depth, selectedAddress3Depth]);

  useEffect(() => {
    loadResidents();
  }, [loadResidents]);
  // #endregion

  // #region 필터링된 데이터 (클라이언트 사이드 필터링)
  const filteredData = residents.filter((resident) => {
    const matchesKeyword = resident.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          (resident.phone && resident.phone.toLowerCase().includes(searchKeyword.toLowerCase())) ||
                          (resident.email && resident.email.toLowerCase().includes(searchKeyword.toLowerCase()));
    const matchesGender = !selectedGender || resident.gender === selectedGender;
    const matchesStatus = !selectedStatus || resident.status === selectedStatus;
    const matchesBirthYear = !selectedBirthYear || 
      (resident.birthDate && new Date(resident.birthDate).getFullYear().toString() === selectedBirthYear);
    
    return matchesKeyword && matchesGender && matchesStatus && matchesBirthYear;
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
          label="검색어"
          placeholder="입주민명, 호실번호, 세대명 검색"
          value={searchKeyword}
          onChange={setSearchKeyword}
          showClearButton={true}
        />
      ),
      visible: true,
    },
    {
      key: 'gender',
      label: '성별',
      element: (
        <Field
          type="select"
          label="성별"
          placeholder="성별 선택"
          value={selectedGender}
          onChange={(value) => setSelectedGender(value as 'M' | 'F' | '')}
          options={[
            { value: 'M', label: '남성' },
            { value: 'F', label: '여성' },
          ]}
        />
      ),
      visible: true,
    },
    {
      key: 'birthYear',
      label: '출생년도',
      element: (
        <Field
          type="select"
          label="출생년도"
          placeholder="출생년도 선택"
          value={selectedBirthYear}
          onChange={setSelectedBirthYear}
          options={Array.from({ length: 80 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return { value: year.toString(), label: `${year}년` };
          })}
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
          label="거주 상태"
          placeholder="상태 선택"
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={[
            { value: 'active', label: '거주중' },
            { value: 'inactive', label: '퇴거' },
          ]}
        />
      ),
      visible: true,
    },
    {
      key: 'phone',
      label: '연락처',
      element: (
        <Field
          type="text"
          label="연락처"
          placeholder="연락처 검색"
          value={searchPhone}
          onChange={setSearchPhone}
          showClearButton={true}
        />
      ),
      visible: true,
    },
    {
      key: 'email',
      label: '이메일',
      element: (
        <Field
          type="text"
          label="이메일"
          placeholder="이메일 검색"
          value={searchEmail}
          onChange={setSearchEmail}
          showClearButton={true}
        />
      ),
      visible: true,
    },
    {
      key: 'address1Depth',
      label: '동',
      element: (
        <Field
          type="select"
          label="동"
          placeholder="동 선택"
          value={selectedAddress1Depth}
          onChange={setSelectedAddress1Depth}
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
      key: 'address2Depth',
      label: '호수',
      element: (
        <Field
          type="text"
          label="호수"
          placeholder="호수 검색 (예: 1001호)"
          value={selectedAddress2Depth}
          onChange={setSelectedAddress2Depth}
          showClearButton={true}
        />
      ),
      visible: true,
    },
    {
      key: 'address3Depth',
      label: '세부 주소',
      element: (
        <Field
          type="text"
          label="세부 주소"
          placeholder="세부 주소 검색"
          value={selectedAddress3Depth}
          onChange={setSelectedAddress3Depth}
          showClearButton={true}
        />
      ),
      visible: true,
    },
    {
      key: 'ageRange',
      label: '나이 범위',
      element: (
        <div className="grid grid-cols-2 gap-2">
          <Field
            type="text"
            label="최소 나이"
            placeholder="최소 나이"
            value={ageRangeMin}
            onChange={setAgeRangeMin}
          />
          <Field
            type="text"
            label="최대 나이"
            placeholder="최대 나이"
            value={ageRangeMax}
            onChange={setAgeRangeMax}
          />
        </div>
      ),
      visible: true,
    },
  ];
  // #endregion

  // #region 테이블 컬럼 설정
  const columns: BaseTableColumn<ResidentWithStatus>[] = [
    {
      key: 'name',
      header: '이름',
      cell: (resident: ResidentWithStatus) => (
        <div className="flex gap-2 items-center">
          <User className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{resident.name}</div>
            {resident.hasHousehold && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowHouseholds(resident);
                }}
                className="text-xs cursor-pointer text-primary hover:text-primary/80 hover:underline"
                title="세대 정보 보기"
              >
                세대 등록됨
              </button>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: '이메일',
      cell: (resident: ResidentWithStatus) => (
        <div className="text-sm text-center">{resident.email || '-'}</div>
      ),
    },
    {
      key: 'gender',
      header: '성별',
      cell: (resident: ResidentWithStatus) => (
        <div className="text-center">
          {resident.gender === 'M' ? '남성' : resident.gender === 'F' ? '여성' : '-'}
        </div>
      ),
    },
    {
      key: 'birthDate',
      header: '생년월일',
      cell: (resident: ResidentWithStatus) => (
        <div className="text-sm text-center">
          {resident.birthDate ? new Date(resident.birthDate).toLocaleDateString() : '-'}
        </div>
      ),
    },
    {
      key: 'emergencyContact',
      header: '비상연락처',
      cell: (resident: ResidentWithStatus) => (
        <div className="text-sm text-center">{resident.emergencyContact || '-'}</div>
      ),
    },
    {
      key: 'createdAt',
      header: '등록일',
      cell: (resident: ResidentWithStatus) => (
        <div className="text-sm text-center">
          {new Date(resident.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: 'phone',
      header: '연락처',
      cell: (resident: ResidentWithStatus) => (
        <div className="text-sm text-center">
          {resident.phone || '-'}
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      cell: (resident: ResidentWithStatus) => {
        const statusMap: Record<ResidentWithStatus['status'], { label: string; className: string }> = {
          active: { label: '거주중', className: 'bg-green-100 text-green-800' },
          inactive: { label: '퇴거', className: 'bg-gray-100 text-gray-800' },
        };
        const status = statusMap[resident.status];
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: '작업',
      cell: (resident: ResidentWithStatus) => (
        <div className="flex gap-1 justify-center">
          <Link
            href={`/parking/household-management/resident/${resident.id}`}
            className="p-1 text-blue-600 rounded hover:bg-blue-50"
            title="상세보기"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <button
            onClick={() => handleDelete(resident.id)}
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
    loadResidents();
  };

  const handleReset = () => {
    setSearchKeyword('');
    setSelectedGender('');
    setSelectedBirthYear('');
    setSelectedStatus('');
    setAgeRangeMin('');
    setAgeRangeMax('');
    // 새로 추가한 검색 조건들 초기화
    setSearchPhone('');
    setSearchEmail('');
    setSelectedAddress1Depth('');
    setSelectedAddress2Depth('');
    setSelectedAddress3Depth('');
    setCurrentPage(1);
    loadResidents();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 입주민을 삭제하시겠습니까?')) return;
    
    try {
      const response = await deleteResident(id);
      if (response.success) {
        alert('입주민이 삭제되었습니다.');
        loadResidents();
      } else {
        throw new Error(response.errorMsg || '삭제 실패');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.');
    }
  };

  const handleRowClick = (resident: ResidentWithStatus) => {
    console.log('행 클릭:', resident);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleShowHouseholds = (resident: ResidentWithStatus) => {
    setSelectedResidentInfo(resident);
    setSelectedResidentHouseholds(resident.residentHouseholds || []);
    setIsHouseholdModalOpen(true);
  };

  const handleCloseHouseholdModal = () => {
    setIsHouseholdModalOpen(false);
    setSelectedResidentHouseholds([]);
    setSelectedResidentInfo(null);
  };
  // #endregion

  // #region 액션 버튼
  const rightActions = (
    <div className="flex gap-2">
      <Link
        href="/parking/household-management/resident/history"
        className="flex gap-2 items-center px-4 py-2 rounded-lg border transition-colors border-border hover:bg-muted"
      >
        <History className="w-4 h-4" />
        이동이력
      </Link>
      <Link
        href="/parking/household-management/resident/move"
        className="flex gap-2 items-center px-4 py-2 rounded-lg border transition-colors border-border hover:bg-muted"
      >
        <ArrowRightLeft className="w-4 h-4" />
        입주민 이동
      </Link>
      <Link
        href="/parking/household-management/resident/create"
        className="flex gap-2 items-center px-4 py-2 rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="w-4 h-4" />
        입주민 등록
      </Link>
    </div>
  );
  // #endregion

  // #region 에러 상태
  if (error) {
    return (
      <div className="p-6">
        <PageHeader
          title="입주민 관리"
          subtitle="아파트 입주민 정보를 관리합니다"
          rightActions={rightActions}
        />
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-800">오류가 발생했습니다: {error}</p>
          <button 
            onClick={loadResidents}
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
        title="입주민 관리"
        subtitle="아파트 입주민 정보를 관리합니다"
        rightActions={rightActions}
      />
      
      <div className="space-y-6">
        {/* 검색/필터 패널 */}
        <AdvancedSearch
          fields={searchFields}
          onSearch={handleSearch}
          onReset={handleReset}
          searchLabel="검색"
          resetLabel="초기화"
          defaultOpen={true}
          searchMode="client"
        />

        {/* 데이터 테이블 */}
        <PaginatedTable
          data={filteredData}
          columns={columns}
          onRowClick={handleRowClick}
          itemName="입주민"
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[5, 10, 20, 50]}
          isFetching={loading}
        />
      </div>

      {/* 세대 정보 상세 모달 */}
      <Modal
        isOpen={isHouseholdModalOpen}
        onClose={handleCloseHouseholdModal}
        title={selectedResidentInfo ? `${selectedResidentInfo.name}님의 세대 정보` : '세대 정보'}
        size="lg"
      >
        <div className="space-y-4">
          {selectedResidentHouseholds.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              등록된 세대 정보가 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedResidentHouseholds.map((householdRelation, index) => {
                const relation = householdRelation as Record<string, unknown>;
                const householdInstance = relation.householdInstance as Record<string, unknown> | undefined;
                const household = householdInstance?.household as Record<string, unknown> | undefined;
                
                const roomNumber = household ? 
                  `${household.address1Depth} ${household.address2Depth}${household.address3Depth ? ' ' + household.address3Depth : ''}` : 
                  '정보 없음';
                const instanceName = householdInstance?.instanceName as string || '세대명 없음';
                const relationship = relation.relationship as string || '관계 없음';
                
                return (
                  <div key={relation.id as number || index} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {instanceName} ({roomNumber})
                        </h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>관계:</span>
                            <span className="font-medium">{relationship}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>등록일:</span>
                            <span>{relation.createdAt ? new Date(relation.createdAt as string).toLocaleDateString() : '-'}</span>
                          </div>
                          {relation.memo ? (
                            <div className="mt-2">
                              <span className="text-gray-700">메모:</span>
                              <p className="mt-1 text-gray-600">{String(relation.memo)}</p>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="ml-4">
                        {householdInstance?.id ? (
                          <Link
                            href={`/parking/household-management/household-instance/${String(householdInstance.id)}`}
                            className="text-sm text-blue-600 hover:text-blue-800"
                            onClick={handleCloseHouseholdModal}
                          >
                            세대 상세
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
} 