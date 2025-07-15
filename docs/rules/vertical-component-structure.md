# 수직적 컴포넌트 구조 가이드

## 핵심 원리

컴포넌트를 기능별로 중첩시켜 계층을 만든다

```
Manager
└── Card
    └── Settings
```

## 기본 원칙

**포함 관계**
- 상위 컴포넌트가 하위 컴포넌트를 포함한다
- 각 컴포넌트는 자신보다 작은 단위의 컴포넌트들로 구성된다
- 깊이는 기능의 복잡성에 따라 결정된다

## 예시

```
orderManager/
├── OrderManager.tsx
├── useOrderOperations.ts
└── OrderCard/
    ├── OrderCard.tsx
    └── OrderDetails/
        ├── OrderDetails.tsx
        └── PaymentForm.tsx
``` 