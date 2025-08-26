'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'lucide-react';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import { searchResidents } from '@/services/residents/residents$_GET';
import { createResidentInstance } from '@/services/residents/residents_instances_POST';
import { ResidentDetail } from '@/types/resident';
import { Option } from '@/components/ui/ui-input/field/core/types';

interface ResidentSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  instanceId: number;
  onSuccess: () => void;
}

interface SearchFilters {
  name: string;
  phone: string;
  email: string;
  gender: string;
}

const GENDER_OPTIONS: Option[] = [
  { value: 'M', label: '남성' },
  { value: 'F', label: '여성' },
];

export default function ResidentSearchModal({
  isOpen,
  onClose,
  instanceId,
  onSuccess,
}: ResidentSearchModalProps) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: '',
    phone: '',
    email: '',
    gender: '',
  });

  const [residentList, setResidentList] = useState<ResidentDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResident, setSelectedResident] = useState<ResidentDetail | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 검색 수행
  const loadResidentData = useCallback(async (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      const result = await searchResidents({
        page: 1,
        limit: 100,
        name: filters.name || undefined,
        phone: filters.phone || undefined,
        email: filters.email || undefined,
        gender: (filters.gender && (filters.gender === 'M' || filters.gender === 'F')) ? filters.gender as 'M' | 'F' : undefined,
      });

      if (result.success && result.data) {
        // 이미 연결된 주민 제외 (해당 인스턴스에 연결되지 않은 주민만 표시)
        const availableResidents = result.data.data.filter(resident => 
          !resident.residentInstance.some(ri => ri.instanceId === instanceId)
        );
        setResidentList(availableResidents);
      } else {
        setResidentList([]);
        setErrorMessage('주민 목록 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('주민 목록 로드 중 오류:', error);
      setResidentList([]);
      setErrorMessage('주민 목록 로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [instanceId]);

  // 초기 로드
  useEffect(() => {
    if (isOpen) {
      loadResidentData(searchFilters);
    }
  }, [isOpen, loadResidentData, searchFilters]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSearch = useCallback(() => {
    loadResidentData(searchFilters);
    setSelectedResident(null);
  }, [searchFilters, loadResidentData]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      name: '',
      phone: '',
      email: '',
      gender: '',
    };
    setSearchFilters(resetFilters);
    loadResidentData(resetFilters);
    setSelectedResident(null);
  }, [loadResidentData]);

  const handleResidentSelect = (resident: ResidentDetail) => {
    setSelectedResident(resident);
    setErrorMessage('');
  };

  const handleConnect = async () => {
    if (!selectedResident) return;

    setIsConnecting(true);
    setErrorMessage('');

    try {
      const result = await createResidentInstance({
        residentId: selectedResident.id,
        instanceId: instanceId,
      });

      if (result.success) {
        onSuccess();
        handleClose();
      } else {
        setErrorMessage('주민 연결에 실패했습니다.');
      }
    } catch (error) {
      console.error('주민 연결 중 오류:', error);
      setErrorMessage('주민 연결 중 오류가 발생했습니다.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    if (!isConnecting) {
      setSelectedResident(null);
      setErrorMessage('');
      onClose();
    }
  };

  // #region 테이블 컬럼 정의
  const columns: BaseTableColumn<ResidentDetail>[] = [
    {
      key: 'selected',
      header: '선택',
      minWidth: '100px',
      align: 'center',
      cell: (item: ResidentDetail) => (
        <input
          type="radio"
          name="selectedResident"
          checked={selectedResident?.id === item.id}
          onChange={() => handleResidentSelect(item)}
          className="w-4 h-4 text-primary"
        />
      ),
    },
    {
      key: 'name',
      header: '이름',
      align: 'center',
      minWidth: '180px',
    },
    {
      key: 'phone',
      header: '전화번호',
      align: 'center',
      minWidth: '220px',
      cell: (item: ResidentDetail) => item.phone || '-',
    },
    {
      key: 'email',
      header: '이메일',
      align: 'start',
      minWidth: '240px',
      cell: (item: ResidentDetail) => item.email || '-',
    },
    {
      key: 'gender',
      header: '성별',
      align: 'center',
      minWidth: '120px',
      cell: (item: ResidentDetail) => {
        if (item.gender === 'M') return '남성';
        if (item.gender === 'F') return '여성';
        return '-';
      },
    },
    {
      key: 'birthDate',
      header: '생년월일',
      align: 'center',
      minWidth: '180px',
      cell: (item: ResidentDetail) => {
        if (!item.birthDate) return '-';
        return new Date(item.birthDate).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
    },
    {
      key: 'emergencyContact',
      header: '긴급연락처',
      align: 'center',
      minWidth: '170px',
      cell: (item: ResidentDetail) => item.emergencyContact || '-',
    },
  ];
  // #endregion

  // 검색 필드 구성
  const searchFields = [
    {
      key: 'name',
      label: '이름 검색',
      element: (
        <FieldText
          id="search-name"
          label="이름"
          placeholder="이름을 입력하세요"
          value={searchFilters.name}
          onChange={(value) => updateFilter('name', value)}
          showSearchIcon={true}
        />
      ),
      visible: true,
    },
    {
      key: 'phone',
      label: '전화번호 검색',
      element: (
        <FieldText
          id="search-phone"
          label="전화번호"
          placeholder="전화번호를 입력하세요"
          value={searchFilters.phone}
          onChange={(value) => updateFilter('phone', value)}
          showSearchIcon={true}
        />
      ),
      visible: true,
    },
    {
      key: 'email',
      label: '이메일 검색',
      element: (
        <FieldText
          id="search-email"
          label="이메일"
          placeholder="이메일을 입력하세요"
          value={searchFilters.email}
          onChange={(value) => updateFilter('email', value)}
          showSearchIcon={true}
        />
      ),
      visible: true,
    },
    {
      key: 'gender',
      label: '성별 검색',
      element: (
        <FieldSelect
          id="search-gender"
          label="성별"
          placeholder="성별을 선택하세요"
          options={GENDER_OPTIONS}
          value={searchFilters.gender}
          onChange={(value) => updateFilter('gender', value)}
        />
      ),
      visible: true,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="주민 검색 및 연결"
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

        {/* 주민 목록 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">검색 중...</div>
          </div>
        ) : residentList.length === 0 ? (
          <div className="flex justify-center items-center py-8 text-center">
            <div>
              <User size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                연결 가능한 주민이 없습니다
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden max-h-96">
            <PaginatedTable
              data={residentList as unknown as Record<string, unknown>[]}
              columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
              onRowClick={(resident) => handleResidentSelect(resident as unknown as ResidentDetail)}
              pageSize={10}
              pageSizeOptions={[5, 10, 20]}
              itemName="주민"
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
            disabled={!selectedResident || isConnecting}
            className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isConnecting ? '연결 중...' : '연결'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
