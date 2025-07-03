# Pagination 시스템 기술 문서

## 아키텍처 개요

모듈화된 페이지네이션 시스템으로, 독립적인 훅과 컴포넌트들의 조합으로 구성됩니다.

## 핵심 훅 시스템

### usePaginationState
```typescript
// 완전한 페이지네이션 상태 관리
const {
  currentPage,
  totalPages,
  paginatedData,
  goToPage
} = usePaginationState(data, itemsPerPage);
```

### usePaginationNavigation  
```typescript
// 네비게이션 로직 처리
const {
  visiblePages,
  canGoPrev,
  canGoNext
} = usePaginationNavigation(currentPage, totalPages, maxVisible);
```

### usePaginationData
```typescript
// 데이터 슬라이싱 및 인덱싱
const {
  paginatedData,
  startIndex,
  endIndex
} = usePaginationData(data, currentPage, itemsPerPage);
```

## 컴포넌트 계층구조

```
PaginatedTable (최상위 통합)
├── PaginationControls (완전한 컨트롤)
│   ├── PaginationInfo (정보 표시)
│   ├── PageSizeSelector (크기 선택)
│   └── Pagination (네비게이션)
└── Table (데이터 표시)
```

## 타입 시스템

### 제네릭 활용
```typescript
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  sortable?: boolean;
}
```

### 페이지네이션 상태
```typescript
interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
```

## 성능 최적화

### 메모이제이션
- 컴포넌트 레벨: React.memo
- 계산 레벨: useMemo  
- 콜백 레벨: useCallback

### 지연 평가
```typescript
const paginatedData = useMemo(() => 
  data.slice(startIndex, endIndex),
  [data, startIndex, endIndex]
);
```

## 유틸리티 함수

### calculateVisiblePages
페이지 번호 범위 계산

### getPageInfo  
현재 페이지 정보 생성

### validatePageNumber
페이지 번호 유효성 검사 