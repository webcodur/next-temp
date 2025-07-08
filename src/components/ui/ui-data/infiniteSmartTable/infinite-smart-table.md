# InfiniteSmartTable

무한 스크롤 기능이 있는 스마트 테이블 컴포넌트다.

## 주요 기능

- **무한 스크롤**: 스크롤 하단에 도달하면 자동으로 추가 데이터 로드
- **데이터 유지**: 추가 데이터 로딩 시 기존 데이터 유지하여 화면 깜빡임 방지
- **스크롤 위치 유지**: 데이터 추가 시 스크롤 위치 상단 이동 방지
- **로딩 인디케이터**: 하단에 로딩 상태 표시
- **SmartTable 통합**: 정렬, 필터링 등 SmartTable의 모든 기능 사용 가능

## 사용법

### 기본 사용법

```tsx
import { InfiniteSmartTable } from '@/components/ui/ui-data/infiniteSmartTable/InfiniteSmartTable';

const columns = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: '이름', sortable: true },
  { key: 'status', header: '상태' },
];

const [data, setData] = useState<MyDataType[]>([]);
const [isFetching, setIsFetching] = useState(false);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  setIsFetching(true);
  try {
    const newData = await fetchMoreData();
    setData(prev => [...prev, ...newData]);
    setHasMore(newData.length > 0);
  } finally {
    setIsFetching(false);
  }
};

<InfiniteSmartTable
  data={data}
  columns={columns}
  loadMore={loadMore}
  hasMore={hasMore}
  isFetching={isFetching}
/>
```

### Props

| 속성 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `data` | `T[] \| null` | ✓ | - | 테이블 데이터 (null이면 초기 로딩) |
| `columns` | `SmartTableColumn<T>[]` | ✓ | - | 테이블 컬럼 정의 |
| `loadMore` | `() => void` | ✓ | - | 추가 데이터 로드 함수 |
| `hasMore` | `boolean` | ✓ | - | 더 로드할 데이터가 있는지 여부 |
| `isFetching` | `boolean` | | false | 현재 데이터 로딩 중인지 |
| `threshold` | `number` | | 0.1 | IntersectionObserver threshold |
| `className` | `string` | | - | 테이블 컨테이너 클래스 |
| `headerClassName` | `string` | | - | 헤더 클래스 |
| `rowClassName` | `string \| function` | | - | 행 클래스 |
| `cellClassName` | `string` | | - | 셀 클래스 |
| `pageSize` | `number` | | 10 | 로딩 스켈레톤 행 수 |
| `emptyMessage` | `string` | | '데이터가 없습니다.' | 빈 데이터 메시지 |
| `loadingRows` | `number` | | 5 | 로딩 스켈레톤 행 수 |

## 상태 관리

### 데이터 상태

```tsx
const [data, setData] = useState<MyDataType[] | null>(null);
const [isFetching, setIsFetching] = useState(false);
const [hasMore, setHasMore] = useState(true);
const [page, setPage] = useState(0);
```

### 로딩 상태 구분

1. **초기 로딩**: `data === null`
   - 로딩 스켈레톤 표시
   - 전체 테이블 영역이 로딩 상태

2. **추가 로딩**: `isFetching && data !== null`
   - 기존 데이터 유지
   - 하단에 로딩 인디케이터만 표시

### 데이터 로드 함수

```tsx
const loadMore = async () => {
  if (isFetching || !hasMore) return;
  
  setIsFetching(true);
  try {
    const response = await api.getData({ page: page + 1 });
    
    if (response.data.length === 0) {
      setHasMore(false);
    } else {
      setData(prev => prev ? [...prev, ...response.data] : response.data);
      setPage(prev => prev + 1);
    }
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  } finally {
    setIsFetching(false);
  }
};
```

## 핵심 개선사항

### 문제점 해결

기존 InfiniteScroll + SmartTable 조합에서 발생하던 문제:
- 추가 데이터 로딩 시 기존 데이터 사라짐
- 테이블 구조 깨짐으로 인한 화면 상단 이동
- 사용자 경험 저하

### 해결책

1. **로딩 상태 구분**: 초기 로딩과 추가 로딩을 분리
2. **데이터 유지**: 추가 로딩 시 기존 데이터 보존
3. **스크롤 위치 유지**: 테이블 구조 유지로 스크롤 위치 안정성 확보

## 사용 사례

```tsx
// 차량 리스트 무한 스크롤
<InfiniteSmartTable
  data={vehicles}
  columns={vehicleColumns}
  loadMore={loadMoreVehicles}
  hasMore={hasMoreVehicles}
  isFetching={isLoadingVehicles}
  emptyMessage="등록된 차량이 없습니다."
/>

// 주차 기록 무한 스크롤
<InfiniteSmartTable
  data={parkingRecords}
  columns={parkingColumns}
  loadMore={loadMoreRecords}
  hasMore={hasMoreRecords}
  isFetching={isLoadingRecords}
  threshold={0.2}
  className="max-h-screen"
/>
``` 