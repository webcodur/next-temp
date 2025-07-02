# Tooltip 컴포넌트

추가 정보를 제공하거나 기능 힌트를 표시하는 데 사용되는 툴팁 컴포넌트입니다.

## 주요 특징

- **Portal 기반**: React Portal을 통해 DOM 트리 최상위에 렌더링되어 레이아웃 제약 없음
- **다양한 variant**: default, info, warning, error 스타일 지원
- **위치 조정**: top, right, bottom, left 위치 자동 조정
- **애니메이션**: Framer Motion 기반 부드러운 등장/사라짐 효과
- **접근성**: Radix UI 기반으로 ARIA 속성 자동 지원
- **뉴모피즘 디자인**: 프로젝트 디자인 시스템과 일관된 스타일

## Portal 장점

툴팁은 `TooltipPortal`을 통해 DOM 트리 최상위에 렌더링됩니다:

- **오버플로우 제약 해결**: `overflow: hidden` 컨테이너에 가려지지 않음
- **z-index 충돌 방지**: 다른 레이아웃 요소에 가려지지 않음
- **화면 경계 처리**: 뷰포트 경계에서 자동 위치 조정
- **스크롤 영역 지원**: 스크롤 가능한 영역 내부에서도 올바른 표시

## 사용법

### 기본 사용법

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip/Tooltip';

function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>호버하세요</TooltipTrigger>
        <TooltipContent>
          도움말 메시지입니다.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

### Variant 사용

```tsx
<TooltipContent variant="info">
  정보성 메시지
</TooltipContent>

<TooltipContent variant="warning">
  경고 메시지
</TooltipContent>

<TooltipContent variant="error">
  오류 메시지
</TooltipContent>
```

### 위치 조정

```tsx
<TooltipContent side="top">위쪽 툴팁</TooltipContent>
<TooltipContent side="right">오른쪽 툴팁</TooltipContent>
<TooltipContent side="bottom">아래쪽 툴팁</TooltipContent>
<TooltipContent side="left">왼쪽 툴팁</TooltipContent>
```

### 커스텀 Portal 컨테이너

```tsx
<TooltipContent container={customContainer}>
  특정 컨테이너에 렌더링
</TooltipContent>
```

## Props

### TooltipContent

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `variant` | `'default' \| 'info' \| 'warning' \| 'error'` | `'default'` | 툴팁 스타일 variant |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | 툴팁 표시 위치 |
| `sideOffset` | `number` | `4` | 트리거로부터의 거리 |
| `noArrow` | `boolean` | `false` | 화살표 표시 여부 |
| `container` | `HTMLElement \| null` | `undefined` | Portal 컨테이너 요소 |

## 레이아웃 오버플로우 테스트

다음 상황에서 툴팁이 올바르게 표시되는지 확인하세요:

1. **Overflow Hidden**: `overflow: hidden` 컨테이너 내부
2. **스크롤 영역**: 스크롤 가능한 영역 내부
3. **화면 경계**: 뷰포트 경계 근처
4. **중첩 레이아웃**: 복잡한 레이아웃 구조 내부

## 사용 예시

- 폼 필드 도움말
- 버튼 기능 설명
- 아이콘 의미 설명
- 코드 복사 버튼
- 설정 옵션 안내

## 접근성

- 키보드 포커스 지원
- 화면 리더 호환
- ARIA 속성 자동 적용
- 적절한 컬러 콘트라스트

## 성능 고려사항

- Portal 사용으로 불필요한 리렌더링 방지
- 지연 표시로 의도하지 않은 툴팁 표시 방지
- 메모리 누수 방지를 위한 적절한 정리 