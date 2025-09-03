'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'lucide-react';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';
import { searchUsers } from '@/services/users/users$_GET';
import { createUserInstance } from '@/services/users/users_instances_POST';
import { UserDetail } from '@/types/user';
import { Option } from '@/components/ui/ui-input/field/core/types';

interface UserSearchModalProps {
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

export default function UserSearchModal({
  isOpen,
  onClose,
  instanceId,
  onSuccess,
}: UserSearchModalProps) {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: '',
    phone: '',
    email: '',
    gender: '',
  });

  const [userList, setUserList] = useState<UserDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 검색 수행
  const loadUserData = useCallback(async (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      const result = await searchUsers({
        page: 1,
        limit: 100,
        name: filters.name || undefined,
        phone: filters.phone || undefined,
        email: filters.email || undefined,
        gender: (filters.gender && (filters.gender === 'M' || filters.gender === 'F')) ? filters.gender as 'M' | 'F' : undefined,
      });

      if (result.success && result.data) {
        // 이미 연결된 사용자 제외 (해당 인스턴스에 연결되지 않은 사용자만 표시)
        const availableUsers = result.data.data.filter(user => 
          !user.userInstance.some(ri => ri.instanceId === instanceId)
        );
        setUserList(availableUsers);
      } else {
        setUserList([]);
        setErrorMessage('사용자 목록 조회에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 목록 로드 중 오류:', error);
      setUserList([]);
      setErrorMessage('사용자 목록 로드 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [instanceId]);

  // 초기 로드
  useEffect(() => {
    if (isOpen) {
      loadUserData(searchFilters);
    }
  }, [isOpen, loadUserData, searchFilters]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSearch = useCallback(() => {
    loadUserData(searchFilters);
    setSelectedUser(null);
  }, [searchFilters, loadUserData]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      name: '',
      phone: '',
      email: '',
      gender: '',
    };
    setSearchFilters(resetFilters);
    loadUserData(resetFilters);
    setSelectedUser(null);
  }, [loadUserData]);

  const handleUserSelect = (user: UserDetail) => {
    setSelectedUser(user);
    setErrorMessage('');
  };

  const handleConnect = async () => {
    if (!selectedUser) return;

    setIsConnecting(true);
    setErrorMessage('');

    try {
      const result = await createUserInstance({
        userId: selectedUser.id,
        instanceId: instanceId,
      });

      if (result.success) {
        onSuccess();
        handleClose();
      } else {
        setErrorMessage('사용자 연결에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 연결 중 오류:', error);
      setErrorMessage('사용자 연결 중 오류가 발생했습니다.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    if (!isConnecting) {
      setSelectedUser(null);
      setErrorMessage('');
      onClose();
    }
  };

  // #region 테이블 컬럼 정의
  const columns: BaseTableColumn<UserDetail>[] = [
    {
      key: 'selected',
      header: '선택',
      minWidth: '100px',
      align: 'center',
      cell: (item: UserDetail) => (
        <input
          type="radio"
          name="selectedUser"
          checked={selectedUser?.id === item.id}
          onChange={() => handleUserSelect(item)}
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
      cell: (item: UserDetail) => item.phone || '-',
    },
    {
      key: 'email',
      header: '이메일',
      align: 'start',
      minWidth: '240px',
      cell: (item: UserDetail) => item.email || '-',
    },
    {
      key: 'gender',
      header: '성별',
      align: 'center',
      minWidth: '120px',
      cell: (item: UserDetail) => {
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
      cell: (item: UserDetail) => {
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
      cell: (item: UserDetail) => item.emergencyContact || '-',
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
      title="사용자 검색 및 연결"
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

        {/* 사용자 목록 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-muted-foreground">검색 중...</div>
          </div>
        ) : userList.length === 0 ? (
          <div className="flex justify-center items-center py-8 text-center">
            <div>
              <User size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                연결 가능한 사용자가 없습니다
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden max-h-96">
            <PaginatedTable
              data={userList as unknown as Record<string, unknown>[]}
              columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
              onRowClick={(user) => handleUserSelect(user as unknown as UserDetail)}
              pageSize={10}
              pageSizeOptions={[5, 10, 20]}
              itemName="사용자"
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
            disabled={!selectedUser || isConnecting}
            className="px-4 py-2 text-sm text-white rounded-md bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {isConnecting ? '연결 중...' : '연결'}
          </button>
        </div>
      </div>
    </Modal>
  );
}