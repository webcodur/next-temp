# FlipText

텍스트의 각 문자를 개별적으로 회전시키는 애니메이션 컴포넌트다.

## 기능

- **문자별 애니메이션**: 각 문자가 개별적으로 3D 회전 효과와 함께 나타남
- **순차적 등장**: 문자들이 순차적으로 등장하여 자연스러운 애니메이션 연출
- **커스텀 요소**: `as` prop으로 렌더링할 HTML 요소 타입 지정 가능
- **애니메이션 제어**: 지속 시간과 지연 시간 세밀한 조정 가능

## 사용법

### 기본 사용

```tsx
import { FlipText } from '@/components/ui/ui-effects/flip-text/FlipText';

<FlipText>안녕하세요!</FlipText>;
```

### 커스텀 애니메이션

```tsx
<FlipText
  duration={0.8}
  delayMultiple={0.1}
  className="text-xl font-bold text-primary">
  환영합니다
</FlipText>
```

### 커스텀 요소 타입

```tsx
<FlipText as="h1" className="text-2xl">
  제목 텍스트
</FlipText>
```

### 커스텀 애니메이션 변형

```tsx
const customVariants = {
  hidden: {
    rotateY: 90,
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
  },
};

<FlipText variants={customVariants}>커스텀 애니메이션</FlipText>;
```

## Props

| Prop            | Type              | Default  | Description                         |
| --------------- | ----------------- | -------- | ----------------------------------- |
| `children`      | `React.ReactNode` | -        | 애니메이션할 텍스트 내용 (필수)     |
| `duration`      | `number`          | `0.5`    | 각 문자의 애니메이션 지속 시간 (초) |
| `delayMultiple` | `number`          | `0.08`   | 문자 간 지연 시간 배수              |
| `className`     | `string`          | -        | 추가 CSS 클래스                     |
| `as`            | `ElementType`     | `"span"` | 렌더링할 HTML 요소 타입             |
| `variants`      | `Variants`        | -        | 커스텀 Framer Motion 변형           |

## 특징

### 자동 공백 처리

공백 문자는 non-breaking space(`\u00A0`)로 자동 변환되어 레이아웃 유지

### 3D 회전 효과

기본적으로 X축 기준 -90도에서 0도로 회전하며 등장

### 순차적 타이밍

각 문자가 `delayMultiple * index` 만큼 지연되어 순차적으로 애니메이션 실행

## 활용 예시

- 페이지 타이틀 애니메이션
- 로딩 텍스트 효과
- 브랜드 로고 텍스트
- 키 메시지 강조
- 게임/앱 인트로 텍스트
