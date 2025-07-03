# AdvancedSearch 기술 문서

## 아키텍처 개요

Accordion 컴포넌트를 활용한 검색 폼 컨테이너로, 그리드 레이아웃과 버튼 시스템을 통합합니다.

## 핵심 구현

### 컴포넌트 구조
```tsx
<Accordion title={title} defaultOpen={defaultOpen}>
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {children}
    </div>
    {showButtons && <ButtonActions />}
  </div>
</Accordion>
```

### 그리드 시스템
- **모바일**: 1열 배치
- **데스크톱**: 3열 배치 (`md:grid-cols-3`)
- **반응형**: CSS Grid 자동 조정

### 버튼 시스템
```tsx
const ButtonActions = () => (
  <div className="flex justify-end gap-2">
    <ResetButton />
    <SearchButton />
  </div>
);
```

## 의존성 관리

### 외부 컴포넌트
- **Accordion**: `@/components/ui/ui-layout/accordion`
- **Lucide Icons**: `RotateCcw`, `Search`

### Props 인터페이스
```typescript
interface AdvancedSearchProps {
  title?: string;
  children: ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
  searchLabel?: string;
  resetLabel?: string;
  defaultOpen?: boolean;
  showButtons?: boolean;
  statusText?: string;
}
```

## 스타일링 패턴

### 뉴모피즘 적용
```css
.neu-raised {
  /* 양각 효과 스타일 */
}
```

### 버튼 변형
- **리셋 버튼**: `bg-background neu-raised`
- **검색 버튼**: `bg-primary neu-raised`

### 반응형 간격
```css
.space-y-6 /* 세로 간격 */
.gap-4 /* 그리드 간격 */
.gap-2 /* 버튼 간격 */
```

## 확장 패턴

### 커스텀 액션
```tsx
interface ExtendedSearchProps extends AdvancedSearchProps {
  onExport?: () => void;
  onSave?: () => void;
  customActions?: React.ReactNode;
}
```

### 조건부 렌더링
```tsx
{showAdvanced && (
  <AdvancedSearch>
    <AdvancedFields />
  </AdvancedSearch>
)}
``` 