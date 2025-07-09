# Chip 컴포넌트

`Chip`은 사용자가 선택할 수 있는 옵션을 작은 칩 형태로 표시하는 UI 컴포넌트다. 카테고리 선택, 필터 옵션, 태그 관리 등 다양한 상황에서 직관적인 선택 인터페이스를 제공한다.

## 핵심 개념

**선택형 칩**: 클릭하여 활성/비활성 상태를 토글할 수 있는 작은 버튼 형태의 UI  
**다중 선택**: 여러 개의 칩을 동시에 선택하여 복합적인 조건이나 옵션을 설정  
**시각적 피드백**: 뉴모피즘 디자인으로 선택 상태를 명확하게 구분

## 1. 기본 사용법

### 단일 Chip

```tsx
import { Chip } from '@/components/ui/ui-effects/chip/Chip';

// 기본 사용
<Chip
  label="입주차량"
  active={isSelected}
  onToggle={() => setIsSelected(!isSelected)}
/>

// 크기 및 스타일 변형
<Chip
  label="VIP 회원"
  active={isVip}
  size="lg"
  variant="outline"
  onToggle={() => setIsVip(!isVip)}
/>
```

### ChipGroup (다중 선택)

```tsx
import { ChipGroup } from '@/components/ui/ui-effects/chip/Chip';

const [selectedCategories, setSelectedCategories] = useState(['입주', '방문']);

<ChipGroup
  options={[
    { value: 'resident', label: '입주' },
    { value: 'visitor', label: '방문' },
    { value: 'business', label: '업무' },
    { value: 'delivery', label: '택배' }
  ]}
  selected={selectedCategories}
  onSelectionChange={setSelectedCategories}
  layout="grid"
  chipProps={{ size: 'md', variant: 'default' }}
/>
```

## 2. Props 상세

### Chip Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `label` | `string` | - | 칩에 표시될 텍스트 |
| `active` | `boolean` | - | 선택 상태 (true=선택됨) |
| `onToggle` | `() => void` | - | 토글 이벤트 핸들러 |
| `disabled` | `boolean` | `false` | 비활성화 상태 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 칩 크기 |
| `variant` | `'default' \| 'outline'` | `'default'` | 스타일 변형 |
| `className` | `string` | `''` | 추가 CSS 클래스 |

### ChipGroup Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `options` | `Array<{value, label, disabled?}>` | - | 선택 가능한 옵션들 |
| `selected` | `string[]` | - | 선택된 값들의 배열 |
| `onSelectionChange` | `(selected: string[]) => void` | - | 선택 변경 핸들러 |
| `layout` | `'grid' \| 'flex'` | `'grid'` | 레이아웃 방식 |
| `chipProps` | `Partial<ChipProps>` | `{}` | 개별 칩에 적용할 속성 |

## 3. 스타일 변형

### Size (크기)

```tsx
<Chip label="Small" size="sm" active={true} onToggle={() => {}} />
<Chip label="Medium" size="md" active={true} onToggle={() => {}} />
<Chip label="Large" size="lg" active={true} onToggle={() => {}} />
```

### Variant (스타일)

```tsx
// 기본 (뉴모피즘 raised/inset)
<Chip label="Default" variant="default" active={false} onToggle={() => {}} />

// 아웃라인 (테두리 강조)
<Chip label="Outline" variant="outline" active={false} onToggle={() => {}} />
```

## 4. 실제 사용 시나리오

### 주차 정책 설정

```tsx
const [allowedTypes, setAllowedTypes] = useState(['입주', '방문']);

<ChipGroup
  options={[
    { value: '입주', label: '입주차량' },
    { value: '방문', label: '방문차량' },
    { value: '업무', label: '업무차량' },
    { value: '임대', label: '임대차량' },
    { value: '미등록', label: '미등록', disabled: true }
  ]}
  selected={allowedTypes}
  onSelectionChange={setAllowedTypes}
  layout="grid"
/>
```

### 검색 필터

```tsx
const [activeFilters, setActiveFilters] = useState([]);

<div className="space-y-3">
  <h3>차량 유형</h3>
  <ChipGroup
    options={[
      { value: 'sedan', label: '승용차' },
      { value: 'suv', label: 'SUV' },
      { value: 'truck', label: '트럭' }
    ]}
    selected={activeFilters}
    onSelectionChange={setActiveFilters}
    layout="flex"
    chipProps={{ size: 'sm' }}
  />
</div>
```

### 권한 설정

```tsx
const [permissions, setPermissions] = useState(['read']);

<ChipGroup
  options={[
    { value: 'read', label: '읽기' },
    { value: 'write', label: '쓰기' },
    { value: 'delete', label: '삭제' },
    { value: 'admin', label: '관리자' }
  ]}
  selected={permissions}
  onSelectionChange={setPermissions}
  chipProps={{ variant: 'outline' }}
/>
```

## 5. 접근성 및 키보드 지원

- **키보드 탐색**: `Tab` 키로 포커스 이동
- **선택 토글**: `Space` 또는 `Enter` 키로 선택/해제
- **스크린 리더**: `aria-pressed` 속성으로 선택 상태 전달
- **비활성화**: `disabled` 상태에서 키보드 접근 차단

## 6. 디자인 특징

- **뉴모피즘**: 선택 상태에 따라 `neu-raised` ↔ `neu-inset` 전환
- **일관성**: 프로젝트의 전역 디자인 시스템과 완벽 호환
- **반응형**: 다양한 화면 크기에서 적절한 크기 조정
- **애니메이션**: 부드러운 상태 전환 효과 