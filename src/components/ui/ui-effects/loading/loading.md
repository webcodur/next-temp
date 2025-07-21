# Loading Components

다양한 로딩 애니메이션 효과를 제공하는 컴포넌트 집합이다.

## 컴포넌트 목록

### Ripple
파도 효과가 확산되는 로딩 애니메이션이다.

**기본 사용법:**
```tsx
import { Ripple } from '@/components/ui/ui-effects/loading/Ripple';

<Ripple />
```

**Props:**
- `mainCircleSize?: number` - 메인 원의 크기 (기본값: size에 따라 결정)
- `mainCircleOpacity?: number` - 메인 원의 투명도 (기본값: 0.24)
- `numCircles?: number` - 원의 개수 (기본값: 8)
- `size?: 'small' | 'medium' | 'large'` - 크기 (기본값: 'medium')
- `color?: 'blue' | 'green' | 'red' | 'purple'` - 색상 (기본값: 'blue')

### Spinner
회전하는 원형 로딩 스피너이다.

**기본 사용법:**
```tsx
import { Spinner } from '@/components/ui/ui-effects/loading/Spinner';

<Spinner />
```

**Props:**
- `size?: 'small' | 'medium' | 'large'` - 크기 (기본값: 'medium')
- `color?: 'blue' | 'green' | 'red' | 'purple'` - 색상 (기본값: 'blue')

### Dots
3개의 점이 튀어오르는 로딩 애니메이션이다.

**기본 사용법:**
```tsx
import { Dots } from '@/components/ui/ui-effects/loading/Dots';

<Dots />
```

**Props:**
- `size?: 'small' | 'medium' | 'large'` - 크기 (기본값: 'medium')
- `color?: 'blue' | 'green' | 'red' | 'purple'` - 색상 (기본값: 'blue')

### Pulse
맥박 효과가 있는 원형 로딩 애니메이션이다.

**기본 사용법:**
```tsx
import { Pulse } from '@/components/ui/ui-effects/loading/Pulse';

<Pulse />
```

**Props:**
- `size?: 'small' | 'medium' | 'large'` - 크기 (기본값: 'medium')
- `color?: 'blue' | 'green' | 'red' | 'purple'` - 색상 (기본값: 'blue')

### Wave
웨이브 패턴의 바 로딩 애니메이션이다.

**기본 사용법:**
```tsx
import { Wave } from '@/components/ui/ui-effects/loading/Wave';

<Wave />
```

**Props:**
- `size?: 'small' | 'medium' | 'large'` - 크기 (기본값: 'medium')
- `color?: 'blue' | 'green' | 'red' | 'purple'` - 색상 (기본값: 'blue')

## 공통 특징

- 모든 컴포넌트는 `size`와 `color` prop을 지원한다
- React.memo로 최적화되어 있다
- Tailwind CSS 기반으로 구현되었다
- 추가 className과 HTML 속성을 전달할 수 있다

## 사용 예시

```tsx
// 다양한 크기와 색상 조합
<Ripple size="large" color="purple" />
<Spinner size="small" color="green" />
<Dots color="red" />
<Pulse size="large" />
<Wave color="blue" />

// 커스텀 스타일링
<Ripple className="opacity-75" />
<Spinner className="mx-auto" />
```

## 스타일 커스터마이징

각 컴포넌트는 className prop을 통해 추가 스타일링이 가능하다. 또한 CSS 변수를 통해 애니메이션 속도나 색상을 세밀하게 조정할 수 있다. 