# ListHighlightMarker

리스트나 드롭다운에서 항목 선택 시 **좌측 하이라이트 바**를 제공하는 간소화된 컴포넌트이다.

## 주요 특징

- **좌측 하이라이트**: 활성 상태에서 왼쪽 가장자리에 색상 바 표시
- **전역 스타일**: 얼룩무늬 패턴을 전역 CSS 클래스로 분리하여 일관성 확보
- **카운터 표시**: 현재 인덱스와 총 개수 자동 표시

## 전역 CSS 클래스

```css
/* 기본 얼룩무늬 항목 */
.list-item-zebra        /* 기본 레이아웃과 애니메이션 */
.list-item-even         /* 짝수 줄 (흰색 배경) */
.list-item-odd          /* 홀수 줄 (연한 회색 배경) */
.list-item-active       /* 활성화 상태 (좌측 바 + 강조 효과) */
.list-item-disabled     /* 비활성화 상태 */
.list-item-hover        /* 기본 호버 효과 */
```

## 사용법

### 기본 사용

```tsx
import { ListHighlightMarker } from '@/components/ui/list-highlight-marker';

<ListHighlightMarker
  index={0}
  totalCount={items.length}
  isSelected={selectedIds.includes(item.id)}
  onClick={() => handleSelect(item.id)}>
  {item.label}
</ListHighlightMarker>
```

### 키보드 네비게이션

```tsx
<ListHighlightMarker
  index={index}
  totalCount={items.length}
  isHighlighted={highlightedIndex === index}
  isHovered={hoveredIndex === index}
  onMouseEnter={() => setHoveredIndex(index)}
  onMouseLeave={() => setHoveredIndex(-1)}>
  {item.label}
</ListHighlightMarker>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | - | 인덱스 (0부터 시작) |
| `totalCount` | `number` | - | 총 아이템 수 |
| `isSelected` | `boolean` | `false` | 선택됨 여부 |
| `isHighlighted` | `boolean` | `false` | 하이라이트됨 여부 (키보드) |
| `isHovered` | `boolean` | `false` | 호버됨 여부 |
| `disabled` | `boolean` | `false` | 비활성화 여부 |
| `onClick` | `() => void` | - | 클릭 핸들러 |
| `onMouseEnter` | `() => void` | - | 마우스 엔터 핸들러 |
| `onMouseLeave` | `() => void` | - | 마우스 리브 핸들러 |
| `className` | `string` | `''` | 커스텀 클래스명 |
| `children` | `ReactNode` | - | 자식 컴포넌트 |

## 활용 예시

### FieldSelect에서 사용

드롭다운 옵션에 얼룩무늬 패턴과 하이라이트 효과 적용:

```tsx
// FieldSelect.tsx 내부에서 자동 적용됨
<ListHighlightMarker
  index={index}
  totalCount={filteredOptions.length}
  isSelected={isSelected}
  isHighlighted={isHighlighted}
  onClick={() => handleOptionSelect(option)}>
  {option.label}
</ListHighlightMarker>
```

### Table에서 사용

테이블 행에 전역 얼룩무늬 스타일 적용:

```tsx
// Table.tsx에서 전역 클래스 사용
className={cn(
  'list-item-zebra',
  isEven ? 'list-item-even' : 'list-item-odd',
  clickableRows && 'list-item-hover hover:list-item-active'
)}
```

## 상태별 효과

- **기본**: 얼룩무늬 배경 (짝수/홀수 번갈아가며)
- **호버**: 좌측 바 힌트 + 그림자
- **활성**: 좌측 강조 바 + 그림자 + 링
- **비활성**: 반투명 + 커서 비활성화
