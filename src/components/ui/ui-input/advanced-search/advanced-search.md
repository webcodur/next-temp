# AdvancedSearch 컴포넌트

고급 검색 폼을 위한 아코디언 형태의 컨테이너 컴포넌트입니다.

## 주요 특징

- **아코디언 UI**: 접고 펼치는 검색 영역
- **그리드 레이아웃**: 반응형 3열 배치
- **버튼 통합**: 검색/리셋 버튼 내장
- **뉴모피즘 디자인**: 통일된 스타일링
- **상태 표시**: 검색 결과 상태 텍스트

## 기본 사용법

```tsx
import { AdvancedSearch } from '@/components/ui/ui-input/advanced-search/AdvancedSearch';

function MySearchForm() {
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    dateRange: null
  });

  const handleSearch = () => {
    console.log('검색 실행:', filters);
  };

  const handleReset = () => {
    setFilters({ name: '', category: '', dateRange: null });
  };

  return (
    <AdvancedSearch
      title="상품 검색"
      onSearch={handleSearch}
      onReset={handleReset}
      statusText="총 150개 결과"
    >
      <input
        type="text"
        placeholder="상품명"
        value={filters.name}
        onChange={(e) => setFilters({...filters, name: e.target.value})}
        className="p-2 border rounded"
      />
      
      <select
        value={filters.category}
        onChange={(e) => setFilters({...filters, category: e.target.value})}
        className="p-2 border rounded"
      >
        <option value="">카테고리 선택</option>
        <option value="electronics">전자제품</option>
        <option value="books">도서</option>
      </select>
      
      <input
        type="date"
        value={filters.dateRange}
        onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
        className="p-2 border rounded"
      />
    </AdvancedSearch>
  );
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | `'Advanced Search'` | 아코디언 제목 |
| `children` | `ReactNode` | - | 검색 필드들 (필수) |
| `onSearch` | `() => void` | - | 검색 버튼 클릭 핸들러 |
| `onReset` | `() => void` | - | 리셋 버튼 클릭 핸들러 |
| `searchLabel` | `string` | `'검색'` | 검색 버튼 텍스트 |
| `resetLabel` | `string` | `'리셋'` | 리셋 버튼 텍스트 |
| `defaultOpen` | `boolean` | `true` | 초기 펼침 상태 |
| `showButtons` | `boolean` | `true` | 버튼 표시 여부 |
| `statusText` | `string` | - | 상태 텍스트 |

## 사용 예시

### 사용자 검색

```tsx
function UserSearch() {
  const [criteria, setCriteria] = useState({
    name: '',
    email: '',
    role: '',
    status: '',
    department: '',
    joinDate: ''
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await searchUsers(criteria);
      setSearchResults(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCriteria({
      name: '',
      email: '',
      role: '',
      status: '',
      department: '',
      joinDate: ''
    });
    setSearchResults([]);
  };

  return (
    <div className="space-y-6">
      <AdvancedSearch
        title="사용자 검색"
        onSearch={handleSearch}
        onReset={handleReset}
        statusText={searchResults.length > 0 ? `총 ${searchResults.length}명` : undefined}
      >
        <input
          type="text"
          placeholder="이름"
          value={criteria.name}
          onChange={(e) => setCriteria({...criteria, name: e.target.value})}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="email"
          placeholder="이메일"
          value={criteria.email}
          onChange={(e) => setCriteria({...criteria, email: e.target.value})}
          className="w-full p-3 border rounded-lg"
        />

        <select
          value={criteria.role}
          onChange={(e) => setCriteria({...criteria, role: e.target.value})}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">역할 선택</option>
          <option value="admin">관리자</option>
          <option value="user">사용자</option>
          <option value="manager">매니저</option>
        </select>

        <select
          value={criteria.status}
          onChange={(e) => setCriteria({...criteria, status: e.target.value})}
          className="w-full p-3 border rounded-lg"
        >
          <option value="">상태 선택</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="pending">대기</option>
        </select>

        <input
          type="text"
          placeholder="부서"
          value={criteria.department}
          onChange={(e) => setCriteria({...criteria, department: e.target.value})}
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="date"
          placeholder="입사일"
          value={criteria.joinDate}
          onChange={(e) => setCriteria({...criteria, joinDate: e.target.value})}
          className="w-full p-3 border rounded-lg"
        />
      </AdvancedSearch>

      {/* 검색 결과 */}
      {isLoading && <div>검색 중...</div>}
      {searchResults.length > 0 && (
        <div className="space-y-2">
          {searchResults.map(user => (
            <div key={user.id} className="p-4 border rounded">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 주문 검색

```tsx
function OrderSearch() {
  const [filters, setFilters] = useState({
    orderNumber: '',
    customerName: '',
    status: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  return (
    <AdvancedSearch
      title="주문 검색"
      onSearch={() => console.log('주문 검색:', filters)}
      onReset={() => setFilters({
        orderNumber: '',
        customerName: '',
        status: '',
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: ''
      })}
      searchLabel="주문 검색"
      resetLabel="초기화"
    >
      <input
        type="text"
        placeholder="주문번호"
        value={filters.orderNumber}
        onChange={(e) => setFilters({...filters, orderNumber: e.target.value})}
        className="p-2 border rounded"
      />

      <input
        type="text"
        placeholder="고객명"
        value={filters.customerName}
        onChange={(e) => setFilters({...filters, customerName: e.target.value})}
        className="p-2 border rounded"
      />

      <select
        value={filters.status}
        onChange={(e) => setFilters({...filters, status: e.target.value})}
        className="p-2 border rounded"
      >
        <option value="">주문 상태</option>
        <option value="pending">대기중</option>
        <option value="processing">처리중</option>
        <option value="shipped">배송중</option>
        <option value="delivered">배송완료</option>
        <option value="cancelled">취소</option>
      </select>

      <input
        type="date"
        placeholder="시작일"
        value={filters.startDate}
        onChange={(e) => setFilters({...filters, startDate: e.target.value})}
        className="p-2 border rounded"
      />

      <input
        type="date"
        placeholder="종료일"
        value={filters.endDate}
        onChange={(e) => setFilters({...filters, endDate: e.target.value})}
        className="p-2 border rounded"
      />

      <input
        type="number"
        placeholder="최소 금액"
        value={filters.minAmount}
        onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
        className="p-2 border rounded"
      />
    </AdvancedSearch>
  );
}
```

### 파일 검색

```tsx
function FileSearch() {
  const [searchParams, setSearchParams] = useState({
    filename: '',
    fileType: '',
    sizeMin: '',
    sizeMax: '',
    createdAfter: '',
    createdBefore: '',
    tags: []
  });

  return (
    <AdvancedSearch
      title="파일 검색"
      defaultOpen={false}
      showButtons={true}
      onSearch={() => performFileSearch(searchParams)}
      onReset={() => setSearchParams({
        filename: '',
        fileType: '',
        sizeMin: '',
        sizeMax: '',
        createdAfter: '',
        createdBefore: '',
        tags: []
      })}
    >
      <input
        type="text"
        placeholder="파일명"
        value={searchParams.filename}
        onChange={(e) => setSearchParams({...searchParams, filename: e.target.value})}
        className="p-2 border rounded"
      />

      <select
        value={searchParams.fileType}
        onChange={(e) => setSearchParams({...searchParams, fileType: e.target.value})}
        className="p-2 border rounded"
      >
        <option value="">파일 형식</option>
        <option value="image">이미지</option>
        <option value="document">문서</option>
        <option value="video">동영상</option>
        <option value="audio">오디오</option>
      </select>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="최소 크기 (MB)"
          value={searchParams.sizeMin}
          onChange={(e) => setSearchParams({...searchParams, sizeMin: e.target.value})}
          className="flex-1 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="최대 크기 (MB)"
          value={searchParams.sizeMax}
          onChange={(e) => setSearchParams({...searchParams, sizeMax: e.target.value})}
          className="flex-1 p-2 border rounded"
        />
      </div>
    </AdvancedSearch>
  );
}
```

## 커스터마이징

### 버튼 숨김

```tsx
<AdvancedSearch
  showButtons={false}
  title="필터"
>
  {/* 검색 필드들 */}
</AdvancedSearch>
```

### 커스텀 상태 텍스트

```tsx
<AdvancedSearch
  statusText={
    isLoading ? "검색 중..." : 
    results.length > 0 ? `${results.length}개 결과 발견` :
    searched ? "검색 결과가 없습니다" : 
    undefined
  }
>
  {/* 검색 필드들 */}
</AdvancedSearch>
```

## 스타일링

- **그리드 레이아웃**: `md:grid-cols-3`로 반응형 3열 배치
- **뉴모피즘 버튼**: `neu-raised` 클래스 적용
- **아이콘 통합**: Lucide React 아이콘 사용
- **색상 시스템**: Primary, Muted 색상 활용 