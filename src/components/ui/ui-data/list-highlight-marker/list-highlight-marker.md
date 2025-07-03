# ListHighlightMarker

리스트나 드롭다운에서 항목 선택 시 **시각적 강화 효과**를 제공하는 컴포넌트이다.

## 주요 특징

- **호버 효과**: 왼쪽 가장자리 얇은 색상 바 + 우측으로 살짝 이동 transform
- **활성 효과**: 배경 색상 + 우측에 체크마크 아이콘 표시
- **순번 표시**: 현재 인덱스와 총 개수 자동 표시
- **접근성**: 키보드 네비게이션 및 비활성화 상태 지원

## 시각적 효과

### 호버 상태

- 왼쪽 가장자리에 primary 색상의 4px 테두리
- 우측으로 4px 이동하는 transform 효과
- 연한 배경 색상 적용

### 활성 상태 (선택됨/하이라이트)

- primary 색상의 5% 투명도 배경
- 왼쪽 가장자리 primary 색상 테두리 유지
- 우측에 체크마크 아이콘 (lucide-react Check) 표시
- fadeIn 애니메이션 적용

### 비활성화 상태

- 50% 투명도
- 마우스 포인터 비활성화
- 클릭 이벤트 차단

## 사용법

### 기본 사용

```tsx
import ListHighlightMarker from '@/components/ui/ui-data/list-highlight-marker/ListHighlightMarker';

<ListHighlightMarker
	index={0}
	totalCount={items.length}
	isSelected={selectedIds.includes(item.id)}
	onClick={() => handleSelect(item.id)}>
	<span className="font-medium">{item.title}</span>
	<span className="text-sm text-gray-500">{item.description}</span>
</ListHighlightMarker>;
```

### 키보드 네비게이션

```tsx
{
	items.map((item, index) => (
		<ListHighlightMarker
			key={item.id}
			index={index}
			totalCount={items.length}
			isSelected={selectedIds.includes(item.id)}
			isHighlighted={highlightedIndex === index}
			onClick={() => handleSelect(item.id)}>
			{item.label}
		</ListHighlightMarker>
	));
}
```

### 드롭다운에서 활용

```tsx
// FieldSelect에서 사용 예시
<ListHighlightMarker
	index={index}
	totalCount={filteredOptions.length}
	isSelected={selectedValue === option.value}
	isHighlighted={highlightedIndex === index}
	onClick={() => handleOptionSelect(option)}
	disabled={option.disabled}>
	<div className="flex items-center gap-2">
		{option.icon && <option.icon className="w-4 h-4" />}
		<span>{option.label}</span>
	</div>
</ListHighlightMarker>
```

## Props

| Prop            | Type         | Default | Description                           |
| --------------- | ------------ | ------- | ------------------------------------- |
| `index`         | `number`     | -       | 인덱스 (0부터 시작)                   |
| `totalCount`    | `number`     | -       | 총 아이템 수                          |
| `isSelected`    | `boolean`    | `false` | 선택됨 여부 (active 상태)             |
| `isHighlighted` | `boolean`    | `false` | 하이라이트됨 여부 (키보드 네비게이션) |
| `disabled`      | `boolean`    | `false` | 비활성화 여부                         |
| `onClick`       | `() => void` | -       | 클릭 핸들러                           |
| `className`     | `string`     | `''`    | 커스텀 클래스명                       |
| `children`      | `ReactNode`  | -       | 자식 컴포넌트                         |

## 스타일링 시스템

이 컴포넌트는 뉴모피즘 디자인 시스템과 조화를 이루도록 설계되었다:

- **Tailwind 기반**: 모든 스타일이 Tailwind CSS 클래스로 구현
- **Primary 색상 사용**: 디자인 시스템의 primary 색상 변수 활용
- **부드러운 애니메이션**: 150ms ease-in-out transition 적용
- **일관된 간격**: 표준 padding과 gap 사용

## 접근성 고려사항

- **키보드 네비게이션**: `isHighlighted` prop으로 키보드 포커스 상태 표시
- **비활성화 상태**: `disabled` prop으로 상호작용 차단
- **의미론적 구조**: 순번과 콘텐츠가 명확히 구분됨
- **시각적 피드백**: 호버와 활성 상태의 명확한 시각적 차이

## 활용 예시

### 테이블 행에서 사용

```tsx
// 테이블 행에 적용
{
	tableData.map((row, index) => (
		<ListHighlightMarker
			key={row.id}
			index={index}
			totalCount={tableData.length}
			isSelected={selectedRows.includes(row.id)}
			onClick={() => handleRowSelect(row.id)}>
			<div className="grid grid-cols-4 gap-4 w-full">
				<span>{row.name}</span>
				<span>{row.email}</span>
				<span>{row.role}</span>
				<span>{row.status}</span>
			</div>
		</ListHighlightMarker>
	));
}
```

### 검색 결과에서 사용

```tsx
// 검색 결과 리스트
{
	searchResults.map((result, index) => (
		<ListHighlightMarker
			key={result.id}
			index={index}
			totalCount={searchResults.length}
			isSelected={selectedResult?.id === result.id}
			onClick={() => handleResultSelect(result)}>
			<div className="flex flex-col gap-1">
				<h4 className="font-medium text-sm">{result.title}</h4>
				<p className="text-xs text-gray-500 line-clamp-2">
					{result.description}
				</p>
			</div>
		</ListHighlightMarker>
	));
}
```

## 라이브러리 의존성

- **lucide-react**: 체크마크 아이콘 (`Check`)
- **@/lib/utils**: 클래스명 조합 유틸리티 (`cn`)
- **tailwindcss**: 모든 스타일링
