# NeumorphicContainer 기술 문서

## 아키텍처 개요

CSS-in-JS 방식으로 구현된 뉴모피즘 컨테이너 시스템으로, 4가지 시각적 효과를 제공합니다.

## 핵심 기술 스택

### 구현 방식
- **CSS-in-JS**: React inline styles로 동적 스타일링
- **CSS Variables**: 테마 시스템과 연동된 색상 관리
- **Tailwind CSS**: 기본 클래스와 유틸리티

### 색상 시스템
```typescript
// styles/neumorphicColors.ts
export const BACKGROUND = 'hsl(var(--background))';
export const RAISED_LIGHT_SIDE = 'hsl(var(--raised-light-side))';
export const RAISED_SHADE_SIDE = 'hsl(var(--raised-shade-side))';
export const INSET_LIGHT_SIDE = 'hsl(var(--inset-light-side))';
export const INSET_SHADE_SIDE = 'hsl(var(--inset-shade-side))';
```

## 구현 패턴

### 1. 공통 인터페이스
```typescript
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}
```

### 2. 그림자 시스템

**RaisedContainer:**
```typescript
boxShadow: `-8px -8px 20px ${RAISED_LIGHT_SIDE}, 8px 8px 20px ${RAISED_SHADE_SIDE}`
```

**InsetContainer:**
```typescript
boxShadow: `inset 6px 6px 16px ${INSET_SHADE_SIDE}, inset -6px -6px 16px ${INSET_LIGHT_SIDE}`
```

**CircleContainer:**
```typescript
// 외부 그림자
boxShadow: `-10px -10px 25px ${CIRCLE_LIGHT_SIDE}, 10px 10px 25px ${CIRCLE_SHADE_SIDE}`

// 내부 그림자 (가상 요소)
boxShadow: `inset 8px 8px 20px ${CIRCLE_INSET_SHADE_SIDE}, inset -8px -8px 20px ${CIRCLE_INSET_LIGHT_SIDE}`
```

### 3. 레이아웃 시스템

**기본 구조:**
- 기본 패딩: `p-4` (16px)
- 기본 반지름: `rounded-md`
- 유연한 확장: `className` prop

**CircleContainer 특수 구조:**
```typescript
// 외부 컨테이너: 고정 크기, flexbox 센터링
className="flex justify-center items-center relative h-64 w-64 rounded-full"

// 내부 컨테이너: 80% 크기, 이중 그림자 효과
className="absolute h-[80%] w-[80%] rounded-full"
```

## 성능 최적화

### 1. CSS 최적화
- **box-shadow 사용**: GPU 가속 활용
- **CSS 변수 캐싱**: 색상 계산 최소화
- **인라인 스타일**: 번들 크기 최소화

### 2. 렌더링 최적화
```typescript
// 메모이제이션이 필요한 경우
const MemoizedContainer = React.memo(RaisedContainer);
```

## 테마 시스템 통합

### 1. CSS 변수 의존성
```css
:root {
  --background: 210 40% 98%;
  --raised-light-side: 0 0% 100%;
  --raised-shade-side: 210 40% 90%;
  --inset-light-side: 0 0% 100%;
  --inset-shade-side: 210 40% 85%;
}

[data-theme="dark"] {
  --background: 222.2 84% 4.9%;
  --raised-light-side: 222.2 84% 6%;
  --raised-shade-side: 222.2 84% 3%;
}
```

### 2. 동적 색상 계산
- HSL 색상 공간 활용
- 명도(Lightness) 조정으로 그림자 생성
- 다크/라이트 모드 자동 적응

## 확장성 패턴

### 1. 새로운 효과 추가
```typescript
export const GlowContainer: React.FC<ContainerProps> = ({ children, className }) => (
  <div 
    className={cn('p-4 rounded-md', className)}
    style={{
      background: BACKGROUND,
      boxShadow: `0 0 20px ${GLOW_COLOR}`,
    }}
  >
    {children}
  </div>
);
```

### 2. 크기 변형 시스템
```typescript
interface SizableContainerProps extends ContainerProps {
  size?: 'sm' | 'md' | 'lg';
}

const shadowSizes = {
  sm: { blur: 10, spread: 4 },
  md: { blur: 20, spread: 8 },
  lg: { blur: 30, spread: 12 },
};
```

## 브라우저 호환성

### 지원 범위
- **box-shadow**: IE9+
- **CSS Variables**: Modern browsers, IE11+ with polyfill
- **Flexbox**: IE10+

### 폴백 전략
```typescript
const fallbackStyles = {
  boxShadow: CSS.supports('box-shadow', 'inset 0 0 0 #000') 
    ? dynamicShadow 
    : 'none'
};
```

## 알려진 제한사항

1. **성능**: 많은 컨테이너 동시 사용 시 렌더링 부하
2. **접근성**: 색상에만 의존한 시각적 구분
3. **커스터마이징**: 그림자 값 하드코딩

## 개선 계획

1. **CSS 클래스 생성**: 런타임 스타일 계산 최소화
2. **ARIA 속성**: 접근성 개선
3. **애니메이션**: 상태 전환 효과 추가 