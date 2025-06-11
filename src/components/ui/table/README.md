# Table 컴포넌트

뉴모피즘 디자인 시스템을 적용한 고성능 테이블 컴포넌트입니다. 정렬, 필터링, 레이아웃 안정성 등 다양한 기능을 제공합니다.

## 📋 주요 특징

- ✅ **레이아웃 안정성**: 데이터 유무와 관계없이 일관된 컬럼 너비 유지
- ✅ **정렬 기능**: 문자열, 숫자, 날짜 등 다양한 데이터 타입 지원
- ✅ **컬럼별 정렬**: 좌측/가운데/우측 정렬 개별 설정 가능
- ✅ **세로선 옵션**: 모던한 디자인을 위한 세로선 표시/숨김
- ✅ **반응형 디자인**: 다양한 화면 크기에 대응
- ✅ **뉴모피즘 스타일**: 프로젝트 디자인 시스템과 완벽 통합

## 🚀 기본 사용법

```tsx
import { Table, TableColumn } from '@/components/ui/table/table';

// 데이터 타입 정의
interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

// 컬럼 정의
const columns: TableColumn\<User\>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    sortable: true,
    align: 'center',
    width: '80px',
  },
  {
    id: 'name',
    header: '이름',
    accessorKey: 'name',
    sortable: true,
    align: 'left',
  },
  {
    id: 'email',
    header: '이메일',
    accessorKey: 'email',
    sortable: true,
    align: 'left',
  },
  {
    id: 'status',
    header: '상태',
    cell: (user) => (
      <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
        {user.status === 'active' ? '활성' : '비활성'}
      </Badge>
    ),
    align: 'center',
  },
];

// 테이블 사용
function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <Table
      data={users}
      columns={columns}
      isLoading={loading}
      emptyMessage="사용자가 없습니다."
    />
  );
}
```

## 📚 API 레퍼런스

### TableColumn\<T\> 타입

| 속성 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `id` | `string` | ✅ | - | 컬럼 고유 식별자 |
| `header` | `string` | ✅ | - | 컬럼 헤더 텍스트 |
| `accessorKey` | `keyof T` | ❌ | - | 데이터 접근 키 |
| `cell` | `(item: T) => ReactNode` | ❌ | - | 커스텀 셀 렌더링 함수 |
| `sortable` | `boolean` | ❌ | `false` | 정렬 가능 여부 |
| `align` | `'left' \| 'center' \| 'right'` | ❌ | `'left'` | 셀 내용 정렬 방향 |
| `width` | `string` | ❌ | - | 컬럼 고정 너비 (예: '100px', '20%') |
| `className` | `string` | ❌ | - | 추가 CSS 클래스 |

### Table Props

| 속성 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `data` | `T[]` | ✅ | - | 테이블 데이터 배열 |
| `columns` | `TableColumn\<T\>[]` | ✅ | - | 컬럼 정의 배열 |
| `className` | `string` | ❌ | - | 컨테이너 CSS 클래스 |
| `tableClassName` | `string` | ❌ | - | 테이블 요소 CSS 클래스 |
| `headerClassName` | `string` | ❌ | - | 헤더 로우 CSS 클래스 |
| `bodyClassName` | `string` | ❌ | - | 바디 CSS 클래스 |
| `rowClassName` | `string \| ((item: T, index: number) => string)` | ❌ | - | 로우 CSS 클래스 |
| `cellClassName` | `string` | ❌ | - | 셀 CSS 클래스 |
| `emptyMessage` | `string` | ❌ | `'데이터가 없습니다.'` | 빈 데이터 메시지 |
| `isLoading` | `boolean` | ❌ | `false` | 로딩 상태 |
| `compact` | `boolean` | ❌ | `false` | 컴팩트 모드 (작은 패딩) |
| `rounded` | `boolean` | ❌ | `true` | 모서리 둥글게 처리 |
| `minRows` | `number` | ❌ | `5` | 최소 표시할 행 수 |
| `showVerticalLines` | `boolean` | ❌ | `true` | 세로선 표시 여부 |

## 💡 사용 예제

### 1. 기본 테이블

