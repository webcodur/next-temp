/* 
  파일명: /components/view/menu-search/MenuSearch.tsx
  기능: 메뉴 검색 공통 컴포넌트 (페이지/모달 모드 지원)
  책임: 메뉴 검색 로직과 UI를 통합 제공
*/

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMenuSearch } from '@/hooks/ui-hooks/useMenuSearch';
import { X, Search, ExternalLink, ArrowRight, Check } from 'lucide-react';
import type { MenuSearchProps, MenuSearchResult } from './menu-search.type';

// 공통 모듈 import
import { 
  SelectionDialog,
  type HeaderConfig,
  type ActionButtonConfig,
  type EmptyStateConfig
} from '@/components/ui/ui-layout/selection-dialog';
import { BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';

export default function MenuSearch({ 
  isModal = false, 
  onSelectionComplete,
  onClose,
  defaultQuery = ''
}: MenuSearchProps) {
  // #region 상태
  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  // #endregion

  // #region 훅
  const router = useRouter();
  const {
    results,
    selectedResult,
    isLoading,
    setQuery,
    selectResult,
    clearSearch,
  } = useMenuSearch(defaultQuery);
  // #endregion

  // #region 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResultSelect = (result: MenuSearchResult) => {
    selectResult(result);
  };

  const handleNavigate = () => {
    if (!selectedResult) return;
    
    if (isModal) {
      // 모달 모드: 모달 닫기 후 페이지 이동
      onClose?.();
      onSelectionComplete?.(selectedResult);
    }
    
    // 페이지 이동
    router.push(selectedResult.href);
  };

  const handleClose = useCallback(() => {
    if (isModal) {
      onClose?.();
      clearSearch();
    }
  }, [isModal, onClose, clearSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearch();
  };
  // #endregion

  // #region 이펙트
  // 검색어 변경 시 디바운싱
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setQuery(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, setQuery]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isModal) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModal, handleClose]);
  // #endregion

  // #region 설정 객체들
  const headerConfig: HeaderConfig = useMemo(() => ({
    title: '메뉴 검색',
    description: '원하는 페이지를 빠르게 찾아보세요'
  }), []);

  const actionButtonConfig: ActionButtonConfig = useMemo(() => ({
    label: '이동',
    loadingLabel: '이동 중...',
    icon: ExternalLink
  }), []);

  const emptyStateConfig: EmptyStateConfig = useMemo(() => ({
    icon: Search,
    title: '검색 결과가 없습니다',
    description: '입력하신 키워드와 일치하는 메뉴를 찾을 수 없습니다',
    tips: [
      '다른 키워드로 검색해보세요',
      '메뉴명의 일부분만 입력해보세요',
      '띄어쓰기 없이 검색해보세요'
    ]
  }), []);

  // 테이블 컬럼 정의
  const columns: BaseTableColumn<MenuSearchResult>[] = useMemo(() => [
    {
      key: 'fullPath',
      header: '메뉴 경로',
      align: 'start',
      cell: (item) => (
        <div className="flex gap-2 items-center">
          {/* 메뉴 경로 */}
          <div className="flex gap-1 items-center text-sm">
            <span className="text-foreground">
              {item.topLabel}
            </span>
            <ArrowRight size={12} className="text-muted-foreground" />
            <span className="text-foreground">
              {item.midLabel}
            </span>
            <ArrowRight size={12} className="text-muted-foreground" />
            <span className="text-foreground">
              {item.botLabel}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'href',
      header: '경로',
      align: 'start',
      width: '200px',
      render: (value) => (
        <div className="flex gap-2 items-center">
          <code className="px-2 py-1 text-xs rounded bg-counter-1 text-muted-foreground">
            {value as string}
          </code>
          <ExternalLink size={12} className="text-muted-foreground" />
        </div>
      )
    },
    {
      header: '선택',
      align: 'center',
      width: '80px',
      cell: (item) => (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto border-2 transition-all ${
          selectedResult?.id === item.id
            ? 'border-primary bg-primary'
            : 'border-border bg-card hover:border-primary hover:border-opacity-60'
        }`}>
          {selectedResult?.id === item.id && (
            <Check className="w-3 h-3 text-primary-foreground" />
          )}
        </div>
      )
    },
  ], [selectedResult]);
  // #endregion

  // #region 검색 컨트롤 (검색 입력)
  const searchControl = (
    <div className="relative h-12">
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-primary" />
      </div>
      <input
        id="menu-search"
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={selectedResult ? `선택됨: ${selectedResult.botLabel}` : "메뉴명을 입력해주세요..."}
        className="block h-full py-3 pr-10 pl-11 w-full rounded-lg border transition-all border-primary-2 bg-primary-0 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      {searchQuery && (
        <button
          onClick={handleClearSearch}
          className="flex absolute inset-y-0 right-0 items-center pr-3 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
  // #endregion

  // #region 렌더링
  return (
    <SelectionDialog
      isModal={isModal}
      items={results}
      selectedItem={selectedResult}
      isLoading={isLoading}
      header={headerConfig}
      actionButton={actionButtonConfig}
      emptyState={emptyStateConfig}
      columns={columns}
      searchControl={searchControl}
      onItemSelect={handleResultSelect}
      onConfirm={handleNavigate}
      onClose={handleClose}
      onSelectionComplete={onSelectionComplete}
    />
  );
  // #endregion
}
