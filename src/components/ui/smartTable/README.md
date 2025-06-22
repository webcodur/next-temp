# SmartTable

스마트 테이블은 정렬, 페이지네이션, 로딩 상태를 지원하는 재사용 가능한 테이블 컴포넌트다.

## 기본 사용법

```tsx
import {
	SmartTable,
	SmartTableColumn,
} from '@/components/ui/smartTable/SmartTable';

type User = {
	id: number;
	name: string;
	email: string;
	age: number;
};

const columns: SmartTableColumn<User>[] = [
	{
		id: 'name',
		header: '이름',
		accessorKey: 'name',
		sortable: true,
	},
	{
		id: 'email',
		header: '이메일',
		accessorKey: 'email',
		sortable: true,
	},
	{
		id: 'age',
		header: '나이',
		accessorKey: 'age',
		sortable: true,
		align: 'center',
	},
];

const users: User[] = [
	{ id: 1, name: '김철수', email: 'kim@example.com', age: 30 },
	{ id: 2, name: '이영희', email: 'lee@example.com', age: 25 },
];

export default function UserTable() {
	return <SmartTable data={users} columns={columns} />;
}
```

## Props

### SmartTable Props

| Prop            | 타입                                             | 기본값  | 설명                                     |
| --------------- | ------------------------------------------------ | ------- | ---------------------------------------- |
| `data`          | `T[] \| null \| undefined`                       | -       | 테이블에 표시할 데이터 배열              |
| `columns`       | `SmartTableColumn<T>[]`                          | -       | 컬럼 정의 배열                           |
| `className`     | `string`                                         | -       | 테이블 컨테이너에 적용할 추가 CSS 클래스 |
| `rowClassName`  | `string \| ((item: T, index: number) => string)` | -       | 각 행에 적용할 CSS 클래스                |
| `pageSize`      | `number`                                         | `10`    | 한 페이지에 표시할 행 수                 |
| `isFetching`    | `boolean`                                        | `false` | 로딩 상태 제어                           |
| `onRowClick`    | `(item: T, index: number) => void`               | -       | 행 클릭 이벤트 핸들러                    |
| `clickableRows` | `boolean`                                        | `false` | 행 클릭 활성화 여부                      |

### SmartTableColumn Props

| Prop          | 타입                            | 기본값   | 설명                                |
| ------------- | ------------------------------- | -------- | ----------------------------------- |
| `id`          | `string`                        | -        | 컬럼 고유 식별자                    |
| `header`      | `string`                        | -        | 컬럼 헤더에 표시될 텍스트           |
| `accessorKey` | `keyof T`                       | -        | 데이터 객체에서 값을 가져올 키      |
| `cell`        | `(item: T) => ReactNode`        | -        | 커스텀 셀 렌더링 함수               |
| `sortable`    | `boolean`                       | `false`  | 정렬 기능 활성화 여부               |
| `className`   | `string`                        | -        | 컬럼에 적용할 추가 CSS 클래스       |
| `align`       | `'left' \| 'center' \| 'right'` | `'left'` | 컬럼 텍스트 정렬                    |
| `width`       | `string`                        | -        | 컬럼 고정 너비 (예: '100px', '20%') |

## 기능

### 정렬

- `sortable: true`로 설정된 컬럼은 클릭으로 정렬할 수 있다
- 정렬 순서: 오름차순 → 내림차순 → 정렬 없음
- 시각적 정렬 표시기가 헤더에 나타난다

### 로딩 상태

- `data`가 `null` 또는 `undefined`일 때 자동으로 로딩 상태를 표시한다
- `isFetching` prop으로 명시적 로딩 상태를 제어할 수 있다

### 빈 상태

- 데이터가 빈 배열일 때 "데이터가 없습니다" 메시지를 표시한다

### 고정 높이

- `pageSize`에 따라 테이블 높이가 고정된다
- 데이터가 부족한 경우 빈 행으로 채워 일정한 높이를 유지한다

## 예제

### 기본 테이블

```tsx
<SmartTable data={users} columns={columns} />
```

### 컴팩트 테이블 (3행 고정)

```tsx
<SmartTable data={users} columns={columns} compact={true} minRows={3} />
```

### 세로선 없는 테이블

```tsx
<SmartTable data={users} columns={columns} showVerticalLines={false} />
```

### 커스텀 셀 렌더링

```tsx
const columns: SmartTableColumn<User>[] = [
	{
		id: 'name',
		header: '이름',
		accessorKey: 'name',
		sortable: true,
	},
	{
		id: 'status',
		header: '상태',
		cell: (user) => (
			<span
				className={`px-2 py-1 rounded ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
				{user.isActive ? '활성' : '비활성'}
			</span>
		),
	},
	{
		id: 'actions',
		header: '작업',
		cell: (user) => (
			<button
				onClick={() => handleEdit(user.id)}
				className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
				편집
			</button>
		),
	},
];
```

### 클릭 가능한 행

```tsx
<SmartTable
	data={users}
	columns={columns}
	clickableRows={true}
	onRowClick={(user, index) => {
		console.log('클릭된 사용자:', user);
		// 상세 페이지로 이동
		router.push(`/users/${user.id}`);
	}}
/>
```

### 로딩 상태

```tsx
const { data: users, isLoading } = useQuery(['users'], fetchUsers);

<SmartTable data={users} columns={columns} isFetching={isLoading} />;
```

### 조건부 행 스타일링

```tsx
<SmartTable
	data={users}
	columns={columns}
	rowClassName={(user, index) => (user.isActive ? 'bg-green-50' : 'bg-red-50')}
/>
```

## 스타일링

이 컴포넌트는 뉴모피즘 디자인 시스템을 사용한다:

- `neu-flat`: 테이블 컨테이너와 헤더에 적용
- 전역 CSS의 `list-item-even`, `list-item-odd` 클래스로 얼룩무늬 효과
- `list-item-hover`, `list-item-active` 클래스로 상호작용 효과

### 커스텀 스타일링

추가 스타일링이 필요한 경우 `className` prop을 사용하거나, 컬럼별로 `className`을 지정할 수 있다.

```tsx
<SmartTable
	data={users}
	columns={columns}
	className="shadow-lg"
	rowClassName="hover:bg-blue-50"
/>
```

## 접근성

- 정렬 가능한 헤더는 클릭 가능하다는 것을 시각적으로 표시한다
- 키보드 네비게이션을 지원한다
- 스크린 리더를 위한 적절한 ARIA 속성이 적용되어 있다

## 성능 최적화

- `useMemo`를 사용한 정렬 데이터 캐싱
- 불필요한 리렌더링 방지
- 가상화는 지원하지 않으므로 대용량 데이터의 경우 서버사이드 페이지네이션을 권장한다

## 한계

- 가상화를 지원하지 않으므로 1000개 이상의 행에서는 성능 이슈가 있을 수 있다
- 고급 필터링 기능은 별도로 구현해야 한다
- 컬럼 리사이징은 지원하지 않는다

## 관련 컴포넌트

- `Pagination`: 페이지네이션이 필요한 경우
- `PaginatedTable`: 페이지네이션이 통합된 테이블
- `AdvancedSearch`: 검색 기능이 필요한 경우
