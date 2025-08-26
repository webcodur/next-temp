'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Modal from './Modal';
import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldEmail from '@/components/ui/ui-input/field/text/FieldEmail';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';

// API 호출
import { searchAdmin } from '@/services/admin/admin$_GET';

// 타입 정의
import { Admin } from '@/types/admin';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 인터페이스 정의
interface AdminSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (admin: Admin) => void;
  title?: string;
  selectedAdminId?: number;
}

interface SearchFilters {
  account: string;
  name: string;
  email: string;
  roleId: string;
}
// #endregion

export default function AdminSelectModal({
  isOpen,
  onClose,
  onSelect,
  title = "근무자 선택",
  selectedAdminId,
}: AdminSelectModalProps) {
  
  // #region 상태 관리
  const [adminList, setAdminList] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    account: '',
    name: '',
    email: '',
    roleId: '',
  });
  // #endregion

  // #region 권한 옵션 생성
  const roleOptions: Option[] = useMemo(() => {
    const uniqueRoles = adminList.reduce((acc, admin) => {
      if (admin.role && !acc.find(r => r.value === admin.role!.id.toString())) {
        acc.push({
          value: admin.role.id.toString(),
          label: admin.role.name,
        });
      }
      return acc;
    }, [] as Option[]);
    
    return uniqueRoles;
  }, [adminList]);
  // #endregion

  // #region 데이터 로드
  const loadAdminData = useCallback(async (filters?: Partial<SearchFilters>) => {
    try {
      setLoading(true);
      const searchParams = {
        page: 1,
        limit: 100,
        ...(filters?.account && { account: filters.account }),
        ...(filters?.name && { name: filters.name }),
        ...(filters?.email && { email: filters.email }),
        ...(filters?.roleId && { roleId: parseInt(filters.roleId) }),
      };

      const result = await searchAdmin(searchParams);
      
      if (result.success) {
        setAdminList(result.data?.data || []);
      } else {
        console.error('관리자 목록 로드 실패:', '데이터 로드에 실패했습니다.');
        setAdminList([]);
      }
    } catch (error) {
      console.error('관리자 목록 로드 중 오류:', error);
      setAdminList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen, loadAdminData]);
  // #endregion

  // #region 검색 관련 핸들러
  const handleSearch = useCallback(() => {
    const activeFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key as keyof SearchFilters] = value.trim();
      }
      return acc;
    }, {} as Partial<SearchFilters>);

    loadAdminData(activeFilters);
  }, [searchFilters, loadAdminData]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      account: '',
      name: '',
      email: '',
      roleId: '',
    };
    setSearchFilters(resetFilters);
    loadAdminData({});
  }, [loadAdminData]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);
  // #endregion

  // #region 이벤트 핸들러
  const handleAdminSelect = useCallback((admin: Admin) => {
    onSelect(admin);
    onClose();
  }, [onSelect, onClose]);

  const handleRowClick = useCallback((admin: Admin) => {
    handleAdminSelect(admin);
  }, [handleAdminSelect]);
  // #endregion

  // #region 검색 필드 구성
  const searchFields = useMemo(() => [
    {
      key: 'account',
      label: '계정명 검색',
      element: (
        <FieldText
          id="search-account"
          label="계정명"
          placeholder="계정명을 입력하세요"
          value={searchFilters.account}
          onChange={(value) => updateFilter('account', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
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
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'email',
      label: '이메일 검색',
      element: (
        <FieldEmail
          id="search-email"
          label="이메일"
          placeholder="이메일을 입력하세요"
          value={searchFilters.email}
          onChange={(value) => updateFilter('email', value)}
          showValidation={false}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'roleId',
      label: '권한 검색',
      element: (
        <FieldSelect
          id="search-role"
          label="권한"
          placeholder="권한을 선택하세요"
          options={roleOptions}
          value={searchFilters.roleId}
          onChange={(value) => updateFilter('roleId', value)}
        />
      ),
      visible: true,
    },
  ], [searchFilters, roleOptions, updateFilter, handleKeyDown]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<Admin>[] = [
    {
      key: 'id',
      header: 'ID',
      minWidth: '80px',
      align: 'center',
    },
    {
      key: 'account',
      header: '계정명',
      align: 'start',
      minWidth: '120px',
    },
    {
      key: 'name',
      header: '이름',
      align: 'start',
      minWidth: '140px',
    },
    {
      key: 'email',
      header: '이메일',
      align: 'start',
      minWidth: '200px',
    },
    {
      key: 'phone',
      header: '연락처',
      align: 'center',
      minWidth: '160px',
    },
    {
      key: 'role',
      header: '권한',
      align: 'center',
      minWidth: '100px',
      cell: (item: Admin) => item.role?.name || '-',
    },
    {
      key: 'parkinglotId',
      header: '주차장 ID',
      align: 'center',
      minWidth: '120px',
      cell: (item: Admin) => item.parkinglotId || '-',
    },
    {
      header: '선택',
      align: 'center',
      minWidth: '140px',
      cell: (item: Admin) => (
        <Button
          size="sm"
          variant={selectedAdminId === item.id ? "primary" : "outline"}
          onClick={(e) => {
            e.stopPropagation();
            handleAdminSelect(item);
          }}
        >
          {selectedAdminId === item.id ? '선택됨' : '선택'}
        </Button>
      ),
    },
  ];
  // #endregion

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="xl"
      className="max-h-[90vh] overflow-hidden"
    >
      <div className="flex flex-col gap-4 h-[80vh]">
        {/* 검색 섹션 */}
        <div className="flex-shrink-0">
          <AdvancedSearch
            fields={searchFields}
            onSearch={handleSearch}
            onReset={handleReset}
            defaultOpen={true}
          />
        </div>
        
        {/* 테이블 섹션 */}
        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-muted-foreground">로딩 중...</div>
            </div>
          ) : (
            <PaginatedTable
              data={adminList}
              columns={columns}
              onRowClick={handleRowClick}
              pageSize={10}
              pageSizeOptions={[5, 10, 20]}
              itemName="근무자"
              className="h-full"
              getRowClassName={(item: Admin) => 
                selectedAdminId === item.id ? 'bg-primary/5 hover:bg-primary/10' : ''
              }
            />
          )}
        </div>
        
        {/* 액션 버튼 */}
        <div className="flex gap-2 justify-end pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            취소
          </Button>
        </div>
      </div>
    </Modal>
  );
}
