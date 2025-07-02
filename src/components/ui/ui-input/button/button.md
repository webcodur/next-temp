# Button 컴포넌트

뉴모피즘 디자인 스타일의 기본 버튼 컴포넌트입니다.

## 사용법

```tsx
import { Button } from '@/components/ui/ui-input/button/Button';

// 기본 사용
<Button>클릭하세요</Button>

// 이벤트 핸들러
<Button onClick={() => console.log('클릭됨')}>
  클릭 이벤트
</Button>

// 비활성화
<Button disabled>비활성 버튼</Button>

// 사이즈 변경
<Button className="px-6 py-3 text-lg">
  큰 버튼
</Button>
```

## Props

- `children`: React.ReactNode - 버튼 내용
- `onClick`: () => void - 클릭 이벤트 핸들러
- `disabled`: boolean - 비활성화 상태
- `className`: string - 추가 CSS 클래스
- 기타 HTML button 속성들

## 기능

- 뉴모피즘 디자인 (`neu-raised` → `neu-inset`)
- 호버 및 활성 상태 애니메이션
- 접근성 지원
- 커스텀 스타일링 가능 