# 테이블 시스템 (A + x, A + y 구조)

우리의 테이블 시스템은 **컴포짓 패턴**을 사용하여 기능별로 명확하게 분리된 세 가지 컴포넌트를 제공한다.

## 아키텍처 개요

```
A (BaseTable)        → 순수 테이블 기능
A+x (InfiniteTable)  → BaseTable + 무한스크롤
A+y (PaginatedTable) → BaseTable + 페이지네이션
```

각 컴포넌트는 **단일 책임 원칙**을 따르며, 필요에 따라 조합하여 사용할 수 있다.

## 1. BaseTable (A) - 순수 테이블

가장 기본적인 테이블 컴포넌트로, 핵심 테이블 기능만 제공한다.

### 주요 기능
- 데이터 렌더링
- 정렬 기능 
- 긴 텍스트 모달 표시
- RTL 언어 지원
- 로딩 상태 처리

### 사용법
```tsx
import { BaseTable, BaseTableColumn } from '@/components/ui/ui-data/baseTable/BaseTable';

const columns: BaseTableColumn<User>[] = [
  { key: 'id', header: 'ID', sortable: true, align: 'center' },
  { key: 'name', header: '이름', sortable: true },
  { key: 'email', header: '이메일' },
];

<BaseTable 
  data={users} 
  columns={columns}
  onRowClick={(user, index) => console.log(user)}
/>
```

### 언제 사용하나?
- 간단한 데이터 목록 표시
- 정렬 기능만 필요한 경우
- 페이지네이션이나 무한스크롤이 불필요한 소규모 데이터

## 2. InfiniteTable (A+x) - 무한스크롤 테이블

BaseTable에 무한스크롤 기능을 추가한 컴포넌트다.

### 추가 기능
- 스크롤 끝 감지를 통한 자동 데이터 로드
- 로딩 인디케이터 표시
- 스크롤 위치 유지

### 사용법
```tsx
import { InfiniteTable, BaseTableColumn } from '@/components/ui/ui-data/infiniteTable/InfiniteTable';

<InfiniteTable
  data={users}
  columns={columns}
  loadMore={loadMoreUsers}
  hasMore={hasMoreUsers}
  isLoadingMore={isLoading}
  onRowClick={(user, index) => console.log(user)}
/>
```

### 언제 사용하나?
- 실시간 피드나 타임라인
- 검색 결과 목록
- 대용량 데이터의 점진적 로딩

## 3. PaginatedTable (A+y) - 페이지네이션 테이블

BaseTable에 페이지네이션 기능을 추가한 컴포넌트다.

### 추가 기능
- 페이지 번호 네비게이션
- 페이지 크기 조절
- 총 항목 수 표시
- 클라이언트/서버 사이드 페이지네이션 지원

### 사용법
```tsx
import { PaginatedTable, BaseTableColumn } from '@/components/ui/ui-data/paginatedTable/PaginatedTable';

<PaginatedTable
  data={allUsers}
  columns={columns}
  currentPage={currentPage}
  pageSize={pageSize}
  onPageChange={setCurrentPage}
  onPageSizeChange={setPageSize}
  itemName="사용자"
/>
```

### 언제 사용하나?
- 관리자 패널의 사용자 목록
- 제품 카탈로그
- 대용량 데이터의 체계적 탐색

## 기존 컴포넌트와의 비교

| 기존 | 새로운 구조 | 상태 |
|------|-------------|------|
| SmartTable | BaseTable + InfiniteTable | 유지 (호환성) |
| InfiniteSmartTable | InfiniteTable | 제거 예정 |
| DataTable | PaginatedTable | 대체 권장 |

## 마이그레이션 가이드

### 1. InfiniteSmartTable → InfiniteTable
```tsx
// 기존
<InfiniteSmartTable 
  isFetching={loading}
  loadMore={loadMore}
  hasMore={hasMore}
/>

// 새로운 방식
<InfiniteTable
  isLoadingMore={loading}  // prop명 변경
  loadMore={loadMore}
  hasMore={hasMore}
/>
```

### 2. DataTable → PaginatedTable
```tsx
// 기존 
<DataTable 
  data={users}
  columns={columns}
  currentPage={page}
  onPageChange={setPage}
/>

// 새로운 방식 (동일)
<PaginatedTable
  data={users}
  columns={columns}
  currentPage={page}
  onPageChange={setPage}
/>
```

## 성능과 번들 크기

### 번들 크기 최적화
```tsx
// 필요한 기능만 import
import { BaseTable } from '@/components/ui/ui-data/baseTable/BaseTable';      // 가벼움
import { InfiniteTable } from '@/components/ui/ui-data/infiniteTable/InfiniteTable';  // 중간
import { PaginatedTable } from '@/components/ui/ui-data/paginatedTable/PaginatedTable'; // 가장 큼
```

### 확장성
새로운 기능이 필요하면 기존 BaseTable을 기반으로 쉽게 조합할 수 있다:
```
A+z (VirtualizedTable)  → BaseTable + 가상화
A+w (FilterableTable)   → BaseTable + 필터링
A+x+z                   → BaseTable + 무한스크롤 + 가상화
```

## 권장사항

1. **간단한 목록**: BaseTable 사용
2. **실시간 피드**: InfiniteTable 사용  
3. **관리 페이지**: PaginatedTable 사용
4. **점진적 마이그레이션**: 기존 컴포넌트는 당분간 유지하되, 새로운 개발에는 새 구조 사용

이 구조를 통해 각 컴포넌트의 역할이 명확해지고, 필요한 기능만 선택하여 사용할 수 있어 개발 효율성과 성능이 모두 향상된다. 