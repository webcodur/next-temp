/* 메뉴 설명: 페이지 기능 설명 */
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Plus, Trash2, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldEmail from '@/components/ui/ui-input/field/text/FieldEmail';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';

// API 호출
import { searchAdmin } from '@/services/admin/admin$_GET';
import { deleteAdmin } from '@/services/admin/admin@id_DELETE';

// 타입 정의
import { Admin } from '@/types/admin';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 검색 필터 인터페이스
interface SearchFilters {
  account: string;
  name: string;
  email: string;
  roleId: string;
}
// #endregion

export default function AdminListPage() {
  const router = useRouter();
  
  // #region 상태 관리
  const [adminList, setAdminList] = useState<Admin[]>([]);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    account: '',
    name: '',
    email: '',
    roleId: '',
  });
  
  // 다이얼로그 관련 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 권한 옵션 생성
  const roleOptions: Option[] = useMemo(() => {
    // 현재 로드된 관리자들의 role 정보에서 unique한 role들을 추출
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
      const searchParams = {
        page: 1,
        limit: 100, // 임시로 큰 수치 설정
        ...(filters?.account && { account: filters.account }),
        ...(filters?.name && { name: filters.name }),
        ...(filters?.email && { email: filters.email }),
        ...(filters?.roleId && { roleId: parseInt(filters.roleId) }),
      };

      const result = await searchAdmin(searchParams);
      
      if (result.success) {
        setAdminList(result.data?.data || []);
      } else {
        console.error('관리자 목록 로드 실패:', result.errorMsg);
        setAdminList([]);
      }
    } catch (error) {
      console.error('관리자 목록 로드 중 오류:', error);
      setAdminList([]);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);
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
    loadAdminData({}); // 빈 필터로 전체 데이터 로드
  }, [loadAdminData]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  // #endregion

  // #region 이벤트 핸들러
  const handleCreateClick = useCallback(() => {
    router.push('/parking/lot/admin/create');
  }, [router]);

  const handleRowClick = useCallback((admin: Admin, _index: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    console.log('handleRowClick 호출, admin:', admin, 'adminId:', admin.id);
    console.log('이동할 경로:', `/parking/lot/admin/${admin.id}`);
    router.push(`/parking/lot/admin/${admin.id}`);
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

  const handleCopyClick = useCallback((adminId: number) => {
    router.push(`/parking/lot/admin/create?copyFrom=${adminId}`);
  }, [router]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteAdmin({ id: deleteTargetId });
      
      if (result.success) {
        setAdminList((prev) => prev.filter((admin) => admin.id !== deleteTargetId));
        setDialogMessage('관리자가 성공적으로 삭제되었습니다.');
        setSuccessDialogOpen(true);
      } else {
        setDialogMessage(`관리자 삭제에 실패했습니다: ${result.errorMsg}`);
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('관리자 삭제 중 오류:', error);
      setDialogMessage('관리자 삭제 중 오류가 발생했습니다.');
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
      width: '6%',
      align: 'center',
    },
    {
      key: 'account',
      header: '계정명',
      align: 'start',
      width: '10%',
    },
    {
      key: 'name',
      header: '이름',
      align: 'start',
      width: '12%',
    },
    {
      key: 'email',
      header: '이메일',
      align: 'start',
      width: '17%',
    },
    {
      key: 'phone',
      header: '연락처',
      align: 'center',
      width: '13%',
    },
    {
      key: 'role',
      header: '권한',
      align: 'center',
      width: '8%',
      cell: (item: Admin) => item.role?.name || '-',
    },
    {
      key: 'parkinglotId',
      header: '주차장 ID',
      align: 'center',
      width: '10%',
      cell: (item: Admin) => item.parkinglotId || '-',
    },
    {
      key: 'createdAt',
      header: '등록일자',
      align: 'center',
      width: '14%',
      cell: (item: Admin) => {
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
      width: '12%',
      cell: (item: Admin) => (
        <div className="flex gap-1 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyClick(item.id);
            }}
            title="관리자 정보 복사"
          >
            <Copy size={16} />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item.id);
            }}
            title="관리자 삭제"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];
  // #endregion

  // #region 렌더링
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="관리자 계정 관리" 
        subtitle="시스템 관리자 계정 등록, 수정, 삭제 및 권한 관리"
        rightActions={
          <Button
            variant="primary"
            size="default"
            onClick={handleCreateClick}
            title="관리자 추가"
          >
            <Plus size={16} />
          </Button>
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
        data={adminList}
        columns={columns}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName="관리자"
      />

      {/* 삭제 확인 다이얼로그 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="관리자 삭제 확인"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 관리자 정보가 영구적으로 삭제됩니다.
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