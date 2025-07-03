# InfiniteScroll 컴포넌트

무한 스크롤 기능을 제공하는 컴포넌트입니다.

## 주요 특징

- **Intersection Observer**: 효율적인 스크롤 감지
- **로딩 상태 관리**: 자동 로딩 인디케이터
- **커스터마이징**: 임계값 조정 가능
- **성능 최적화**: 메모리 효율적 구현
- **접근성**: 스크린 리더 지원

## 기본 사용법

```tsx
import InfiniteScroll from '@/components/ui/ui-data/infinite-scroll/InfiniteScroll';

function MyComponent() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = () => {
    setIsLoading(true);
    // API 호출 시뮬레이션
    setTimeout(() => {
      const newItems = Array.from({ length: 20 }, (_, i) => 
        `아이템 ${items.length + i + 1}`
      );
      setItems(prev => [...prev, ...newItems]);
      setHasMore(items.length + newItems.length < 100); // 총 100개 제한
      setIsLoading(false);
    }, 1000);
  };

  return (
    <InfiniteScroll
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoading}
    >
      <div className="space-y-2">
        {items.map(item => (
          <div key={item} className="p-4 bg-white border rounded">
            {item}
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `loadMore` | `() => void` | - | 더 많은 데이터 로드 함수 (필수) |
| `hasMore` | `boolean` | - | 더 로드할 데이터 여부 (필수) |
| `isLoading` | `boolean` | - | 로딩 상태 (필수) |
| `threshold` | `number` | `0.1` | 로딩 트리거 임계값 (0-1) |
| `children` | `React.ReactNode` | - | 렌더링할 콘텐츠 (필수) |

## 사용 예시

### API 데이터 무한 스크롤

```tsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users?page=${page}&limit=20`);
      const data = await response.json();
      
      setUsers(prev => [...prev, ...data.users]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">사용자 목록</h1>
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        threshold={0.5}
      >
        <div className="grid gap-4">
          {users.map(user => (
            <div key={user.id} className="p-4 bg-white shadow rounded">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
```

### 검색 결과와 함께 사용

```tsx
function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchMore = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    const response = await fetch(
      `/api/search?q=${query}&offset=${results.length}`
    );
    const data = await response.json();
    
    setResults(prev => [...prev, ...data.results]);
    setHasMore(data.hasMore);
    setIsLoading(false);
  };

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setResults([]);
    setHasMore(true);
  };

  useEffect(() => {
    if (query) {
      searchMore();
    }
  }, [query]);

  return (
    <div>
      <input
        type="text"
        placeholder="검색어 입력..."
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      {results.length > 0 && (
        <InfiniteScroll
          loadMore={searchMore}
          hasMore={hasMore}
          isLoading={isLoading}
        >
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="p-4 border rounded">
                <h3 className="font-medium">{result.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {result.description}
                </p>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}
```

### 이미지 갤러리

```tsx
function ImageGallery() {
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreImages = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/images?offset=${images.length}`);
    const data = await response.json();
    
    setImages(prev => [...prev, ...data.images]);
    setHasMore(data.hasMore);
    setIsLoading(false);
  };

  return (
    <InfiniteScroll
      loadMore={loadMoreImages}
      hasMore={hasMore}
      isLoading={isLoading}
      threshold={0.2}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map(image => (
          <div key={image.id} className="relative group">
            <img
              src={image.thumbnail}
              alt={image.title}
              className="w-full h-48 object-cover rounded"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
              <span className="text-white text-sm">{image.title}</span>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}
```

## 고급 설정

### 커스텀 로딩 컴포넌트

```tsx
<InfiniteScroll
  loadMore={loadMore}
  hasMore={hasMore}
  isLoading={isLoading}
  renderLoading={() => (
    <div className="flex justify-center py-8">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  )}
>
  {children}
</InfiniteScroll>
```

### 에러 처리

```tsx
function RobustInfiniteScroll() {
  const [error, setError] = useState(null);
  
  const loadMore = async () => {
    try {
      setError(null);
      // 데이터 로딩 로직
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 mb-2">오류가 발생했습니다: {error}</p>
        <button 
          onClick={loadMore}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} isLoading={isLoading}>
      {children}
    </InfiniteScroll>
  );
}
```

## 성능 최적화

- **Intersection Observer**: 스크롤 이벤트 대신 효율적 감지
- **메모이제이션**: 불필요한 재렌더링 방지
- **지연 로딩**: 이미지 lazy loading 지원
- **디바운싱**: 빠른 스크롤 시 중복 요청 방지

## 접근성

- **스크린 리더**: 로딩 상태 알림
- **키보드 네비게이션**: 포커스 관리
- **ARIA 라벨**: 적절한 역할 및 상태 표시 