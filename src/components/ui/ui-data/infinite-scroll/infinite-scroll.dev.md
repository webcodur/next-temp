# InfiniteScroll 기술 문서

## 아키텍처 개요

Intersection Observer API를 활용한 효율적인 무한 스크롤 구현입니다.

## 핵심 구현

### Intersection Observer 설정
```typescript
const observer = useRef<IntersectionObserver | null>(null);
const sentinelRef = useCallback((node: HTMLDivElement | null) => {
  if (isLoading) return;
  observer.current?.disconnect();
  if (!node) return;
  
  observer.current = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && hasMore) {
        loadMore();
      }
    },
    { threshold }
  );
  observer.current.observe(node);
}, [isLoading, hasMore, loadMore, threshold]);
```

### 센티넬 엘리먼트
```jsx
<div ref={sentinelRef} className="sentinel">
  {isLoading ? <LoadingIndicator /> : <ScrollMessage />}
</div>
```

## 성능 최적화

### 메모리 관리
- Observer 자동 정리
- useCallback으로 함수 메모이제이션
- 조건부 Observer 생성

### 효율적 감지
```typescript
// 스크롤 이벤트 대신 Intersection Observer 사용
// 60fps 제한 없이 네이티브 성능
```

### 임계값 최적화
```typescript
threshold: 0.1 // 10% 노출시 트리거
```

## 상태 관리 패턴

### 컴포넌트 상태
```typescript
interface InfiniteScrollState {
  isLoading: boolean;
  hasMore: boolean;
  error?: string;
  items: any[];
}
```

### 로딩 플로우
1. sentinelRef 노출 감지
2. loadMore() 함수 호출
3. isLoading true로 변경
4. 데이터 로딩 완료
5. hasMore 상태 업데이트

## 확장성

### 커스텀 훅
```typescript
function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<T[]>,
  pageSize: number = 20
) {
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadMore = useCallback(async () => {
    // 구현 로직
  }, []);
  
  return { items, hasMore, isLoading, loadMore };
}
``` 