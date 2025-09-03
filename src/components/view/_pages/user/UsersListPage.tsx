/* 메뉴 설명: 사용자 관리 목록 페이지 */
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// UI 라이브러리 컴포넌트
import { Button } from '@/components/ui/ui-input/button/Button';
import { CrudButton } from '@/components/ui/ui-input/crud-button/CrudButton';
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';

// Field 컴포넌트들
import FieldText from '@/components/ui/ui-input/field/text/FieldText';
import FieldSelect from '@/components/ui/ui-input/field/select/FieldSelect';

// API 호출
import { searchUsers } from '@/services/users/users$_GET';
import { deleteUser } from '@/services/users/users@id_DELETE';

// 타입 정의
import { UserDetail, SearchUserParams } from '@/types/user';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 검색 필터 인터페이스
interface SearchParams {
  name: string;
  phone: string;
  email: string;
  gender: string;
  address1Depth: string;
  address2Depth: string;
  address3Depth: string;
}
// #endregion

export default function UsersListPage() {
  const router = useRouter();
  
  // #region 상태 관리
  const [userList, setUserList] = useState<UserDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 검색 필터 상태
  const [searchParams, setSearchParams] = useState<SearchParams>({
    name: '',
    phone: '',
    email: '',
    gender: '',
    address1Depth: '',
    address2Depth: '',
    address3Depth: '',
  });
  
  // 다이얼로그 관련 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 성별 옵션
  const genderOptions: Option[] = useMemo(() => [
    { value: 'M', label: '남성' },
    { value: 'F', label: '여성' },
  ], []);
  // #endregion

  // #region 데이터 로드
  const loadUserData = useCallback(async (searchParams?: Partial<SearchParams>) => {
    setIsLoading(true);
    try {
      const apiParams: SearchUserParams = {
        page: 1,
        limit: 100,
        ...(searchParams?.name && { name: searchParams.name }),
        ...(searchParams?.phone && { phone: searchParams.phone }),
        ...(searchParams?.email && { email: searchParams.email }),
        ...(searchParams?.gender && { gender: searchParams.gender as 'M' | 'F' }),
        ...(searchParams?.address1Depth && { address1Depth: searchParams.address1Depth }),
        ...(searchParams?.address2Depth && { address2Depth: searchParams.address2Depth }),
        ...(searchParams?.address3Depth && { address3Depth: searchParams.address3Depth }),
      };

      const result = await searchUsers(apiParams);
      
      if (result.success) {
        setUserList(result.data?.data || []);
      } else {
        console.error('사용자 목록 로드 실패:', '데이터 로드에 실패했습니다.');
        setUserList([]);
      }
    } catch (error) {
      console.error('사용자 목록 로드 중 오류:', error);
      setUserList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);
  // #endregion

  // #region 검색 관련 핸들러
  const handleSearch = useCallback(() => {
    const activeSearchParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key as keyof SearchParams] = value.trim();
      }
      return acc;
    }, {} as Partial<SearchParams>);

    loadUserData(activeSearchParams);
  }, [searchParams, loadUserData]);

  const handleReset = useCallback(() => {
    const resetParams = {
      name: '',
      phone: '',
      email: '',
      gender: '',
      address1Depth: '',
      address2Depth: '',
      address3Depth: '',
    };
    setSearchParams(resetParams);
    loadUserData({});
  }, [loadUserData]);

  const updateSearchParam = useCallback((field: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  // #endregion

  // #region 이벤트 핸들러


  const handleRowClick = useCallback((user: UserDetail, _index: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    router.push(`/parking/occupancy/user/${user.id}`);
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

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;

    try {
      const result = await deleteUser(deleteTargetId);
      
      if (result.success) {
        setUserList((prev) => prev.filter((user) => user.id !== deleteTargetId));
        setDialogMessage('사용자가 성공적으로 삭제되었습니다.');
        setSuccessDialogOpen(true);
      } else {
        setDialogMessage('사용자 삭제에 실패했습니다.');
        setErrorDialogOpen(true);
      }
    } catch (error) {
      console.error('사용자 삭제 중 오류:', error);
      setDialogMessage('사용자 삭제 중 오류가 발생했습니다.');
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
      key: 'name',
      label: '이름 검색',
      element: (
        <FieldText
          id="search-name"
          label="이름"
          placeholder="이름을 입력하세요"
          value={searchParams.name}
          onChange={(value) => updateSearchParam('name', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
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
          value={searchParams.phone}
          onChange={(value) => updateSearchParam('phone', value)}
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
        <FieldText
          id="search-email"
          label="이메일"
          placeholder="이메일을 입력하세요"
          value={searchParams.email}
          onChange={(value) => updateSearchParam('email', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
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
          options={genderOptions}
          value={searchParams.gender}
          onChange={(value) => updateSearchParam('gender', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'address1Depth',
      label: '동 정보 검색',
      element: (
        <FieldText
          id="search-address1"
          label="동 정보"
          placeholder="동 정보를 입력하세요"
          value={searchParams.address1Depth}
          onChange={(value) => updateSearchParam('address1Depth', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'address2Depth',
      label: '호수 정보 검색',
      element: (
        <FieldText
          id="search-address2"
          label="호수 정보"
          placeholder="호수 정보를 입력하세요"
          value={searchParams.address2Depth}
          onChange={(value) => updateSearchParam('address2Depth', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'address3Depth',
      label: '기타 주소 정보 검색',
      element: (
        <FieldText
          id="search-address3"
          label="기타 주소 정보"
          placeholder="기타 주소 정보를 입력하세요"
          value={searchParams.address3Depth}
          onChange={(value) => updateSearchParam('address3Depth', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
  ], [searchParams, genderOptions, updateSearchParam, handleKeyDown]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<UserDetail>[] = [
    {
      key: 'id',
      header: 'ID',
      minWidth: '80px',
      align: 'center',
    },
    {
      key: 'name',
      header: '이름',
      align: 'start',
      minWidth: '120px',
    },
    {
      key: 'phone',
      header: '전화번호',
      align: 'start',
      minWidth: '140px',
      cell: (item: UserDetail) => item.phone || '-',
    },
    {
      key: 'email',
      header: '이메일',
      align: 'start',
      minWidth: '180px',
      cell: (item: UserDetail) => item.email || '-',
    },
    {
      key: 'gender',
      header: '성별',
      align: 'center',
      minWidth: '80px',
      cell: (item: UserDetail) => {
        const genderMap = { M: '남성', F: '여성' };
        return item.gender ? genderMap[item.gender] : '-';
      },
    },
    {
      key: 'currentAddress',
      header: '현재 거주지',
      align: 'start',
      minWidth: '240px',
      cell: (item: UserDetail) => {
        const currentUsers = item.userInstance?.filter(ri => ri.instance) || [];
        if (currentUsers.length > 0) {
          return currentUsers.map(user => {
            const { address1Depth, address2Depth, address3Depth } = user.instance!;
            return `${address1Depth} ${address2Depth} ${address3Depth || ''}`.trim();
          }).join(', ');
        }
        return '거주지 없음';
      },
    },
    {
      key: 'emergencyContact',
      header: '비상연락처',
      align: 'start',
      minWidth: '140px',
      cell: (item: UserDetail) => item.emergencyContact || '-',
    },
    {
      key: 'createdAt',
      header: '등록일자',
      align: 'center',
      minWidth: '120px',
      type: 'datetime',
    },
    {
      header: '관리',
      align: 'center',
      minWidth: '120px',
      cell: (item: UserDetail) => (
        <div className="flex gap-1 justify-center">
          <CrudButton
            action="delete"
            iconOnly
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item.id);
            }}
            title="사용자 삭제"
          />
        </div>
      ),
    },
  ];
  // #endregion

  // #region 렌더링
  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="사용자 관리" 
        subtitle="사용자 등록, 수정, 삭제 및 세대 관계 관리"
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
        data={userList as unknown as Record<string, unknown>[]}
        columns={columns as unknown as BaseTableColumn<Record<string, unknown>>[]}
        onRowClick={handleRowClick as unknown as (item: Record<string, unknown>, index: number) => void}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName="사용자"
        isFetching={isLoading}
      />

      {/* 삭제 확인 다이얼로그 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="사용자 삭제 확인"
        size="md"
        onConfirm={handleDeleteConfirm}
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 사용자 정보가 영구적으로 삭제됩니다.
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
        onConfirm={() => setSuccessDialogOpen(false)}
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
        onConfirm={() => setErrorDialogOpen(false)}
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