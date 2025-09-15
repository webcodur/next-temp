/* 메뉴 설명: 앱 게시판 목록 관리 */
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

// 데이터 및 타입
import { getAppBoardList } from '@/data/mockAppBoardData';
import { AppBoard, ENUM_APP_BOARD_STATUS, APP_BOARD_STATUS_LABELS, APP_BOARD_CATEGORIES } from '@/types/appBoard';
import { Option } from '@/components/ui/ui-input/field/core/types';

// #region 검색 필터 인터페이스
interface SearchFilters {
  title: string;
  category: string;
  status: string;
  authorName: string;
}
// #endregion

export default function AppBoardListPage() {
  const router = useRouter();
  
  // #region 상태 관리
  const [appBoardList, setAppBoardList] = useState<AppBoard[]>([]);
  
  // 검색 필터 상태
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    title: '',
    category: '',
    status: '',
    authorName: '',
  });
  
  // 다이얼로그 관련 상태
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  // #endregion

  // #region 옵션 생성
  const categoryOptions: Option[] = useMemo(() => [
    ...APP_BOARD_CATEGORIES,
  ], []);

  const statusOptions: Option[] = useMemo(() => [
    ...Object.values(ENUM_APP_BOARD_STATUS).map(status => ({
      value: status,
      label: APP_BOARD_STATUS_LABELS[status]
    })),
  ], []);
  // #endregion

  // #region 데이터 로드
  const loadAppBoardData = useCallback(async (filters?: Partial<SearchFilters>) => {
    try {
      const searchParams = {
        ...(filters?.title && { title: filters.title }),
        ...(filters?.category && { category: filters.category }),
        ...(filters?.status && { status: filters.status as ENUM_APP_BOARD_STATUS }),
        ...(filters?.authorName && { authorName: filters.authorName }),
      };

      const result = getAppBoardList(searchParams);
      setAppBoardList(result);
    } catch (error) {
      console.error('앱 게시판 목록 로드 중 오류:', error);
      setAppBoardList([]);
    }
  }, []);

  useEffect(() => {
    loadAppBoardData();
  }, [loadAppBoardData]);
  // #endregion

  // #region 검색 관련 핸들러
  const handleSearch = useCallback(() => {
    const activeFilters = Object.entries(searchFilters).reduce((acc, [key, value]) => {
      if (value.trim()) {
        acc[key as keyof SearchFilters] = value.trim();
      }
      return acc;
    }, {} as Partial<SearchFilters>);

    loadAppBoardData(activeFilters);
  }, [searchFilters, loadAppBoardData]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      title: '',
      category: '',
      status: '',
      authorName: '',
    };
    setSearchFilters(resetFilters);
    loadAppBoardData({}); // 빈 필터로 전체 데이터 로드
  }, [loadAppBoardData]);

  const updateFilter = useCallback((field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);
  // #endregion

  // #region 이벤트 핸들러
  const handleCreateClick = useCallback(() => {
    router.push('/life/app/board/create');
  }, [router]);

  const handleRowClick = useCallback((appBoard: AppBoard, _index: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    router.push(`/life/app/board/${appBoard.id}`);
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

  const handleCopyClick = useCallback((appBoardId: number) => {
    const targetAppBoard = appBoardList.find(board => board.id === appBoardId);
    if (!targetAppBoard) {
      setDialogMessage('복사할 게시글 정보를 찾을 수 없습니다.');
      setErrorDialogOpen(true);
      return;
    }
    
    router.push(`/life/app/board/create?copyFrom=${appBoardId}`);
  }, [router, appBoardList]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;

    try {
      // 목업 데이터에서 삭제 시뮬레이션
      alert('게시글이 삭제되었습니다. (목업 데이터)');
      setAppBoardList((prev) => prev.filter((board) => board.id !== deleteTargetId));
      setDialogMessage('게시글이 성공적으로 삭제되었습니다.');
      setSuccessDialogOpen(true);
    } catch (error) {
      console.error('게시글 삭제 중 오류:', error);
      setDialogMessage('게시글 삭제 중 오류가 발생했습니다.');
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
      key: 'title',
      label: '제목 검색',
      element: (
        <FieldText
          id="search-title"
          label="제목"
          placeholder="제목을 입력하세요"
          value={searchFilters.title}
          onChange={(value) => updateFilter('title', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
    {
      key: 'category',
      label: '카테고리 검색',
      element: (
        <FieldSelect
          id="search-category"
          label="카테고리"
          placeholder="카테고리를 선택하세요"
          options={categoryOptions}
          value={searchFilters.category}
          onChange={(value) => updateFilter('category', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'status',
      label: '상태 검색',
      element: (
        <FieldSelect
          id="search-status"
          label="상태"
          placeholder="상태를 선택하세요"
          options={statusOptions}
          value={searchFilters.status}
          onChange={(value) => updateFilter('status', value)}
        />
      ),
      visible: true,
    },
    {
      key: 'authorName',
      label: '작성자 검색',
      element: (
        <FieldText
          id="search-author"
          label="작성자"
          placeholder="작성자명을 입력하세요"
          value={searchFilters.authorName}
          onChange={(value) => updateFilter('authorName', value)}
          showSearchIcon={true}
          onKeyDown={handleKeyDown}
        />
      ),
      visible: true,
    },
  ], [searchFilters, categoryOptions, statusOptions, updateFilter, handleKeyDown]);
  // #endregion

  // #region 컬럼 정의
  const columns: BaseTableColumn<AppBoard>[] = [
    {
      key: 'id',
      header: 'ID',
      minWidth: '80px',
      align: 'center',
    },
    {
      key: 'title',
      header: '제목',
      align: 'start',
      minWidth: '200px',
      cell: (item: AppBoard) => (
        <div className="flex items-center gap-2">
          <span className={item.isFixed ? 'font-bold text-primary' : ''}>
            {item.title}
          </span>
          {item.isFixed && (
            <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded">
              고정
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: '카테고리',
      align: 'center',
      minWidth: '120px',
      cell: (item: AppBoard) => {
        const categoryLabel = APP_BOARD_CATEGORIES.find(cat => cat.value === item.category)?.label || item.category;
        return categoryLabel;
      },
    },
    {
      key: 'status',
      header: '상태',
      align: 'center',
      minWidth: '100px',
      cell: (item: AppBoard) => {
        const statusLabel = APP_BOARD_STATUS_LABELS[item.status];
        const statusColor = item.status === ENUM_APP_BOARD_STATUS.PUBLISHED 
          ? 'text-green-600 bg-green-50' 
          : item.status === ENUM_APP_BOARD_STATUS.DRAFT
          ? 'text-orange-600 bg-orange-50'
          : 'text-gray-600 bg-gray-50';
        
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        );
      },
    },
    {
      key: 'viewCount',
      header: '조회수',
      align: 'center',
      minWidth: '100px',
      cell: (item: AppBoard) => item.viewCount.toLocaleString(),
    },
    {
      key: 'authorName',
      header: '작성자',
      align: 'center',
      minWidth: '120px',
    },
    {
      key: 'createdAt',
      header: '작성일자',
      align: 'center',
      minWidth: '170px',
      type: 'datetime',
    },
    {
      header: '관리',
      align: 'center',
      minWidth: '140px',
      cell: (item: AppBoard) => (
        <div className="flex gap-1 justify-center">
          <CrudButton
            action="copy"
            iconOnly
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyClick(item.id);
            }}
            title="게시글 복사"
          />
          <CrudButton
            action="delete"
            iconOnly
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item.id);
            }}
            title="게시글 삭제"
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
        title="앱 게시판" 
        subtitle="앱 사용자를 위한 게시글 관리"
        rightActions={
          <CrudButton
            action="create"
            size="default"
            onClick={handleCreateClick}
            title="게시글 추가"
          />
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
        data={appBoardList}
        columns={columns}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
        itemName="게시글"
      />

      {/* 삭제 확인 다이얼로그 */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="게시글 삭제 확인"
        size="md"
        onConfirm={handleDeleteConfirm}
      >
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">정말로 삭제하시겠습니까?</h3>
            <p className="text-muted-foreground">
              이 작업은 되돌릴 수 없습니다. 게시글이 영구적으로 삭제됩니다.
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
