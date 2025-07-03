# Collapsible 컴포넌트

접고 펼칠 수 있는 콘텐츠 영역을 제공하는 컴포넌트입니다.

## 구성 요소

- `Collapsible` - 기본 컨테이너
- `CollapsibleTrigger` - 접기/펼치기 트리거
- `CollapsibleContent` - 접히는 콘텐츠 영역

## 기본 사용법

```tsx
import { 
  Collapsible, 
  CollapsibleTrigger, 
  CollapsibleContent 
} from '@/coponents/ui/ui-layout/collapsible/Collapsible';

<Collapsible>
  <CollapsibleTrigger>
    제목을 클릭하여 펼치기/접기
  </CollapsibleTrigger>
  <CollapsibleContent>
    여기에 접힐 콘텐츠가 들어갑니다.
  </CollapsibleContent>
</Collapsible>
```

## 주요 기능

- **Radix UI 기반**: 검증된 접근성과 키보드 네비게이션
- **애니메이션 지원**: 부드러운 펼치기/접기 효과
- **접근성 완전 지원**: ARIA 속성과 스크린 리더 호환
- **상태 제어**: open/onOpenChange props로 외부 상태 관리
- **유연한 트리거**: asChild prop으로 커스텀 트리거 가능
