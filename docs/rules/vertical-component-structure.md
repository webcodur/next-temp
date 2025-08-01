# 수직적 컴포넌트 구조 가이드

## 핵심 원리

컴포넌트를 기능별로 중첩시켜 계층을 만든다

Manager
└── Card
└── Settings

## 기본 원칙

**포함 관계**

- 상위 컴포넌트가 하위 컴포넌트를 포함한다
- 각 컴포넌트는 자신보다 작은 단위의 컴포넌트들로 구성된다
- 깊이는 기능의 복잡성에 따라 결정된다

## 예시

```
orderManager/
├── OrderManager.tsx          # 최상위 관리자
├── useOrderOperations.ts     # 비즈니스 로직
├── orderFilters/             # 수평적 - 필터링 기능
│   ├── OrderFilters.tsx
│   ├── StatusFilter.tsx
│   └── DateFilter.tsx
├── orderList/                # 수직적 - 목록 표시
│   ├── OrderList.tsx
│   └── orderCard/            # 수직적 - 개별 항목
│       ├── OrderCard.tsx
│       └── orderDetails/     # 수직적 - 카드 상세
│           ├── OrderDetails.tsx
│           ├── ProductList.tsx
│           └── PaymentInfo.tsx
└── orderActions/             # 수평적 - 전역 액션들
    ├── OrderActions.tsx
    ├── BulkActions.tsx
    └── ExportButton.tsx
```

## 구조 설계 팁

**수직적 관계**

- 기능의 포함 관계를 나타낸다
- Manager → List → Card → Details 순으로 깊어진다
- 각 레벨은 하위 레벨을 완전히 제어한다

**수평적 관계**

- 같은 추상화 레벨의 독립적 기능들
- Filters, Actions, Controls 등은 보통 수평적이다
- 서로 독립적이지만 상위 컴포넌트에서 조율된다

**깊이 결정 기준**

- 3-4레벨: 일반적인 복잡도
- 5-6레벨: 높은 복잡도 (달력, 에디터 등)
- 7레벨 이상: 매우 복잡한 도메인만 허용
