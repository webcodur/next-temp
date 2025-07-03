# Datepicker 컴포넌트 기술 문서

## 아키텍처 개요

`react-datepicker` 라이브러리를 기반으로 한 날짜/시간 선택 컴포넌트 시스템입니다. 3개의 특화된 컴포넌트로 구성되어 다양한 날짜 선택 요구사항을 충족합니다.

## 핵심 기술 스택

### 외부 의존성
- **react-datepicker**: 메인 날짜 선택 라이브러리
- **date-fns/locale/ko**: 한국어 로케일 지원
- **react-datepicker.css**: 기본 스타일시트

### 설계 원칙
- **컴포넌트 특화**: 용도별로 분리된 3개 컴포넌트
- **타입 안정성**: TypeScript로 모든 Props 타입 정의
- **커스터마이징**: 커스텀 헤더와 스타일 오버라이드
- **접근성**: 키보드 네비게이션과 포커스 관리

## 구현 세부사항

### 1. 커스텀 헤더 구현

```typescript
const renderCustomYearMonthHeader = ({
  date,
  changeYear,
  changeMonth,
}: CustomHeaderProps) => {
  const years = Array.from(
    { length: 30 },
    (_, i) => new Date().getFullYear() - 15 + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <div className="flex justify-center items-center px-2 py-2 space-x-2">
      {/* 연도/월 드롭다운 */}
    </div>
  );
};
```

**특징:**
- 현재 연도 기준 ±15년 범위의 연도 선택
- 1-12월 전체 월 선택 지원
- `neu-inset` 스타일로 일관된 디자인
- Flexbox 레이아웃으로 반응형 구성

### 2. SingleDatePicker 구현

가장 범용적인 날짜 선택 컴포넌트로, 다음 기능들을 지원:

**동적 포맷 결정:**
```typescript
const inputDateFormat =
  showTimeSelect && dateFormat === 'yyyy-MM-dd'
    ? `${dateFormat} ${timeFormat}`
    : dateFormat;
```

**핵심 기능:**
- 기본 날짜 선택
- 시간 선택 옵션 (`showTimeSelect`)
- 월/년도만 선택 (`showMonthYearPicker`)
- 최소/최대 날짜 제한
- 커스텀 포맷 지원

### 3. DateRangePicker 구현

시작/종료 날짜를 쌍으로 관리하는 컴포넌트:

**핵심 로직:**
```typescript
<DatePicker
  selectsStart
  startDate={startDate ?? undefined}
  endDate={endDate ?? undefined}
  // ...
/>
<DatePicker
  selectsEnd
  minDate={startDate ?? undefined} // 시작 날짜 이후만 선택 가능
  // ...
/>
```

**특징:**
- 고정 너비 (144px) 레이아웃
- 시작 날짜 이후만 종료 날짜 선택 가능
- `~` 구분자로 시각적 연결
- 양방향 상태 관리

### 4. TimeOnlyPicker 구현

시간만 선택하는 특화 컴포넌트:

```typescript
<DatePicker
  showTimeSelect
  showTimeSelectOnly
  timeIntervals={timeIntervals}
  timeFormat={timeFormat}
  dateFormat={timeFormat} // 시간 포맷을 날짜 포맷으로도 사용
  // ...
/>
```

**특징:**
- `showTimeSelectOnly`로 시간만 표시
- 커스터마이즈 가능한 시간 간격
- 최소/최대 시간 제한 지원

## 스타일링 시스템

### 뉴모피즘 디자인
모든 입력 필드에 일관된 스타일 적용:

```css
.neu-inset {
  /* 뉴모피즘 inset 효과 */
  box-shadow: inset 2px 2px 4px rgba(0,0,0,0.1);
}
```

### 포커스 관리
```typescript
className="focus:outline-hidden focus:ring-0"
```
- 기본 브라우저 포커스 스타일 제거
- 커스텀 포커스 스타일로 일관성 유지

### 레이아웃 제어
```typescript
style={{ width: 'fit-content', minWidth: 'fit-content' }}
```
- 콘텐츠에 맞는 동적 너비
- 고정 너비가 필요한 경우 명시적 설정

## 국제화 및 접근성

### 한국어 지원
```typescript
import { ko } from 'date-fns/locale';

<DatePicker
  locale={ko}
  // ...
/>
```

### 접근성 기능
- 키보드 네비게이션 완전 지원
- 스크린 리더 호환성
- ARIA 속성 자동 적용 (react-datepicker 내장)
- 포커스 트랩 및 모달 동작

## 성능 최적화

### 메모이제이션 고려사항
- 배열 생성 (`years`, `months`)이 매 렌더링마다 발생
- 향후 `useMemo`로 최적화 가능:

```typescript
const years = useMemo(
  () => Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - 15 + i),
  []
);
```

### 이벤트 핸들러
```typescript
const handleDateChange = (date: Date | null) => {
  onChange(date);
};
```
- 간단한 래퍼 함수로 Props 전달
- 추가 로직 삽입 지점 제공

## 확장성 고려사항

### 커스텀 스타일
현재 `className` props로 추가 스타일 지원:
```typescript
className={`기본스타일 ${className}`}
```

### 로케일 확장
다국어 지원을 위한 로케일 Props 추가 가능:
```typescript
interface DatePickerProps {
  locale?: Locale; // date-fns Locale 타입
}
```

### 테마 시스템 통합
CSS 변수를 통한 동적 테마 적용:
```css
.datepicker-input {
  background: var(--input-background);
  border-color: var(--input-border);
}
```

## 알려진 제약사항

1. **react-datepicker CSS 의존성**: 별도 CSS 파일 필요
2. **고정 스타일**: 일부 내부 스타일 오버라이드 어려움
3. **번들 크기**: date-fns 전체 로케일 포함 시 크기 증가
4. **브라우저 호환성**: 일부 구형 브라우저에서 제한적 지원

## 유지보수 가이드

### 업데이트 고려사항
- `react-datepicker` 버전 업데이트 시 API 변경 확인
- `date-fns` 로케일 업데이트 시 포맷 변경 검토
- CSS 오버라이드 스타일이 깨지지 않는지 확인

### 테스트 전략
- 각 컴포넌트별 단위 테스트
- 날짜 범위 검증 로직 테스트
- 접근성 테스트 (키보드, 스크린 리더)
- 다양한 로케일에서의 포맷 테스트 