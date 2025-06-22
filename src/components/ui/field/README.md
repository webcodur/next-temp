# Field 컴포넌트

Field 컴포넌트는 타이틀 없는 간소화된 텍스트 입력, 기본 셀렉트박스, 정렬 선택 등의 폼 요소를 제공한다.

## 디자인 철학

- **타이틀 없는 깔끔한 구조**: 별도 label 없이 placeholder와 기본값만 표시
- **직관적인 placeholder**: "xxx 선택" 형태의 명확한 안내 텍스트
- **뉴모피즘 기반**: 일관된 디자인 시스템 적용

## 컴포넌트 구성

### FieldText

- 기본 텍스트 입력 필드
- 검색 아이콘 옵션 지원
- Enter 키 이벤트 처리
- placeholder 중심 UI

### FieldSelect

- 기본 드롭다운 셀렉트박스
- 단일 선택만 지원
- "항목 선택" 기본 placeholder
- 옵션 리스트 기반 동작

### FieldSortSelect

- 정렬 전용 셀렉트박스
- 정렬 방향 토글 기능 내장
- "정렬 기준 선택" 기본 placeholder
- asc/desc 상태 표시

## 제거된 기능

v2.0부터 다음 기능들이 제거되어 구조가 간소화되었다:

- **콤보박스 모드** (검색 입력 + 드롭다운)
- **멀티셀렉트 기능**
- **필터 셀렉트 기능**
- **label/타이틀 표시** (v2.1에서 제거)

## 사용 예시

```tsx
import { FieldText, FieldSelect, FieldSortSelect } from '@/components/ui/field';

// 텍스트 필드
<FieldText
  placeholder="검색어 입력"
  value={searchValue}
  onChange={setSearchValue}
  showSearchIcon={true}
/>

// 기본 셀렉트
<FieldSelect
  placeholder="카테고리 선택"
  options={categoryOptions}
  value={selectedCategory}
  onChange={setSelectedCategory}
/>

// 정렬 셀렉트
<FieldSortSelect
  placeholder="정렬 기준 선택"
  options={sortOptions}
  value={sortValue}
  onChange={setSortValue}
  sortDirection={sortDirection}
  onSortDirectionChange={setSortDirection}
/>
```

## 스타일링

모든 컴포넌트는 뉴모피즘 디자인 클래스를 기반으로 한다:

- `neu-flat`: 기본 컨테이너 스타일
- `neu-raised`: 버튼 및 인터랙티브 요소
- `neu-inset`: 활성/포커스 상태

## 접근성

- 키보드 네비게이션 지원 (ArrowUp/Down, Enter, Escape)
- 적절한 ARIA 속성 적용
- 스크린 리더 호환성 고려

## 타입 정의

- `Option`: 셀렉트 옵션 구조
- `SortDirection`: 'asc' | 'desc'
- 각 컴포넌트별 Props 타입
