# SmartTable 컴포넌트

지능형 테이블 컴포넌트로, 정렬, 필터링, 검색 기능을 내장하고 있습니다.

## 주요 특징

- **자동 정렬**: 컬럼 헤더 클릭으로 정렬
- **실시간 검색**: 즉시 필터링 기능
- **타입 안전성**: TypeScript 제네릭 지원
- **반응형**: 모바일 친화적 디자인
- **확장성**: 커스텀 렌더링 지원

## 기본 사용법

```tsx
import { SmartTable } from '@/components/ui/ui-data/smartTable/SmartTable';

function MyComponent() {
  const data = [
    { id: 1, name: '김철수', email: 'kim@example.com', role: 'admin' },
    { id: 2, name: '이영희', email: 'lee@example.com', role: 'user' },
    { id: 3, name: '박민수', email: 'park@example.com', role: 'user' }
  ];

  const columns = [
    { key: 'name', header: '이름', sortable: true },
    { key: 'email', header: '이메일', sortable: true },
    { 
      key: 'role', 
      header: '역할',
      render: (value) => (
        <span className={`badge ${value === 'admin' ? 'admin' : 'user'}`}>
          {value}
        </span>
      )
    }
  ];

  return (
    <SmartTable
      data={data}
      columns={columns}
      searchable={true}
      searchPlaceholder="사용자 검색..."
    />
  );
}
```

## Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `data` | `T[]` | - | 테이블 데이터 (필수) |
| `columns` | `Column<T>[]` | - | 컬럼 정의 (필수) |
| `searchable` | `boolean` | `false` | 검색 기능 활성화 |
| `searchPlaceholder` | `string` | `'검색...'` | 검색 입력 placeholder |
| `emptyMessage` | `string` | `'데이터가 없습니다'` | 빈 상태 메시지 |
| `className` | `string` | `''` | 추가 CSS 클래스 |

### Column 인터페이스

```tsx
interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  className?: string;
}
```

## 사용 예시

### 완전한 기능을 가진 테이블

```tsx
function UserManagementTable() {
  const users = [
    { 
      id: 1, 
      name: '김철수', 
      email: 'kim@example.com', 
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z'
    },
    // ... 더 많은 데이터
  ];

  const columns = [
    { 
      key: 'name', 
      header: '이름',
      sortable: true,
      searchable: true
    },
    { 
      key: 'email', 
      header: '이메일',
      sortable: true,
      searchable: true
    },
    { 
      key: 'role', 
      header: '역할',
      render: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${
          value === 'admin' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {value === 'admin' ? '관리자' : '사용자'}
        </span>
      )
    },
    { 
      key: 'status', 
      header: '상태',
      sortable: true,
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
          value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          <span className={`w-2 h-2 rounded-full mr-1 ${
            value === 'active' ? 'bg-green-400' : 'bg-gray-400'
          }`} />
          {value === 'active' ? '활성' : '비활성'}
        </span>
      )
    },
    { 
      key: 'lastLogin', 
      header: '최근 로그인',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('ko-KR')
    }
  ];

  return (
    <SmartTable
      data={users}
      columns={columns}
      searchable={true}
      searchPlaceholder="이름 또는 이메일로 검색..."
      emptyMessage="등록된 사용자가 없습니다."
      className="shadow-lg"
    />
  );
}
```

### 액션 버튼이 있는 테이블

```tsx
function ProductTable() {
  const products = [
    { id: 1, name: '노트북', price: 1200000, stock: 15 },
    { id: 2, name: '마우스', price: 35000, stock: 50 },
    // ...
  ];

  const handleEdit = (product) => {
    console.log('편집:', product);
  };

  const handleDelete = (product) => {
    console.log('삭제:', product);
  };

  const columns = [
    { key: 'name', header: '상품명', sortable: true, searchable: true },
    { 
      key: 'price', 
      header: '가격',
      sortable: true,
      render: (value) => `₩${value.toLocaleString()}`
    },
    { key: 'stock', header: '재고', sortable: true },
    {
      key: 'actions',
      header: '액션',
      render: (_, item) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(item)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            편집
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      )
    }
  ];

  return (
    <SmartTable
      data={products}
      columns={columns}
      searchable={true}
    />
  );
}
```

### 중첩된 데이터 표시

```tsx
function OrderTable() {
  const orders = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      customer: {
        name: '김철수',
        email: 'kim@example.com'
      },
      items: [
        { name: '노트북', quantity: 1, price: 1200000 }
      ],
      total: 1200000,
      status: 'completed'
    },
    // ...
  ];

  const columns = [
    { key: 'orderNumber', header: '주문번호', sortable: true },
    { 
      key: 'customer', 
      header: '고객',
      render: (customer) => (
        <div>
          <div className="font-medium">{customer.name}</div>
          <div className="text-sm text-gray-500">{customer.email}</div>
        </div>
      ),
      searchable: true
    },
    { 
      key: 'items', 
      header: '상품',
      render: (items) => (
        <div>
          {items.map((item, index) => (
            <div key={index} className="text-sm">
              {item.name} × {item.quantity}
            </div>
          ))}
        </div>
      )
    },
    { 
      key: 'total', 
      header: '총액',
      sortable: true,
      render: (value) => `₩${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      header: '상태',
      sortable: true,
      render: (value) => {
        const statusMap = {
          pending: { label: '대기중', className: 'bg-yellow-100 text-yellow-800' },
          processing: { label: '처리중', className: 'bg-blue-100 text-blue-800' },
          completed: { label: '완료', className: 'bg-green-100 text-green-800' },
          cancelled: { label: '취소', className: 'bg-red-100 text-red-800' }
        };
        const status = statusMap[value];
        return (
          <span className={`px-2 py-1 rounded text-xs ${status.className}`}>
            {status.label}
          </span>
        );
      }
    }
  ];

  return (
    <SmartTable
      data={orders}
      columns={columns}
      searchable={true}
      searchPlaceholder="주문번호 또는 고객명으로 검색..."
    />
  );
}
```

## 고급 기능

### 커스텀 정렬

```tsx
const columns = [
  {
    key: 'priority',
    header: '우선순위',
    sortable: true,
    customSort: (a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
  }
];
```

### 조건부 스타일링

```tsx
const columns = [
  {
    key: 'status',
    header: '상태',
    className: (value, item) => 
      value === 'error' ? 'bg-red-50' : 'bg-white'
  }
];
```

### 다중 검색 필드

```tsx
<SmartTable
  data={data}
  columns={columns}
  searchable={true}
  searchFields={['name', 'email', 'phone']}
  searchPlaceholder="이름, 이메일, 전화번호로 검색..."
/>
```

## 접근성 기능

- **키보드 네비게이션**: Tab 키로 포커스 이동
- **정렬 표시**: 현재 정렬 상태 시각적 표시  
- **스크린 리더**: 테이블 구조 및 정렬 상태 설명
- **ARIA 라벨**: 적절한 role 및 aria 속성

## 성능 최적화

- **가상화**: 큰 데이터셋에 대한 윈도우 렌더링
- **디바운싱**: 검색 입력 최적화  
- **메모이제이션**: 정렬/필터링 결과 캐싱
- **지연 로딩**: 필요시에만 데이터 처리 