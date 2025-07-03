# SmartTable 기술 문서

## 아키텍처 개요

제네릭 타입 기반의 지능형 테이블로, 내장된 정렬/검색/필터링 기능을 제공합니다.

## 핵심 구현

### 제네릭 타입 시스템
```typescript
interface SmartTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
}

interface Column<T> {
  key: keyof T;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}
```

### 상태 관리
```typescript
const [sortConfig, setSortConfig] = useState<{
  key: keyof T;
  direction: 'asc' | 'desc';
} | null>(null);

const [searchTerm, setSearchTerm] = useState('');
const [filteredData, setFilteredData] = useState(data);
```

### 데이터 처리 파이프라인

1. **검색 필터링**
```typescript
const searchFiltered = useMemo(() => 
  data.filter(item => 
    searchableFields.some(field => 
      String(item[field]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ), [data, searchTerm]
);
```

2. **정렬 처리**
```typescript
const sortedData = useMemo(() => {
  if (!sortConfig) return searchFiltered;
  
  return [...searchFiltered].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}, [searchFiltered, sortConfig]);
```

## 성능 최적화

### 메모이제이션
- 정렬된 데이터: `useMemo`
- 검색 결과: `useMemo`
- 렌더 함수: `useCallback`

### 가상화 지원
```typescript
const VirtualizedRow = React.memo(({ item, columns }) => (
  <tr>{columns.map(col => <td key={col.key}>{renderCell(item, col)}</td>)}</tr>
));
```

### 디바운싱
```typescript
const debouncedSearch = useDebounce(searchTerm, 300);
```

## 확장 패턴

### 커스텀 필터
```typescript
interface FilterConfig<T> {
  field: keyof T;
  operator: 'equals' | 'contains' | 'gt' | 'lt';
  value: any;
}
```

### 다중 정렬
```typescript
interface SortConfig<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
  priority: number;
}
``` 