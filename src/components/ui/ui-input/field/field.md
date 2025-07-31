# Field 컴포넌트 시스템

필드 컴포넌트는 통일된 디자인과 일관된 UX를 제공하는 폼 요소 시스템이다.

## 🎨 디자인 원칙

### 통일성 (Consistency)

- **높이 통일**: 모든 필드 `h-10` (40px) 고정
- **패딩 통일**: 모든 필드 `px-3 py-2` 표준화
- **텍스트 스타일**: `text-sm font-medium` 일관 적용
- **뉴모피즘 기반**: `neu-flat`, `neu-inset`, `neu-raised` 활용

### 접근성 (Accessibility)

- 키보드 네비게이션 완전 지원
- 스크린 리더 호환성
- 명확한 시각적 피드백
- 적절한 포커스 상태 표시

### 성능 (Performance)

- 즉각적인 호버 반응 (transition delay 제거)
- 효율적인 상태 관리
- 최적화된 렌더링

## 📦 컴포넌트 구성

### 텍스트 입력 필드

#### FieldText

기본 텍스트 입력 필드

```tsx
<FieldText
	label="사용자 이름"
	placeholder="이름을 입력하세요"
	value={name}
	onChange={setName}
	showSearchIcon={true}
	showClearButton={true}
/>
```

#### FieldPassword

비밀번호 입력 필드 (강도 표시 지원)

```tsx
<FieldPassword
	label="비밀번호"
	placeholder="비밀번호를 입력하세요"
	value={password}
	onChange={setPassword}
	showStrengthIndicator={true}
	minLength={8}
/>
```

#### FieldEmail

이메일 입력 필드 (검증 기능 포함)

```tsx
<FieldEmail
	label="이메일"
	placeholder="이메일을 입력하세요"
	value={email}
	onChange={setEmail}
	showValidation={true}
	allowedDomains={['company.com', 'partner.com']}
/>
```

### 선택 필드

#### FieldSelect

기본 드롭다운 선택 필드 (기본적으로 "전체" 옵션 포함)

```tsx
{/* 기본 사용 (전체 옵션 포함) */}
<FieldSelect
	label="카테고리"
	placeholder="카테고리를 선택하세요"
	options={categoryOptions}
	value={category}
	onChange={setCategory}
/>

{/* 전체 옵션 제외 */}
<FieldSelect
	label="카테고리"
	placeholder="카테고리를 선택하세요"
	options={categoryOptions}
	value={category}
	onChange={setCategory}
	showAllOption={false}
/>

{/* 커스텀 전체 옵션 */}
<FieldSelect
	label="카테고리"
	placeholder="카테고리를 선택하세요"
	options={categoryOptions}
	value={category}
	onChange={setCategory}
	allOptionLabel="모든 카테고리"
	allOptionValue="all"
/>
```

#### FieldSortSelect

정렬 기능이 내장된 선택 필드 (기본적으로 "전체" 옵션 포함)

```tsx
{/* 기본 사용 (전체 옵션 포함) */}
<FieldSortSelect
	label="정렬 방식"
	placeholder="정렬 기준을 선택하세요"
	options={sortOptions}
	value={sortField}
	onChange={setSortField}
	sortDirection={sortDirection}
	onSortDirectionChange={setSortDirection}
/>

{/* 커스텀 전체 옵션 */}
<FieldSortSelect
	label="정렬 방식"
	placeholder="정렬 기준을 선택하세요"
	options={sortOptions}
	value={sortField}
	onChange={setSortField}
	sortDirection={sortDirection}
	onSortDirectionChange={setSortDirection}
	allOptionLabel="정렬안함"
/>
```

### 날짜 선택 필드

#### FieldDatePicker

다양한 날짜 선택 모드 지원

```tsx
{
	/* 단일 날짜 */
}
<FieldDatePicker
	label="이벤트 날짜"
	datePickerType="single"
	value={eventDate}
	onChange={setEventDate}
/>;

{
	/* 날짜 범위 */
}
<FieldDatePicker
	label="기간 설정"
	datePickerType="range"
	startDate={startDate}
	endDate={endDate}
	onStartDateChange={setStartDate}
	onEndDateChange={setEndDate}
/>;

{
	/* 날짜 + 시간 */
}
<FieldDatePicker
	label="예약 일시"
	datePickerType="datetime"
	value={reservationTime}
	onChange={setReservationTime}
	timeIntervals={15}
/>;

{
	/* 월별 선택 */
}
<FieldDatePicker
	label="보고서 월"
	datePickerType="month"
	value={reportMonth}
	onChange={setReportMonth}
/>;
```

## 🔧 전역 스타일 시스템

### FIELD_STYLES 설정

모든 스타일이 `src/components/ui/field/core/config.ts`에서 중앙 관리된다:

