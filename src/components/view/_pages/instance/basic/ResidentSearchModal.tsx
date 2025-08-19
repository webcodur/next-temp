'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, User, Calendar, UserCheck, Phone, Mail } from 'lucide-react';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
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
        gender: (filters.gender as 'M' | 'F') || undefined,
      });

      if (result.success && result.data) {
        // 이미 연결된 거주민 제외 (해당 인스턴스에 연결되지 않은 거주민만 표시)
        const availableResidents = result.data.data.filter(resident => 
          !resident.residentInstance.some(ri => ri.instanceId === instanceId)
        );
        setResidentList(availableResidents);
      } else {
        setResidentList([]);
        setErrorMessage(result.errorMsg || '거주민 목록 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('거주민 목록 로드 중 오류:', error);
      setResidentList([]);
      setErrorMessage('거주민 목록 로드 중 오류가 발생했습니다.');
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
        setErrorMessage(result.errorMsg || '거주민 연결에 실패했습니다.');
      }
    } catch (error) {
      console.error('거주민 연결 중 오류:', error);
      setErrorMessage('거주민 연결 중 오류가 발생했습니다.');
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
      title="거주민 검색 및 연결"
      size="xl"
    >
      <div className="space-y-4">
        {/* 검색 섹션 */}
        <AdvancedSearch
          searchFields={searchFields}
          onSearch={handleSearch}
          onReset={handleReset}
          loading={isLoading}
        />

        {/* 에러 메시지 */}
        {errorMessage && (
          <div className="p-4 rounded-md bg-red-50 border border-red-200">
            <p className="text-red-800 text-sm">{errorMessage}</p>
          </div>
        )}

        {/* 거주민 목록 */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">검색 중...</div>
            </div>
          ) : residentList.length === 0 ? (
            <div className="flex justify-center items-center py-8 text-center">
              <div>
                <User size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  연결 가능한 거주민이 없습니다
                </p>
              </div>
            </div>
          ) : (
            residentList.map((resident) => (
              <div
                key={resident.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedResident?.id === resident.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/30'
                }`}
                onClick={() => handleResidentSelect(resident)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-muted-foreground" />
                    <div>
                      <h4 className="font-medium text-foreground">
                        {resident.name}
                      </h4>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        {resident.phone && (
                          <div className="flex items-center gap-1">
                            <Phone size={12} />
                            <span>{resident.phone}</span>
                          </div>
                        )}
                        {resident.email && (
                          <div className="flex items-center gap-1">
                            <Mail size={12} />
                            <span>{resident.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {resident.gender && (
                      <div className="flex items-center gap-1">
                        <UserCheck size={14} />
                        <span>{resident.gender === 'M' ? '남성' : '여성'}</span>
                      </div>
                    )}
                    {resident.birthDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {new Date(resident.birthDate).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

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
