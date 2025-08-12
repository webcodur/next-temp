/**
 * 선택 다이얼로그 공통 타입 정의
 * - 제네릭을 활용한 재사용 가능한 선택 인터페이스
 */

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';

// #region 기본 인터페이스
/**
 * 선택 가능한 아이템의 기본 인터페이스
 */
export interface SelectableItem extends Record<string, unknown> {
  id: string | number; // 고유 식별자
  name?: string; // 표시명 (선택사항)
}

/**
 * 선택 상태 인터페이스
 */
export interface SelectionState<T extends SelectableItem> {
  selectedItem: T | null; // 선택된 아이템
  isLoading: boolean; // 로딩 상태
}
// #endregion

// #region 액션 버튼 설정
/**
 * 액션 버튼 설정
 */
export interface ActionButtonConfig {
  label: string; // 버튼 텍스트
  loadingLabel: string; // 로딩 시 텍스트
  icon: LucideIcon; // 버튼 아이콘
  loadingIcon?: LucideIcon; // 로딩 시 아이콘 (기본: Loader2)
}
// #endregion

// #region 헤더 설정
/**
 * 헤더 설정
 */
export interface HeaderConfig {
  title: string; // 타이틀
  description?: string; // 설명 (선택사항)
}
// #endregion

// #region 테이블 설정
/**
 * 테이블 빈 상태 설정
 */
export interface EmptyStateConfig {
  icon: LucideIcon; // 빈 상태 아이콘
  title: string; // 빈 상태 제목
  description: string; // 빈 상태 설명
  tips?: string[]; // 팁 목록 (선택사항)
}

/**
 * 테이블 로딩 설정
 */
export interface LoadingConfig {
  message: string; // 로딩 메시지
}
// #endregion

// #region 메인 컴포넌트 Props
/**
 * SelectionDialog 메인 컴포넌트 Props
 */
export interface SelectionDialogProps<T extends SelectableItem> {
  // 모드 설정
  isModal?: boolean; // 모달 모드 여부 (기본: false)
  
  // 데이터
  items: T[]; // 선택 가능한 아이템 목록
  selectedItem: T | null; // 현재 선택된 아이템
  isLoading?: boolean; // 로딩 상태
  
  // 설정
  header: HeaderConfig; // 헤더 설정
  actionButton: ActionButtonConfig; // 액션 버튼 설정
  emptyState: EmptyStateConfig; // 빈 상태 설정
  loadingState?: LoadingConfig; // 로딩 설정
  
  // 테이블 설정
  columns: BaseTableColumn<T>[]; // 테이블 컬럼
  getRowClassName?: (item: T, index: number) => string; // 행 클래스명 함수
  
  // 검색 컨트롤 (선택사항)
  searchControl?: ReactNode; // 헤더 아래 전체 너비 검색 영역
  
  // 이벤트 핸들러
  onItemSelect: (item: T) => void; // 아이템 선택 핸들러
  onConfirm: () => void; // 확인 버튼 핸들러
  onClose?: () => void; // 닫기 핸들러 (모달 모드에서 필요)
  onSelectionComplete?: (item: T) => void; // 선택 완료 콜백
}
// #endregion

// #region 하위 컴포넌트 Props
/**
 * SelectionTable 컴포넌트 Props
 */
export interface SelectionTableProps<T extends SelectableItem> {
  items: T[];
  selectedItem: T | null;
  columns: BaseTableColumn<T>[];
  isLoading?: boolean;
  emptyState: EmptyStateConfig;
  loadingState?: LoadingConfig;
  getRowClassName?: (item: T, index: number) => string;
  onItemSelect: (item: T) => void;
}

/**
 * SelectionActionButtons 컴포넌트 Props
 */
export interface SelectionActionButtonsProps<T extends SelectableItem> {
  selectedItem: T | null;
  isLoading: boolean;
  actionButton: ActionButtonConfig;
  onConfirm: () => void;
}

/**
 * SelectedItemCard 컴포넌트 Props
 */
export interface SelectedItemCardProps<T extends SelectableItem> {
  selectedItem: T | null;
  emptyState: {
    icon: LucideIcon;
    title: string;
    description: string;
  };
  renderSelectedItem?: (item: T) => ReactNode; // 선택된 아이템 렌더링 함수
  renderEmptyState?: () => ReactNode; // 빈 상태 렌더링 함수
}
// #endregion