```tsx
<Table
  data={users}
  columns={columns}
/>
```

### 2. 로딩 상태가 있는 테이블

```tsx
<Table
  data={users}
  columns={columns}
  isLoading={loading}
  emptyMessage="사용자를 불러오는 중..."
/>
```

### 3. 컴팩트 모드 테이블

```tsx
<Table
  data={users}
  columns={columns}
  compact={true}
  minRows={3}
/>
```

### 4. 세로선 없는 모던 테이블

```tsx
<Table
  data={users}
  columns={columns}
  showVerticalLines={false}
/>
```

### 5. 커스텀 셀 렌더링

```tsx
const columns: TableColumn\<User\>[] = [
  {
    id: 'avatar',
    header: '프로필',
    cell: (user) => (
      <div className="flex items-center space-x-2">
        <img 
          src={user.avatar} 
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <span>{user.name}</span>
      </div>
    ),
    align: 'left',
  },
  {
    id: 'actions',
    header: '작업',
    cell: (user) => (
      <div className="flex space-x-2">
        <Button size="sm" onClick={() => editUser(user.id)}>
          편집
        </Button>
        <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)}>
          삭제
        </Button>
      </div>
    ),
    align: 'center',
  },
];
```

### 6. 조건부 로우 스타일링

```tsx
<Table
  data={users}
  columns={columns}
  rowClassName={(user, index) => 
    user.status === 'inactive' ? 'opacity-50' : ''
  }
/>
```

## 🎨 스타일 커스터마이징

### CSS 변수 활용

```css
.custom-table {
  --table-border-color: #e5e7eb;
  --table-header-bg: #f9fafb;
  --table-row-hover: #f3f4f6;
}
```

### 뉴모피즘 스타일 확장

```tsx
<Table
  data={users}
  columns={columns}
  className="custom-table"
  headerClassName="neu-inset"
  rowClassName="neu-flat hover:neu-raised"
/>
```

## 🔧 고급 기능

### 정렬 기능

- **문자열**: 로케일 기반 정렬 (`localeCompare`)
- **숫자**: 수치 정렬
- **날짜**: 타임스탬프 기반 정렬
- **커스텀**: `cell` 함수 사용 시 `accessorKey` 기반 정렬

### 레이아웃 안정성

- `table-fixed` 레이아웃으로 컬럼 너비 고정
- `colgroup`을 통한 정확한 너비 제어
- 데이터 유무와 관계없이 일관된 레이아웃 유지

### 반응형 처리

```tsx
// 모바일에서는 일부 컬럼 숨김
const columns: TableColumn\<User\>[] = [
  {
    id: 'name',
    header: '이름',
    accessorKey: 'name',
    className: 'min-w-0', // 텍스트 줄임 처리
  },
  {
    id: 'email',
    header: '이메일',
    accessorKey: 'email',
    className: 'hidden md:table-cell', // 모바일에서 숨김
  },
];
```

## ⚠️ 주의사항

1. **타입 안전성**: 제네릭 타입 `T`를 정확히 정의해야 합니다.
2. **성능**: 대용량 데이터의 경우 가상화나 페이지네이션을 고려하세요.
3. **접근성**: 스크린 리더를 위해 적절한 `aria-label`을 추가하세요.
4. **키 값**: 각 행에 고유한 키가 있는지 확인하세요.

## 🐛 문제 해결

### 정렬이 작동하지 않는 경우

- `accessorKey`가 올바르게 설정되었는지 확인
- `sortable: true` 속성이 있는지 확인

### 레이아웃이 깨지는 경우

- 컬럼 너비 합계가 100%를 초과하지 않는지 확인
- `table-fixed` 레이아웃에서는 모든 컬럼에 너비 지정 권장

### 스타일이 적용되지 않는 경우

- 뉴모피즘 CSS 파일이 올바르게 import되었는지 확인
- Tailwind CSS 설정이 올바른지 확인

## 📝 변경 이력

- **v1.0.0**: 초기 버전 출시
- **v1.1.0**: 컬럼별 정렬 기능 추가
- **v1.2.0**: 세로선 표시/숨김 옵션 추가
- **v1.3.0**: 레이아웃 안정성 개선
