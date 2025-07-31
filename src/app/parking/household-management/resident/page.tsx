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

// #region 타입 정의 확장
interface ResidentWithStatus extends ResidentDto, Record<string, unknown> {
  status: 'active' | 'moved' | 'inactive';
  relationship?: string;
  roomNumber?: string;
  householdName?: string;
  isOwner: boolean;
}
// #endregion

export default function ResidentListPage() {
  // #region 상태 관리
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedGender, setSelectedGender] = useState<'M' | 'F' | ''>('');
  const [selectedBirthYear, setSelectedBirthYear] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [ageRangeMin, setAgeRangeMin] = useState('');
  const [ageRangeMax, setAgeRangeMax] = useState('');
  const [residents, setResidents] = useState<ResidentWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
        gender: selectedGender || undefined,
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
            isOwner: false, // 세대주 여부는 별도 API에서 조회 필요
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
  }, [currentPage, pageSize, selectedGender, searchKeyword]);

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
          placeholder="상태 선택"
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={[
            { value: 'active', label: '거주중' },
            { value: 'moved', label: '이사' },
            { value: 'inactive', label: '퇴거' },
          ]}
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
            placeholder="최소 나이"
            value={ageRangeMin}
            onChange={setAgeRangeMin}
          />
          <Field
            type="text"
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
            {resident.isOwner && (
              <div className="text-xs text-primary">세대주</div>
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
          moved: { label: '이사', className: 'bg-yellow-100 text-yellow-800' },
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
          title="입주민 검색"
          fields={searchFields}
          onSearch={handleSearch}
          onReset={handleReset}
          searchLabel="검색"
          resetLabel="초기화"
          defaultOpen={true}
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
    </div>
  );
} 