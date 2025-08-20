/**
 * 메뉴 검색 컴포넌트 데모 페이지
 * - MenuSearch 컴포넌트의 다양한 사용법을 보여주는 데모
 */

'use client';

import { useState } from 'react';
import MenuSearch from '@/components/view/_etc/menu-search/MenuSearch';

interface MenuSelection {
  fullPath: string;
  href: string;
  matchType: 'top' | 'mid' | 'bot';
}

export default function MenuSearchDemo() {
  // #region 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSelection, setLastSelection] = useState<MenuSelection | null>(null);
  // #endregion

  // #region 핸들러
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleModalComplete = (result: MenuSelection) => {
    setLastSelection(result);
    setIsModalOpen(false);
  };
  // #endregion

  return (
    <div className="container p-6 mx-auto space-y-8">
      {/* 헤더 */}
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-foreground">메뉴 검색 시스템</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          시스템의 모든 메뉴를 통합 검색할 수 있는 컴포넌트입니다. 
          상위/중위/하위 메뉴를 구분없이 검색하고, 계층 구조를 직관적으로 표시합니다.
        </p>
      </div>

      {/* 기능 설명 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="p-6 rounded-lg border bg-card border-border">
          <h3 className="mb-2 text-lg font-semibold text-foreground">통합 검색</h3>
          <p className="text-sm text-muted-foreground">
            상위, 중위, 하위 메뉴를 구분없이 한번에 검색할 수 있습니다.
          </p>
        </div>
        
        <div className="p-6 rounded-lg border bg-card border-border">
          <h3 className="mb-2 text-lg font-semibold text-foreground">계층 표시</h3>
          <p className="text-sm text-muted-foreground">
            검색 결과를 &quot;상위 &gt; 중위 &gt; 하위&quot; 형태로 직관적으로 표시합니다.
          </p>
        </div>
        
        <div className="p-6 rounded-lg border bg-card border-border">
          <h3 className="mb-2 text-lg font-semibold text-foreground">빠른 이동</h3>
          <p className="text-sm text-muted-foreground">
            검색 결과를 선택하면 해당 페이지로 즉시 이동할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 데모 버튼들 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">데모</h2>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleOpenModal}
            className="px-6 py-3 font-medium rounded-lg transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
          >
            모달 방식으로 열기
          </button>
          
          <button
            onClick={() => window.open('/lab/ui-input/menu-search/fullscreen', '_blank')}
            className="px-6 py-3 font-medium rounded-lg transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            전체화면 방식으로 열기
          </button>
        </div>
      </div>

      {/* 마지막 선택 결과 */}
      {lastSelection && (
        <div className="p-6 rounded-lg border bg-primary-0 border-primary">
          <h3 className="mb-2 text-lg font-semibold text-foreground">마지막 선택 결과</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">메뉴:</span> {lastSelection.fullPath}</p>
            <p><span className="font-medium">경로:</span> {lastSelection.href}</p>
            <p><span className="font-medium">매칭 유형:</span> {
              lastSelection.matchType === 'top' ? '상위 메뉴' :
              lastSelection.matchType === 'mid' ? '중위 메뉴' : '하위 메뉴'
            }</p>
          </div>
        </div>
      )}

      {/* 사용 예시 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">검색 예시</h2>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg bg-counter-1">
            <h4 className="mb-2 font-medium text-foreground">추천 검색어</h4>
            <div className="flex flex-wrap gap-2">
              {['주차', '관리', '설정', '규정', '위반', '블랙리스트', '세대', '주민', '차량', '캐시', 'IP'].map((keyword) => (
                <span key={keyword} className="px-2 py-1 text-xs rounded border bg-background text-foreground">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-counter-1">
            <h4 className="mb-2 font-medium text-foreground">검색 팁</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• 메뉴명의 일부만 입력해도 검색됩니다</li>
              <li>• 띄어쓰기는 무시됩니다</li>
              <li>• 대소문자를 구분하지 않습니다</li>
              <li>• 상위/중위/하위 메뉴 구분없이 검색됩니다</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <MenuSearch
          isModal={true}
          onSelectionComplete={handleModalComplete}
        />
      )}
    </div>
  );
}
