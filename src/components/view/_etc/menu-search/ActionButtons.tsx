/* 
  파일명: /components/view/menu-search/ActionButtons/ActionButtons.tsx
  기능: 메뉴 검색 액션 버튼 영역
  책임: 이동 버튼과 로딩 상태 관리
*/

'use client';

import { ExternalLink, Loader2 } from 'lucide-react';

import type { MenuSearchResult } from './menu-search.type';

// #region 타입
interface ActionButtonsProps {
  selectedResult: MenuSearchResult | null;
  isLoading: boolean;
  onNavigate: () => void;
}
// #endregion

export function ActionButtons({ selectedResult, isLoading, onNavigate }: ActionButtonsProps) {
  // #region 렌더링
  return (
    <div className="flex gap-3 justify-end">
      
      {/* 이동 버튼 */}
      <button
        onClick={onNavigate}
        disabled={!selectedResult || isLoading}
        className={`px-8 py-3 rounded-lg font-medium transition-all min-w-32 flex items-center gap-2 ${
          (!selectedResult || isLoading) 
            ? 'neu-flat opacity-50 cursor-not-allowed text-muted-foreground bg-counter-2' 
            : 'neu-raised bg-primary text-primary-foreground hover:scale-[1.02]'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>이동 중...</span>
          </>
        ) : (
          <>
            <ExternalLink size={16} />
            <span>이동</span>
          </>
        )}
      </button>
    </div>
  );
  // #endregion
}
