/**
 * 메뉴 검색 관련 타입 정의
 * - 검색 결과, 메뉴 아이템, 검색 상태 등을 정의
 */

// #region 검색 결과 타입
/**
 * 메뉴 검색 결과 아이템
 * - 계층 구조를 포함한 메뉴 정보
 */
export interface MenuSearchResult extends Record<string, unknown> {
  id: string; // 고유 식별자 (top-mid-bot 조합)
  topKey: string; // 최상위 메뉴 키
  topLabel: string; // 최상위 메뉴 표시명
  midKey: string; // 중위 메뉴 키
  midLabel: string; // 중위 메뉴 표시명
  botKey: string; // 하위 메뉴 키
  botLabel: string; // 하위 메뉴 표시명
  href: string; // 페이지 경로
  fullPath: string; // 전체 경로 (aaa > bbb > ccc)
  matchType: 'top' | 'mid' | 'bot'; // 매칭된 레벨
  matchText: string; // 매칭된 텍스트
}

/**
 * 검색 상태
 */
export interface MenuSearchState {
  query: string; // 검색 쿼리
  results: MenuSearchResult[]; // 검색 결과
  selectedResult: MenuSearchResult | null; // 선택된 결과
  isLoading: boolean; // 로딩 상태
}
// #endregion

// #region 검색 필터 타입
/**
 * 검색 필터 옵션
 */
export interface SearchFilter {
  includeTop: boolean; // 상위 메뉴 검색 포함
  includeMid: boolean; // 중위 메뉴 검색 포함
  includeBot: boolean; // 하위 메뉴 검색 포함
  exactMatch: boolean; // 정확히 일치하는 결과만
}
// #endregion

// #region 컴포넌트 Props 타입
/**
 * MenuSearch 컴포넌트 Props
 */
export interface MenuSearchProps {
  isModal?: boolean; // 모달 모드 여부
  onSelectionComplete?: (result: MenuSearchResult) => void; // 선택 완료 콜백
  onClose?: () => void; // 모달 닫기 콜백
  defaultQuery?: string; // 기본 검색어
  filter?: Partial<SearchFilter>; // 검색 필터 (선택사항)
}

/**
 * SelectedMenuCard 컴포넌트 Props  
 */
export interface SelectedMenuCardProps {
  selectedResult: MenuSearchResult | null;
}

/**
 * MenuSearchTable 컴포넌트 Props
 */
export interface MenuSearchTableProps {
  results: MenuSearchResult[];
  selectedResult: MenuSearchResult | null;
  onResultSelect: (result: MenuSearchResult) => void;
  isLoading?: boolean;
}
// #endregion
