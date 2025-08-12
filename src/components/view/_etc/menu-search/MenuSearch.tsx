/* 
  파일명: /components/view/menu-search/MenuSearch.tsx
  기능: 메뉴 검색 공통 컴포넌트 (페이지/모달 모드 지원)
  책임: 메뉴 검색 로직과 UI를 통합 제공
*/

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/hooks/ui-hooks/useI18n';
import { useMenuSearch } from '@/hooks/ui-hooks/useMenuSearch';
import { Portal } from '@/components/ui/ui-layout/portal/Portal';
import { X, Search } from 'lucide-react';
import type { MenuSearchProps, MenuSearchResult } from './menu-search.type';

// 하위 컴포넌트들
import { MenuSearchTable } from './MenuSearchTable';
import { ActionButtons } from './ActionButtons';

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
  const { isRTL } = useLocale();
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

  // #region 공통 콘텐츠
  const content = (
    <div className="flex flex-col h-full rounded-lg border shadow-lg bg-card border-border">
      {/* 헤더 - 타이틀과 검색대 통합 */}
      <div className="flex-shrink-0 p-4 border-b-2 border-border bg-serial-4 shadow-sm rounded-t-lg">
        <div className="flex items-center justify-between gap-6">
          {/* 좌측: 타이틀 */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-foreground">
              메뉴 검색
            </h1>
            <p className="text-sm text-muted-foreground">
              원하는 페이지를 빠르게 찾아보세요
            </p>
          </div>
          
          {/* 우측: 검색 입력 필드 */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-muted-foreground" />
              </div>
              <input
                id="menu-search"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={selectedResult ? `선택됨: ${selectedResult.fullPath}` : "메뉴명을 입력해주세요..."}
                className="block py-2.5 pr-10 pl-9 w-full rounded-lg border transition-all border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
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
          </div>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex overflow-hidden flex-col flex-1 p-2 bg-serial-1">

        {/* 메뉴 목록 테이블 (전체 목록 또는 검색 결과) */}
        <div className="flex flex-col flex-1 min-h-0 rounded-lg bg-background border border-border shadow-sm">
          <MenuSearchTable
            results={results}
            selectedResult={selectedResult}
            onResultSelect={handleResultSelect}
            isLoading={isLoading}
          />
        </div>

        {/* 액션 버튼 - 항상 표시하되 활성화/비활성화만 조절 */}
        <div className="flex-shrink-0 p-3 mt-2 border-t-2 border-border bg-serial-2 rounded-lg shadow-sm">
          <ActionButtons
            selectedResult={selectedResult}
            isLoading={isLoading}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  );
  // #endregion

  // #region 렌더링
  if (isModal) {
    // 모달 모드
    return (
      <div 
        className="flex fixed inset-0 z-50 justify-center items-center font-multilang"
        style={{ 
          backgroundColor: `hsla(var(--modal-overlay))`,
          fontFamily: "'MultiLang', 'Pretendard', 'Inter', 'Cairo', system-ui, sans-serif"
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
        onClick={handleClose}
      >
        <div 
          className="mx-4 w-full max-w-3xl h-[70vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  } else {
    // 페이지 모드
    return (
      <Portal containerId="menu-search-portal">
        <div 
          className={`flex fixed inset-0 z-50 justify-center items-center bg-background font-multilang`}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{ 
            fontFamily: "'MultiLang', 'Pretendard', 'Inter', 'Cairo', system-ui, sans-serif"
          }}
        >
          <div className="mx-4 w-full max-w-3xl">
            {content}
          </div>
        </div>
      </Portal>
    );
  }
  // #endregion
}
