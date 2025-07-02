# Badge 컴포넌트

상태, 알림, 카테고리 등을 간결하게 표시하기 위한 UI 컴포넌트입니다.

## 사용법

```tsx
import { Badge } from '@/components/ui/ui-effects/badge/Badge';

// 기본 사용
<Badge>Default</Badge>

// variant 별 사용
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

// 추가 스타일링
<Badge className="bg-blue-500 text-white">
  Custom Badge
</Badge>
```

## Props

- `variant`: "default" | "secondary" | "destructive" | "outline" - 배지의 시각적 스타일을 결정합니다.
- `className`: string - 추가적인 Tailwind CSS 클래스를 적용할 수 있습니다.
- 기타 HTML `div` 속성들을 지원합니다.

## 기능

- **4가지 기본 스타일**: `default`, `secondary`, `destructive`, `outline` 변형을 제공합니다.
- **뉴모피즘 디자인**: `neu-flat` 스타일을 기본으로 적용하여 일관된 디자인을 유지합니다.
- **커스텀 스타일링**: `className`을 통해 쉽게 스타일을 확장하거나 재정의할 수 있습니다.
- **접근성**: 포커스 상태에 대한 시각적 피드백을 포함합니다. 