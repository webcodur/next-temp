/**
 * 메뉴 검색 훅
 * - 메뉴 데이터를 기반으로 통합 검색 기능 제공
 * - Top > Mid > Bot 계층 구조 지원
 */

import { useMemo, useState, useCallback } from 'react';
import { menuData } from '@/data/menuData';
import type { MenuSearchResult, SearchFilter } from '@/components/view/_etc/menu-search/menu-search.type';

// #region 기본 설정
const DEFAULT_FILTER: SearchFilter = {
  includeTop: true,
  includeMid: true,
  includeBot: true,
  exactMatch: false,
};
// #endregion

// #region 유틸리티 함수
/**
 * 검색어가 텍스트에 포함되는지 확인 (대소문자 무시)
 */
const isMatch = (text: string, query: string, exactMatch: boolean = false): boolean => {
  if (!query.trim()) return false;
  
  const normalizedText = text.toLowerCase().replace(/\s+/g, '');
  const normalizedQuery = query.toLowerCase().replace(/\s+/g, '');
  
  return exactMatch 
    ? normalizedText === normalizedQuery
    : normalizedText.includes(normalizedQuery);
};

/**
 * 메뉴 데이터를 평면화하여 검색 가능한 형태로 변환
 */
const flattenMenuData = (): MenuSearchResult[] => {
  const results: MenuSearchResult[] = [];
  
  Object.entries(menuData).forEach(([topKey, topItem]) => {
    const topLabel = topKey;
    
    Object.entries(topItem.midItems).forEach(([midKey, midItem]) => {
      const midLabel = midKey;
      
      midItem.botItems.forEach((botItem) => {
        const botLabel = botItem.key;
        const id = `${topKey}-${midKey}-${botItem.key}`;
        const fullPath = `${topLabel} > ${midLabel} > ${botLabel}`;
        
        results.push({
          id,
          topKey,
          topLabel,
          midKey,
          midLabel,
          botKey: botItem.key,
          botLabel,
          href: botItem.href,
          fullPath,
          matchType: 'bot', // 기본값, 검색 시 업데이트
          matchText: botLabel, // 기본값, 검색 시 업데이트
        });
      });
    });
  });
  
  return results;
};
// #endregion

// #region 검색 함수
/**
 * 메뉴 검색 실행
 */
const searchMenus = (
  query: string, 
  filter: SearchFilter = DEFAULT_FILTER
): MenuSearchResult[] => {
  const allMenus = flattenMenuData();
  
  // 검색어가 없으면 전체 메뉴 목록 반환
  if (!query.trim()) {
    return allMenus.map(menu => ({
      ...menu,
      matchType: 'bot' as const, // 기본값으로 bot 설정
      matchText: menu.botLabel,
    }));
  }
  
  const results: MenuSearchResult[] = [];
  
  allMenus.forEach((menu) => {
    let isFound = false;
    let matchType: 'top' | 'mid' | 'bot' = 'bot';
    let matchText = '';
    
    // Top 메뉴 검색
    if (filter.includeTop && isMatch(menu.topLabel, query, filter.exactMatch)) {
      isFound = true;
      matchType = 'top';
      matchText = menu.topLabel;
    }
    // Mid 메뉴 검색 (Top에서 매칭되지 않은 경우)
    else if (filter.includeMid && isMatch(menu.midLabel, query, filter.exactMatch)) {
      isFound = true;
      matchType = 'mid';
      matchText = menu.midLabel;
    }
    // Bot 메뉴 검색 (Top, Mid에서 매칭되지 않은 경우)
    else if (filter.includeBot && isMatch(menu.botLabel, query, filter.exactMatch)) {
      isFound = true;
      matchType = 'bot';
      matchText = menu.botLabel;
    }
    
    if (isFound) {
      results.push({
        ...menu,
        matchType,
        matchText,
      });
    }
  });
  
  // 검색 결과 정렬: matchType 순서 (top > mid > bot), 그 다음 텍스트 순
  return results.sort((a, b) => {
    const typeOrder = { top: 1, mid: 2, bot: 3 };
    const typeComparison = typeOrder[a.matchType] - typeOrder[b.matchType];
    
    if (typeComparison !== 0) return typeComparison;
    
    return a.fullPath.localeCompare(b.fullPath, 'ko');
  });
};
// #endregion

// #region 훅 인터페이스
interface UseMenuSearchReturn {
  // 상태
  query: string;
  results: MenuSearchResult[];
  selectedResult: MenuSearchResult | null;
  isLoading: boolean;
  
  // 액션
  setQuery: (query: string) => void;
  selectResult: (result: MenuSearchResult | null) => void;
  clearSearch: () => void;
  search: (newQuery?: string) => void;
  
  // 유틸리티
  isSearchActive: boolean;
  hasResults: boolean;
}
// #endregion

// #region 메인 훅
/**
 * 메뉴 검색 훅
 */
export const useMenuSearch = (
  defaultQuery: string = '',
  filter: Partial<SearchFilter> = {}
): UseMenuSearchReturn => {
  // #region 상태
  const [query, setQuery] = useState(defaultQuery);
  const [selectedResult, setSelectedResult] = useState<MenuSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // #endregion
  
  // #region 메모이제이션
  const searchFilter = useMemo(() => ({
    ...DEFAULT_FILTER,
    ...filter,
  }), [filter]);
  
  const results = useMemo(() => {
    return searchMenus(query, searchFilter);
  }, [query, searchFilter]);
  
  const isSearchActive = true; // 항상 활성화 (전체 목록 또는 검색 결과 표시)
  const hasResults = results.length > 0;
  // #endregion
  
  // #region 핸들러
  const selectResult = useCallback((result: MenuSearchResult | null) => {
    setSelectedResult(result);
  }, []);
  
  const clearSearch = useCallback(() => {
    setQuery('');
    setSelectedResult(null);
  }, []);
  
  const search = useCallback((newQuery?: string) => {
    if (newQuery !== undefined) {
      setQuery(newQuery);
    }
    setIsLoading(true);
    
    // 비동기 처리 시뮬레이션 (실제로는 즉시 처리됨)
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, []);
  // #endregion
  
  return {
    // 상태
    query,
    results,
    selectedResult,
    isLoading,
    
    // 액션
    setQuery,
    selectResult,
    clearSearch,
    search,
    
    // 유틸리티
    isSearchActive,
    hasResults,
  };
};
// #endregion
