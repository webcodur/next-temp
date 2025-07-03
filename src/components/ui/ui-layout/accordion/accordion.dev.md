# Accordion 컴포넌트 기술 문서

## 아키텍처 개요

Radix UI 기반의 접근 가능한 아코디언 컴포넌트로, 애니메이션과 키보드 지원을 제공합니다.

## 핵심 구현

### Radix UI 활용
```typescript
import * as AccordionPrimitive from "@radix-ui/react-accordion";
```

### 상태 관리
- **Single Mode**: 한 번에 하나만 열림
- **Multiple Mode**: 여러 항목 동시 열림
- **Collapsible**: 열린 항목 다시 닫기

### 애니메이션 시스템
```css
[data-state="open"] {
  animation: slideDown 300ms ease-out;
}
[data-state="closed"] {
  animation: slideUp 300ms ease-out;
}
```

## 접근성 구현

### ARIA 지원
- `aria-expanded`: 펼침 상태
- `aria-controls`: 제어 대상
- `role="button"`: 트리거 역할

### 키보드 네비게이션
- Space/Enter: 토글
- 화살표 키: 포커스 이동
- Home/End: 첫/마지막 항목

## 스타일링 패턴

### CVA 기반 변형
```typescript
const accordionVariants = cva(baseClasses, {
  variants: {
    variant: {
      default: "border border-border",
      ghost: "border-none"
    }
  }
});
``` 