```typescript
export const FIELD_STYLES = {
	// 기본 설정
	container: 'neu-flat focus:neu-inset focus:outline-hidden transition-all',
	height: 'h-10',
	padding: 'px-3 py-2',
	text: 'text-sm font-medium placeholder-gray-600 text-gray-800',

	// 아이콘 위치
	leftIcon:
		'absolute left-3 top-1/2 w-4 h-4 text-gray-700 transform -translate-y-1/2',
	rightIcon:
		'absolute right-3 top-1/2 w-4 h-4 text-gray-700 transform -translate-y-1/2',

	// 드롭다운 (강화된 보더)
	dropdown: 'bg-white/98 backdrop-blur-md border-2 border-gray-300 shadow-lg',

	// 상태별 스타일
	dropdownOptionSelected: 'bg-blue-50 text-blue-700 font-bold neu-inset',
	dropdownOptionHighlighted: 'bg-gray-50 neu-raised',

	// 기타
	label: 'block mb-1 text-sm font-medium text-gray-800',
	disabled: 'opacity-60 cursor-not-allowed',
	clearButton:
		'flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 border border-gray-300 text-gray-600 transition-all hover:bg-gray-200 hover:border-gray-400 hover:text-gray-800',
};
```

### 주요 개선사항

1. **드롭다운 보더 강화**: `border-2 border-gray-300`로 가시성 향상
2. **높이 통일**: 모든 필드 `h-10` 적용
3. **즉각적인 반응**: transition delay 완전 제거
4. **스타일 중앙화**: 중복 코드 제거, 유지보수성 향상

## 🎯 사용법

### 기본 사용

```tsx
import { FieldText } from '@/components/ui/ui-input/field/text/FieldText';
import { FieldSelect } from '@/components/ui/ui-input/field/select/FieldSelect';
import { FieldDatePicker } from '@/components/ui/ui-input/field/datepicker/FieldDatePicker';

// 검색 필드
<FieldText
  placeholder="검색어 입력"
  value={searchQuery}
  onChange={setSearchQuery}
  showSearchIcon={true}
/>

// 카테고리 선택 (기본적으로 "전체" 옵션 포함)
<FieldSelect
  placeholder="카테고리 선택"
  options={categories}
  value={selectedCategory}
  onChange={setSelectedCategory}
/>

// "전체" 옵션 제외하려면
<FieldSelect
  placeholder="카테고리 선택"
  options={categories}
  value={selectedCategory}
  onChange={setSelectedCategory}
  showAllOption={false}
/>

// 날짜 선택
<FieldDatePicker
  datePickerType="single"
  placeholder="날짜 선택"
  value={selectedDate}
  onChange={setSelectedDate}
/>
```

### 폼 통합 예시

```tsx
function ContactForm() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		category: '',
		message: '',
		eventDate: null,
	});

	return (
		<form className="space-y-4">
			<FieldText
				label="이름"
				value={formData.name}
				onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
			/>

			<FieldEmail
				label="이메일"
				value={formData.email}
				onChange={(value) => setFormData((prev) => ({ ...prev, email: value }))}
				showValidation={true}
			/>

			<FieldSelect
				label="문의 유형"
				options={inquiryTypes}
				value={formData.category}
				onChange={(value) =>
					setFormData((prev) => ({ ...prev, category: value }))
				}
			/>

			<FieldDatePicker
				label="희망 연락일"
				datePickerType="single"
				value={formData.eventDate}
				onChange={(value) =>
					setFormData((prev) => ({ ...prev, eventDate: value }))
				}
			/>
		</form>
	);
}
```

## 🔍 키보드 내비게이션

### 드롭다운 필드

- `ArrowDown/ArrowUp`: 옵션 간 이동
- `Enter`: 선택된 옵션 확정
- `Escape`: 드롭다운 닫기
- `Click Outside`: 드롭다운 자동 닫기

### 텍스트 필드

- `Enter`: onEnterPress 콜백 실행
- `Tab`: 다음 필드로 포커스 이동

## 📝 타입 정의

### 공통 타입

```typescript
interface FieldBaseProps {
	label?: string;
	disabled?: boolean;
	className?: string;
}

interface Option {
	value: string;
	label: string;
	disabled?: boolean;
}

type SortDirection = 'asc' | 'desc';
type DatePickerType = 'single' | 'range' | 'datetime' | 'month';
```

### 컴포넌트별 Props

각 컴포넌트는 `FieldBaseProps`를 확장하여 고유한 속성을 추가한다.

## 🚀 향후 계획

- 다크모드 지원 추가
- 더 많은 검증 옵션
- 커스텀 테마 지원
- 고급 드롭다운 기능 (검색, 그룹화)
- 접근성 개선 지속
