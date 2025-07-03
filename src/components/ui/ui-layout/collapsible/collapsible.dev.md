# Collapsible 개발 문서

## 기술 스택

- **Radix UI Collapsible**: 접근성과 키보드 네비게이션이 완벽하게 구현된 headless 컴포넌트
- **React Primitives**: 컴포넌트 합성 패턴으로 유연한 구조 제공

## 컴포넌트 구조

```tsx
// 단순한 Radix UI 래퍼
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;
```

## 핵심 기능

### 1. 상태 관리
- **비제어 모드**: 내부 상태로 자동 관리
- **제어 모드**: `open`과 `onOpenChange` props로 외부 상태 제어

```tsx
// 비제어 모드
<Collapsible defaultOpen={false}>

// 제어 모드  
<Collapsible open={isOpen} onOpenChange={setIsOpen}>
```

### 2. 접근성 기능
- **ARIA 속성**: `aria-expanded`, `aria-controls` 자동 관리
- **키보드 네비게이션**: Enter, Space로 토글 가능
- **포커스 관리**: 트리거 요소에 적절한 포커스 표시

### 3. 애니메이션 지원
Radix UI의 data 속성을 활용한 CSS 애니메이션:

```css
[data-state="open"] {
  animation: slideDown 300ms ease-out;
}

[data-state="closed"] {
  animation: slideUp 300ms ease-out;
}

@keyframes slideDown {
  from { height: 0; opacity: 0; }
  to { height: var(--radix-collapsible-content-height); opacity: 1; }
}

@keyframes slideUp {
  from { height: var(--radix-collapsible-content-height); opacity: 1; }
  to { height: 0; opacity: 0; }
}
```

## 고급 사용법

### 1. asChild 패턴
기존 HTML 요소나 커스텀 컴포넌트를 트리거로 사용:

```tsx
<CollapsibleTrigger asChild>
  <button className="custom-button">
    {isOpen ? <MinusIcon /> : <PlusIcon />}
    클릭하여 토글
  </button>
</CollapsibleTrigger>
```

### 2. 다중 콘텐츠 영역
하나의 트리거로 여러 콘텐츠 제어:

```tsx
<Collapsible>
  <CollapsibleTrigger>모든 섹션 토글</CollapsibleTrigger>
  <CollapsibleContent>첫 번째 섹션</CollapsibleContent>
  <CollapsibleContent>두 번째 섹션</CollapsibleContent>
</Collapsible>
```

### 3. 중첩 구조
Collapsible 안에 다른 Collapsible 배치:

```tsx
<Collapsible>
  <CollapsibleTrigger>메인 카테고리</CollapsibleTrigger>
  <CollapsibleContent>
    <Collapsible>
      <CollapsibleTrigger>서브 카테고리</CollapsibleTrigger>
      <CollapsibleContent>상세 내용</CollapsibleContent>
    </Collapsible>
  </CollapsibleContent>
</Collapsible>
```

## 스타일링 가이드

### Data 속성 활용
```css
/* 트리거 상태별 스타일 */
[data-state="open"] .trigger-icon {
  transform: rotate(180deg);
}

/* 콘텐츠 영역 스타일 */
[data-state="open"] .content {
  padding: 1rem;
}

[data-state="closed"] .content {
  padding: 0;
}
```

### Tailwind CSS 클래스
```tsx
<CollapsibleTrigger className="
  flex items-center justify-between w-full p-4
  bg-white hover:bg-gray-50 border rounded-lg
  transition-colors duration-200
  data-[state=open]:bg-blue-50
">
```

## 성능 최적화

### 1. 조건부 렌더링 방지
Collapsible은 콘텐츠를 DOM에 유지하면서 CSS로만 숨김/표시하므로 리렌더링 최소화

### 2. 메모이제이션 활용
```tsx
const MemoizedContent = memo(({ children }) => (
  <CollapsibleContent>{children}</CollapsibleContent>
));
```

### 3. 이벤트 핸들러 최적화
```tsx
const handleToggle = useCallback((open: boolean) => {
  // 상태 업데이트 로직
}, []);

<Collapsible onOpenChange={handleToggle}>
```

## 디버깅 팁

1. **상태 확인**: React DevTools에서 Radix 내부 상태 모니터링
2. **접근성 테스트**: 스크린 리더로 ARIA 속성 동작 확인
3. **키보드 테스트**: Tab, Enter, Space 키 네비게이션 검증 