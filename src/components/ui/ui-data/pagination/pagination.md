# Pagination 컴포넌트 시스템

테이블과 리스트를 위한 완전한 페이지네이션 솔루션입니다.

## 구성 컴포넌트

### PaginatedTable
데이터와 페이지네이션이 통합된 테이블 컴포넌트

### Pagination
독립적인 페이지네이션 네비게이션 컴포넌트

### PaginationControls  
페이지 크기 선택과 정보 표시가 포함된 완전한 컨트롤

### PaginationInfo
현재 페이지 정보 표시 컴포넌트

### PageSizeSelector
페이지당 아이템 수 선택 컴포넌트

## 주요 특징

- **완전한 상태 관리**: 내장된 훅 시스템
- **유연한 구성**: 컴포넌트별 독립 사용 가능
- **타입 안전성**: TypeScript 완전 지원
- **접근성**: 키보드 네비게이션 및 ARIA 지원
- **커스터마이징**: 다양한 스타일링 옵션

## 기본 사용법

### 완전한 페이지네이션 테이블

```tsx
import { PaginatedTable } from '@/components/ui/ui-data/pagination/PaginatedTable';

function MyComponent() {
  const data = [
    { id: 1, name: '김철수', email: 'kim@example.com' },
    { id: 2, name: '이영희', email: 'lee@example.com' },
    // ... 더 많은 데이터
  ];

  const columns = [
    { key: 'name', header: '이름' },
    { key: 'email', header: '이메일' }
  ];

  return (
    <PaginatedTable
      data={data}
      columns={columns}
      itemsPerPage={10}
      searchable={true}
      sortable={true}
    />
  );
}
```

### 독립적인 페이지네이션

```tsx
import { Pagination } from '@/components/ui/ui-data/pagination/Pagination';
import { usePaginationState } from '@/components/ui/ui-data/pagination/usePaginationState';

function MyList() {
  const data = [...]; // 전체 데이터
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    nextPage,
    prevPage
  } = usePaginationState(data, 5);

  return (
    <div>
      <div>
        {paginatedData.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
  );
}
```

## Props

### PaginatedTable Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `data` | `T[]` | - | 테이블 데이터 (필수) |
| `columns` | `Column<T>[]` | - | 컬럼 정의 (필수) |
| `itemsPerPage` | `number` | `10` | 페이지당 아이템 수 |
| `searchable` | `boolean` | `false` | 검색 기능 활성화 |
| `sortable` | `boolean` | `false` | 정렬 기능 활성화 |
| `className` | `string` | `''` | 추가 CSS 클래스 |

### Pagination Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `currentPage` | `number` | - | 현재 페이지 (필수) |
| `totalPages` | `number` | - | 전체 페이지 수 (필수) |
| `onPageChange` | `(page: number) => void` | - | 페이지 변경 콜백 (필수) |
| `showFirstLast` | `boolean` | `true` | 처음/마지막 버튼 표시 |
| `maxVisiblePages` | `number` | `5` | 표시할 최대 페이지 수 |
| `className` | `string` | `''` | 추가 CSS 클래스 |

## 훅 사용법

### usePaginationState

```tsx
const {
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  paginatedData,
  goToPage,
  nextPage,
  prevPage,
  setItemsPerPage
} = usePaginationState(data, initialItemsPerPage);
```

### usePaginationNavigation

```tsx
const {
  visiblePages,
  canGoPrev,
  canGoNext,
  goToFirst,
  goToLast
} = usePaginationNavigation(currentPage, totalPages, maxVisible);
```

### usePaginationData

```tsx
const {
  paginatedData,
  startIndex,
  endIndex
} = usePaginationData(filteredData, currentPage, itemsPerPage);
```

## 고급 사용 예시

### 검색과 정렬이 있는 테이블

```tsx
function AdvancedTable() {
  const users = [
    { id: 1, name: '김철수', role: 'admin', status: 'active' },
    { id: 2, name: '이영희', role: 'user', status: 'inactive' },
    // ...
  ];

  const columns = [
    { 
      key: 'name', 
      header: '이름',
      sortable: true 
    },
    { 
      key: 'role', 
      header: '역할',
      render: (value) => (
        <span className={`badge ${value === 'admin' ? 'admin' : 'user'}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'status', 
      header: '상태',
      render: (value) => (
        <span className={`status ${value}`}>
          {value === 'active' ? '활성' : '비활성'}
        </span>
      )
    }
  ];

  return (
    <PaginatedTable
      data={users}
      columns={columns}
      itemsPerPage={5}
      searchable={true}
      sortable={true}
      searchPlaceholder="사용자 검색..."
      emptyMessage="검색 결과가 없습니다."
    />
  );
}
```

### 커스텀 페이지네이션 컨트롤

```tsx
function CustomPaginationControls() {
  const data = [...]; // 데이터
  const pagination = usePaginationState(data, 10);

  return (
    <div className="space-y-4">
      {/* 데이터 표시 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pagination.paginatedData.map(item => (
          <Card key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Card>
        ))}
      </div>

      {/* 커스텀 페이지네이션 컨트롤 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <PaginationInfo
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
        />

        <div className="flex items-center gap-4">
          <PageSizeSelector
            value={pagination.itemsPerPage}
            onChange={pagination.setItemsPerPage}
            options={[5, 10, 20, 50]}
          />

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
            maxVisiblePages={3}
          />
        </div>
      </div>
    </div>
  );
}
```

### 서버 사이드 페이지네이션

```tsx
function ServerPaginatedTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, loading, totalPages, totalItems } = useServerPagination({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery
  });

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        
        <PageSizeSelector
          value={itemsPerPage}
          onChange={setItemsPerPage}
        />
      </div>

      {loading ? (
        <div>로딩중...</div>
      ) : (
        <>
          <table>
            {/* 테이블 내용 */}
          </table>

          <div className="mt-4 flex justify-between items-center">
            <PaginationInfo
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
```

## 커스터마이징

### 스타일링 변형

```tsx
// 컴팩트 페이지네이션
<Pagination
  className="pagination-compact"
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={onPageChange}
  maxVisiblePages={3}
  showFirstLast={false}
/>

// 대형 페이지네이션
<Pagination
  className="pagination-large"
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={onPageChange}
  maxVisiblePages={7}
/>
```

### 커스텀 렌더링

```tsx
<PaginatedTable
  data={data}
  columns={columns}
  emptyMessage={
    <div className="text-center py-8">
      <Icon name="empty" size={48} className="mx-auto mb-4" />
      <h3>데이터가 없습니다</h3>
      <p>새로운 항목을 추가해보세요.</p>
    </div>
  }
  loadingMessage={
    <div className="text-center py-8">
      <Spinner size="lg" />
      <p className="mt-2">데이터를 불러오는 중...</p>
    </div>
  }
/>
```

## 접근성 기능

- **키보드 네비게이션**: Tab, Enter, Space 키 지원
- **ARIA 라벨**: 페이지 정보 및 네비게이션 설명
- **스크린 리더**: 페이지 변경 시 적절한 알림
- **포커스 관리**: 페이지 변경 후 포커스 유지

## 성능 최적화

- **가상화**: 큰 데이터셋에 대한 효율적 렌더링
- **디바운싱**: 검색 쿼리 최적화
- **메모이제이션**: 불필요한 재계산 방지
- **지연 로딩**: 필요시에만 데이터 로드 