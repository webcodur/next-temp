# Animation Components

다양한 애니메이션 효과들을 제공하는 컴포넌트들입니다.

## Components

### DotPattern
점 패턴 배경을 생성하는 컴포넌트입니다. SVG를 사용하여 반응형 점 패턴을 만들고, 선택적으로 글로우 효과를 적용할 수 있습니다.

**Props:**
- `width?: number` - 점들 사이의 수평 간격 (기본값: 16)
- `height?: number` - 점들 사이의 수직 간격 (기본값: 16)
- `glow?: boolean` - 글로우 애니메이션 효과 적용 여부 (기본값: false)
- `className?: string` - 추가 CSS 클래스

### BorderBeam
테두리에 빔 효과를 적용하는 컴포넌트입니다.

### Ripple
물결 효과를 생성하는 컴포넌트입니다.

### FlickeringGrid
깜빡이는 그리드 효과를 생성하는 컴포넌트입니다.

### TextAnimate
텍스트 애니메이션을 제공하는 컴포넌트입니다.

**Props:**
- `children: string` - 애니메이션할 텍스트
- `by?: 'text' | 'word' | 'character' | 'line'` - 텍스트 분할 방식 (기본값: 'word')
- `animation?: string` - 애니메이션 타입 (기본값: 'fadeIn')
- `delay?: number` - 애니메이션 시작 지연 시간
- `duration?: number` - 애니메이션 지속 시간

### NumberTicker
숫자 카운터 애니메이션을 제공하는 컴포넌트입니다.

**Props:**
- `value: number` - 표시할 숫자 값

## Usage

```tsx
import { DotPattern, TextAnimate, NumberTicker } from '@/components/ui/ui-effects/animation';

// DotPattern 사용
<DotPattern width={20} height={20} glow={true} className="opacity-50" />

// TextAnimate 사용
<TextAnimate by="character" animation="slideUp">
  Animated Text
</TextAnimate>

// NumberTicker 사용
<NumberTicker value={12345} />
``` 