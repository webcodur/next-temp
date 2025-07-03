# Tabs 컴포넌트 기술 문서

## 아키텍처 개요

상태 관리와 키보드 네비게이션을 지원하는 접근 가능한 탭 시스템입니다.

## 핵심 구현

### 상태 관리
```typescript
const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
```

### 키보드 네비게이션
- 좌우 화살표: 탭 간 이동
- Space/Enter: 탭 활성화
- Home/End: 첫/마지막 탭 이동

### 변형 시스템
- **default**: 기본 네모난 탭
- **pills**: 알약 모양 탭
- **underline**: 하단 밑줄 탭

## 접근성 구현

### ARIA 속성
```typescript
role="tablist"
role="tab"
aria-selected={isActive}
aria-controls={`panel-${tab.id}`}
```

### 키보드 지원
```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowLeft': // 이전 탭
    case 'ArrowRight': // 다음 탭
    case 'Home': // 첫 번째 탭
    case 'End': // 마지막 탭
  }
};
```

## 스타일링 시스템

### CVA 변형 관리
```typescript
const tabVariants = cva(baseClasses, {
  variants: {
    variant: {
      default: 'border-b-2 border-transparent',
      pills: 'rounded-full',
      underline: 'border-b-2'
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    }
  }
});
```

## 성능 최적화

- 불필요한 리렌더링 방지
- 키보드 이벤트 효율적 처리
- 조건부 콘텐츠 렌더링 