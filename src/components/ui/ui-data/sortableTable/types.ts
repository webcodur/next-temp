/*
  파일명: sortableTable/types.ts
  기능: SortableTable 컴포넌트 타입 정의
  책임: DND 가능한 테이블의 인터페이스 정의
*/

import { BaseTableColumn } from '../baseTable/types';

// #region 기본 타입
export interface SortableTableColumn<T = unknown> extends BaseTableColumn<T> {
  // 추가 속성이 필요한 경우 여기에 정의
  sortable?: boolean;
}

export interface SortableTableProps<T extends { id?: string | number }> {
  // 데이터 관련
  data: T[];
  columns: SortableTableColumn<T>[];
  
  // 스타일링
  className?: string;
  headerClassName?: string;
  getRowClassName?: string | ((item: T, index: number) => string);
  cellClassName?: string;
  
  // 드래그 앤 드롭 관련
  dragHandleColumn?: string; // 드래그 핸들을 표시할 컬럼 key
  onOrderChange: (newOrder: T[]) => void; // 순서 변경 콜백
  
  // 테이블 옵션
  loadingRows?: number;
  onRowClick?: (item: T, index: number) => void;
  minWidth?: string | number;
  
  // 접근성
  itemName?: string; // 아이템 명칭 (스크린 리더용)
}

export interface SortableRowProps<T extends { id?: string | number }> {
  item: T;
  index: number;
  columns: SortableTableColumn<T>[];
  dragHandleColumn?: string;
  getRowClassName?: string | ((item: T, index: number) => string);
  cellClassName?: string;
  onRowClick?: (item: T, index: number) => void;
}
// #endregion
